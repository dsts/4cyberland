<template>
  <div class="board-post-box" :class="extraClasses">
    <div class="board-post-box__info">
      <span class="board-post-box__info__user">Anonymous</span>
      No. <span class="board-post-box__info__id">{{ id }}</span>

      <text-link v-for="reply in replies" :key="reply.id" class="board-post-box__info__reply" standout @click="onClickReply(reply)">&gt;&gt;{{ reply.id }}</text-link>
    </div>

    <rich-content class="board-post-box__content" :content="content" />
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
    replies: Array,
    highlight: Boolean
  },

  computed: {
    extraClasses() {
      return {
        'board-post-box--highlight': this.highlight,
      }
    }
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

.board-post-box {
  display: inline-block;
  background-color: $main-color;
  border: 1px solid $border-color;
  border-left: none;
  border-top: none;
  padding: $comfort-space-base;

  &.board-post-box--highlight {
    background: #d6bad0;
    border-color: #ba9dbf;
  }
}

.board-post-box__info__user {
  color: #117743;
  font-weight: 700;
  margin-left: $comfort-space-base;
}

.board-post-box__content {
  padding: ($comfort-space-base * 3) ($comfort-space-base * 10);
}

.board-post-box__info__reply {
  color: $link-color;
  margin-left: $comfort-space-base;
}
</style>