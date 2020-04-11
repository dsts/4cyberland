<template>
  <button type="button" class="btn" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: String,
    disabled: Boolean
  },

  methods: {
    onClick() {
      this.$emit('click');
    }
  }
})
</script>

<style>
.btn {
  box-sizing: border-box;
  height: 24px;
}
</style>