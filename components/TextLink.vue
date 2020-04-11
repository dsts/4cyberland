<template>
  <nuxt-link
    class="text-link"
    :class="extraClasses"
    :to="to"
    @click.native="onClick"
  >
    <slot />
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    to: {
      default: '',
      type: String,
    },
    standout: Boolean,
    highlightActive: Boolean
  },

  computed: {
    extraClasses() {
      return {
        'text-link--highlight-active': this.highlightActive,
        'text-link--standout': this.standout
      }
    }
  },

  methods: {
    onClick(e: Event) {
      this.$emit('click');
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.text-link {
  text-decoration: none;
  color: $link-color;

  &:hover {
    color: $second-color;
  }

  &.text-link--highlight-active {
    // Only apply these styles when the highlightActive option is enabled.
    &.nuxt-link-active {
      color: $second-color;
    }
  }

  &.text-link--standout {
    text-decoration: underline;
  }
}
</style>