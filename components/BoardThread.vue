<template>
  <div class="board__threads">
    <board-post-first
      :key="thread.id"
      :id="thread.id"
      :url="threadUrl"
      :content="thread.content"
      @clickPostLink="clickPostLink"
    />

    <div v-for="reply in thread.replies" class="board__threads__reply">
      <div class="board__threads__reply__arrow">>></div>
      <board-post-box
        :id="reply.id"
        :content="reply.content"
        :replies="reply.replies"
        :highlight="reply.id === highlightedPost"
        @clickPostLink="clickPostLink"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BoardPostFirst from '~/components/BoardPostFirst.vue'
import BoardPostBox from '~/components/BoardPostBox.vue'
import Rule from '~/components/Rule.vue'

interface Data {
  highlightedPost: string | null,
}

export default Vue.extend<Data, any, any, any>({
  components: {
    BoardPostFirst,
    BoardPostBox,
  },

  props: {
    boardId: String,
    thread: Object
  },

  data(): Data {
    return {
      highlightedPost: null
    }
  },

  computed: {
    threadUrl(): string {
      return `/${this.boardId}/thread/${this.thread.id}`;
    }
  },

  methods: {
    clickPostLink(id: string) {
      if (id !== this.highlightedPost) {
        this.highlightedPost = id;
      } else {
        this.highlightedPost = null;
      }
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.board__threads__reply {
  margin-top: $comfort-space-base;
  display: flex;
}

.board__threads__reply__arrow {
  color: $border-color;
  flex: 0 0;
  margin-right: $comfort-space-base;
}
</style>
