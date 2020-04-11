<template>
  <label>
    <input
      type="checkbox"
      :checked="value"
      :disabled="disabled"
      @change="onChange"
    />
    <slot />
  </label>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: Boolean,
    disabled: Boolean
  },

  methods: {
    onChange(e: any) {
      this.$emit('update:value', e.target.checked);
    }
  }
})
</script>

