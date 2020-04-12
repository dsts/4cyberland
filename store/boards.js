import Vue from 'vue'

const THREAD_LOAD = 15
const THREAD_RECENT_REPLY_LOAD = 5
const THREAD_RECENT_REFRESH = 60 * 1000
const THREAD_REPLY_LOAD_MAX = 1001

export const state = () => ({
  // Board data by id.
  byId: {},
})

export const mutations = {
  // Initializes board data.
  initialize(state, data) {
    if (state.byId[data.boardId] !== undefined) {
      // Board already initialized.
      return
    }

    Vue.set(state.byId, data.boardId, {
      id: data.boardId,
      threads: [],
      threadLoadOffset: 0,

      lookup: {
        threadsById: {},
        repliesById: {}
      }
    })
  },

  pushThreads(state, data) {
    let board = state.byId[data.boardId]

    for (let serverPost of data.posts) {
      if (serverPost.id in board.lookup.threadsById) {
        // Post already exists. Ignoring it.
        continue
      }

      // Using our own object to represent a thread.
      let thread = {
        id: serverPost.id,
        content: serverPost.content,
        replies: [],
        recentRepliesLoad: new Date(0)
      }

      board.threads.push(thread)
      board.lookup.threadsById[thread.id] = thread
    }
  },

  updateThreadLoadOffset(state, data) {
    state.byId[data.boardId].threadLoadOffset = data.offset
  },

  pushThreadReplies(state, data) {
    let board = state.byId[data.boardId]
    let thread = board.lookup.threadsById[data.threadId]

    for (let serverPost of data.posts) {
      if (serverPost.id === thread.id) {
        // This is the thread itself. This must be ignored.
        continue
      }

      if (serverPost.id in board.lookup.repliesById) {
        // Post already exists. Ignoring it.
        continue
      }

      // Using our own object to represent a reply to a thread.
      let reply = {
        id: serverPost.id,
        content: serverPost.content,
        replies: [],
      }

      thread.replies.push(reply)
      board.lookup.repliesById[reply.id] = reply
    }
  },

  discardThreads(state, data) {
    let board = state.byId[data.boardId]

    board.threads.length = 0;

    for (let id in board.lookup.threadsById) {
      delete board.lookup.threadsById[id]
    }

    for (let id in board.lookup.repliesById) {
      delete board.lookup.repliesById[id]
    }
  },

  discardThreadReplies(state, data) {
    let board = state.byId[data.boardId]
    let thread = board.lookup.threadsById[data.threadId]

    for (let reply of thread.replies) {
      delete board.lookup.repliesById[reply.id]
    }

    thread.replies.length = 0
  },

  updateThreadRecentReplies(state, data) {
    let thread = state.byId[data.boardId].lookup.threadsById[data.threadId];

    thread.recentRepliesLoad = new Date()
  },

  updateReplies(state) {
    for (let post of state.posts) {
      post.replies.length = 0
    }

    for (let post of state.posts) {
      if (post.replyTo in state.lookup.repliesById) {
        state.lookup.repliesById[post.replyTo].replies.push(post)
      }
    }
  }
}

