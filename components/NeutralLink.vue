<template>
  <!-- Wraps any element to turn them into a link. -->
  <nuxt-link class="neutral-link" :to="to"><slot /></nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    to: String
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.neutral-link {
  text-decoration: inherit;
  color: inherit;
}
</style>