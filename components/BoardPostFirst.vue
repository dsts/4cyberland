<template>
  <div class="board-post-first">
    <div class="board-post-first__info">
      <span class="board-post-first__info__user">Anonymous</span>
      No.
      <text-link v-if="url" class="board-post-first__info__id" :to="url">{{ id }}</text-link>
      <span v-else class="board-post-first__info__id">{{ id }}</span>

      <text-link v-for="reply in replies" :key="reply.id" class="board-post-first__info__reply" standout @click="onClickReply(reply)">&gt;&gt;{{ reply.id }}</text-link>
    </div>

    <rich-content class="board-post-first__content" :content="content" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TextLink from '~/components/TextLink.vue'
import RichContent from '~/components/RichContent.vue'

export default Vue.extend({
  components: {
    TextLink,
    RichContent
  },

  props: {
    id: String,
    content: String,
    url: String,
    replies: Array
  },

  methods: {
    onClickReply(reply: any) {
      this.$emit('clickPostLink', reply.id);
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.board-post-first {
  &.highlight {
    background: #d6bad0;
    border: 1px solid #ba9dbf;
  }
}

.board-post-first__info__user {
  color: #117743;
  font-weight: 700;
  margin-left: $comfort-space-base;
}

.board-post-first__content {
  padding: ($comfort-space-base * 3) ($comfort-space-base * 10);
}

.board-post-first__info__reply {
  color: $link-color;
  margin-left: $comfort-space-base;
}
</style>