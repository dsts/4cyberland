<template>
  <div class="link-chain">
    <div class="link-chain__item">[</div>

    <div v-for="(item, index) in items" class="link-chain__item">
      <template v-if="index !== 0">/</template>

      <text-link :to="item.url">{{ item.text }}</text-link>
    </div>

    <div class="link-chain__item">]</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TextLink from '~/components/TextLink.vue'

export default Vue.extend({
  components: {
    TextLink
  },

  props: {
    items: Array
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.link-chain {
  display: flex;
  flex-wrap: wrap;
}

.link-chain__item {
  margin-left: $comfort-space-base;

  &:first-child {
    margin-left: 0;
  }
}

.link-chain__item__link {
  text-decoration: none;
  color: $link-color;
}
</style>