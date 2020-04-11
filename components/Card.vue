<template>
  <div class="card">
    <div v-if="title" class="card__head">
      {{ title }}
    </div>

    <div class="card__body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: String
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.card {
  border: 1px solid black;
}

.card__head {
  padding: $comfort-space-base;
  background-color: $accent-color;
}

.card__body {
  padding: $comfort-space-base;
  background-color: white;
}
</style>
