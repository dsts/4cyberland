<template>
  <div>
    <div class="board__head">
      <board-title v-if="name">/{{ boardId }}/ - {{ name }}</board-title>
    </div>

    <rule />

    <board-post-form class="board__form" :submit="post"/>

    <rule />

    <div v-if="!loadingBoard">
      <div v-for="(thread, index) in threads" class="board__thread">
        <rule v-if="index !== 0" />

        <div v-waypoint="{ active: !loadingThreadReplies && !posting, callback: threadWaypoint.bind(null, thread) }"></div>

        <board-thread :boardId="boardId" :thread="thread" />

        <span v-if="loadingThreadReplies === thread.id" class="board__thread__loading">
          <loading-icon />
        </span>
      </div>

      <div v-if="threads.length === 0">
        No posts.
      </div>
    </div>
    <div v-else>
      <loading-icon /> Loading board...
    </div>

    <rule />

    <template v-if="loadingThreads">
      <loading-icon /> Retrieving more threads...
    </template>

    <div v-waypoint="{ active: !loadingBoard && !posting && !loadingThreads, callback: bottomWaypoint }"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BoardTitle from '~/components/BoardTitle.vue'
import BoardThread from '~/components/BoardThread.vue'
import BoardPostForm from '~/components/BoardPostForm.vue'
import LoadingIcon from '~/components/LoadingIcon.vue'
import Rule from '~/components/Rule.vue'

interface Data {
  boardId: string,
  posting: Boolean,
  loadingThreads: boolean,
  loadingThreadReplies: string | null
}

export default Vue.extend<Data, any, any, any>({
  layout: 'board',

  components: {
    BoardTitle,
    BoardThread,
    BoardPostForm,
    LoadingIcon,
    Rule
  },

  async fetch() {
    try {
      await this.$store.dispatch('boards/loadBoard', { boardId: this.boardId })
    } catch (e) {
      // The framework does not seem to report errors thrown in this function.
      // Have to manually print to the console.
      console.error(e)
    }
  },

  data(): Data {
    return {
      boardId: this.$route.params.board,
      posting: false,
      loadingThreads: false,
      loadingThreadReplies: null
    };
  },

  computed: {
    loadingBoard() {
      return this.$fetchState.pending;
    },

    name() {
      return this.$boardName(this.boardId)
    },

    threads() {
      let boardData = this.$store.state.boards.byId[this.boardId]

      if (!boardData) {
        // Ain't got none.
        return []
      }

      return boardData.threads.map((thread: any) => ({
        id: thread.id,
        content: thread.content,
        replies: thread.replies.concat().reverse()
      }))
    }
  },

  methods: {
    async bottomWaypoint(waypoint: any) {
      if (waypoint.going === 'in') {
        try {
          this.loadingThreads = true;
          await this.$store.dispatch('boards/loadOldThreads', { boardId: this.boardId })
        } finally {
          this.loadingThreads = false;
        }
      }
    },

    async threadWaypoint(thread: any, waypoint: any) {
      if (waypoint.going === 'in') {
        try {
          this.loadingThreadReplies = thread.id;
          await this.$store.dispatch('boards/loadThreadRecentReplies', { boardId: this.boardId, threadId: thread.id })
        } finally {
          this.loadingThreadReplies = null;
        }
      }
    },

    async post(e: any) {
      try {
        this.posting = true;
        await this.$store.dispatch('boards/createThread', {
          boardId: this.boardId,
          content: e.content
        })
      } finally {
        this.posting = false;
      }
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.board__head {
  text-align: center;
  max-width: 740px;
  padding: $comfort-space-base;
  margin: auto;
}

.board__form {
  padding: $comfort-space-base;
  margin: auto;
}

.board__thread {
  position: relative;
}

.board__thread__loading {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
