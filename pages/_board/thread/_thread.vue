<template>
  <div>
    <div class="thread__head">
      <board-title v-if="name">/{{ boardId }}/ - {{ name }}</board-title>
    </div>

    <rule />

    <board-post-form class="thread__form" :submit="post"/>

    <rule />

    <div v-if="loadingThread">
      Loading thread...
    </div>
    <div v-else-if="thread !== null">
      <board-thread :boardId="boardId" :thread="thread" />
    </div>
    <div v-else>
      Thread not found.
    </div>

    <rule />
      <div v-if="!loadingThread" class="thread__foot">
        <div>
          [<text-link :to="$boardUrl(boardId)">Return</text-link>]
          [<text-link @click="refresh">Update</text-link>]
          [<input-check :value.sync="autoUpdate.enabled" @update:value="resetAutoUpdate">Auto</input-check>]
          {{ autoUpdate.status }}

          <span v-if="updating">Updating...</span>
        </div>

        <div><span class="thread__foot__stat" title="Replies">{{ thread.replies.length }}</span></div>
      </div>
    <rule />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BoardTitle from '~/components/BoardTitle.vue'
import BoardThread from '~/components/BoardThread.vue'
import BoardPostForm from '~/components/BoardPostForm.vue'
import InputCheck from '~/components/InputCheck.vue'
import TextLink from '~/components/TextLink.vue'
import Rule from '~/components/Rule.vue'
import VueSetTimeout from '@netsells/vue-set-timeout'

const AUTO_UPDATE_TIME = 15000

interface Data {
  boardId: string,
  threadId: string,
  updating: boolean,
  autoUpdate: {
    enabled: boolean,
    timer: string | null,
    status: string,
    start: Date,
  }
}

export default Vue.extend<Data, any, any, any>({
  mixins: [VueSetTimeout],

  layout: 'board',

  components: {
    BoardTitle,
    BoardThread,
    BoardPostForm,
    InputCheck,
    TextLink,
    Rule
  },

  async fetch() {
    try {
      await this.$store.dispatch('boards/loadThread', { boardId: this.boardId, threadId: this.threadId })
    } catch (e) {
      // The framework does not seem to report errors thrown in this function.
      // Have to manually print to the console.
      console.error(e)
    }
  },

  data(): Data {
    return {
      boardId: this.$route.params.board,
      threadId: this.$route.params.thread,
      updating: false,
      autoUpdate: {
        enabled: false,
        start: new Date(0),
        status: '',
        timer: null
      }
    }
  },

  computed: {
    loadingThread() {
      return this.$fetchState.pending
    },

    name() {
      return this.$boardName(this.boardId)
    },

    thread() {
      let thread = this.$store.state.boards.byId[this.boardId].lookup.threadsById[this.threadId]

      if (!thread) {
        return null
      }

      return {
        id: thread.id,
        content: thread.content,
        replies: thread.replies.concat().reverse()
      }
    }
  },

  methods: {
    async post(e: any) {
      this.resetAutoUpdate();
      await this.$store.dispatch('boards/createThreadReply', {
        boardId: this.boardId,
        threadId: this.threadId,
        content: e.content
      })
    },

    async refresh() {
      this.updating = true;

      try {
        this.resetAutoUpdate();
        await this.$store.dispatch('boards/loadThread', { boardId: this.boardId, threadId: this.threadId })
      } finally {
        this.updating = false;
      }
    },

    resetAutoUpdate() {
      if (this.autoUpdate.timer) {
        this.clearTimeout(this.autoUpdate.timer)
      }

      if (this.autoUpdate.enabled) {
        const tick = () => {
          let timePassed = Date.now() - this.autoUpdate.start.getTime();

          if (timePassed > AUTO_UPDATE_TIME) {
            this.refresh().finally(() => {
              this.autoUpdate.status = '';
              this.autoUpdate.start.setTime(Date.now());
              tick();
            });
          } else {
            this.autoUpdate.timer = this.setTimeout(tick, 1000);
            this.autoUpdate.status = Math.round((AUTO_UPDATE_TIME - timePassed) / 1000);
          }
        };

        this.autoUpdate.start.setTime(Date.now());
        tick();
      } else {
        this.autoUpdate.status = '';
        this.clearTimeout(this.autoUpdate.timer);
        this.autoUpdate.timer = null;
      }
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.thread__head {
  text-align: center;
  max-width: 740px;
  padding: $comfort-space-base;
  margin: auto;
}

.thread__form {
  padding: $comfort-space-base;
  margin: auto;
}

.thread__foot {
  display: flex;
  justify-content: space-between;
}

.thread__foot__stat {
  cursor: default;
}
</style>