export const actions = {
  async loadBoard(context, data) {
    if (!context.state.byId[data.boardId]) {
      context.commit('initialize', data)
    }

    // The backend only allows retrieving the most recent.
    let response = await this.$cyberlandGet(`/${data.boardId}/`, {
      query: {
        thread: "0",
        num: THREAD_LOAD,
      }
    })

    // A clean slate.
    context.commit('discardThreads', {
      boardId: data.boardId
    })
  
    context.commit('pushThreads', {
      boardId: data.boardId,
      posts: response
    })
    context.commit('updateThreadLoadOffset', {
      boardId: data.boardId,
      offset: THREAD_LOAD
    })
  },

  // Loads replies in a thread.
  async loadThread(context, data) {
    if (!context.state.byId[data.boardId]) {
      context.commit('initialize', data)
    }

    let board = context.state.byId[data.boardId]

    // Gotta load all because the result set is in descending order.
    let response = await this.$cyberlandGet(`/${data.boardId}/`, {
      query: {
        thread: data.threadId,
        num: THREAD_REPLY_LOAD_MAX
      }
    })

    if (!board.lookup.threadsById[data.threadId]) {
      // First gotta find the post that started the thread.
      let post = response.find((post) => post.id === data.threadId);

      if (!post) {
        throw new Error('API did not return OP. Thread may be too long.');
      }

      context.commit('pushThreads', {
        boardId: data.boardId,
        posts: [post]
      })
    }

    // A clean slate.
    context.commit('discardThreadReplies', {
      boardId: data.boardId,
      threadId: data.threadId,
    })

    context.commit('pushThreadReplies', {
      boardId: data.boardId,
      threadId: data.threadId,
      posts: response
    })
  },

  async loadNewThreads(context, data) {
    if (!context.state.byId[data.boardId]) {
      context.commit('initialize', data)
    }

    let board = context.state.byId[data.boardId]

    // Reading up to THREAD_LOAD. Hoping not more than THREAD_LOAD threads have
    // been created since last time.
    let response = await this.$cyberlandGet(`/${data.boardId}/`, {
      query: {
        thread: "0",
        num: THREAD_LOAD,
      }
    })

    context.commit('pushThreads', {
      boardId: data.boardId,
      posts: response
    })
  },

  async loadOldThreads(context, data) {
    if (!context.state.byId[data.boardId]) {
      context.commit('initialize', data)
    }

    let board = context.state.byId[data.boardId]

    const offset = board.threadLoadOffset + THREAD_LOAD

    // The backend only allows retrieving the most recent.
    let response = await this.$cyberlandGet(`/${data.boardId}/`, {
      query: {
        thread: "0",
        num: offset,
      }
    })

    context.commit('pushThreads', {
      boardId: data.boardId,
      posts: response
    })
    context.commit('updateThreadLoadOffset', {
      boardId: data.boardId,
      offset: offset
    })
  },

  async loadThreadRecentReplies(context, data) {
    if (!context.state.byId[data.boardId]) {
      context.commit('initialize', data)
    }

    let board = context.state.byId[data.boardId]

    if (!board.lookup.threadsById[data.threadId]) {
      throw new Error('Unknown thread id.')
    }

    let thread = board.lookup.threadsById[data.threadId]

    if ((Date.now() - thread.recentRepliesLoad.getTime()) < THREAD_RECENT_REFRESH) {
      // Already have most recent replies. Do nothing.
      return
    }

    let response = await this.$cyberlandGet(`/${data.boardId}/`, {
      query: {
        thread: thread.id,
        num: THREAD_RECENT_REPLY_LOAD
      }
    })

    // A clean slate.
    context.commit('discardThreadReplies', {
      boardId: data.boardId,
      threadId: thread.id,
    })

    context.commit('pushThreadReplies', {
      boardId: data.boardId,
      threadId: thread.id,
      posts: response
    })
    context.commit('updateThreadRecentReplies', {
      boardId: data.boardId,
      threadId: thread.id,
    })
  },

  async createThread(context, data) {
    if (!context.state.byId[data.boardId]) {
      context.commit('initialize', data)
    }

    if (!data.content) {
      throw new Error('You must contribute content. Empty posts are not allowed.')
    }

    await this.$cyberlandPost(`/${data.boardId}/`, {
      data: {
        replyTo: '',
        content: data.content,
      }
    })

    await context.dispatch('loadNewThreads', {
      boardId: data.boardId
    })
  },

  async createThreadReply(context, data) {
    if (!context.state.byId[data.boardId]) {
      context.commit('initialize', data)
    }

    if (!data.content) {
      throw new Error('You must contribute content. Empty posts are not allowed.')
    }

    await this.$cyberlandPost(`/${data.boardId}/`, {
      data: {
        replyTo: data.threadId,
        content: data.content,
      }
    })

    await context.dispatch('loadThread', {
      boardId: data.boardId,
      threadId: data.threadId
    });
  }
}
