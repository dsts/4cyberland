<template>
  <input
    class="input-text"
    :value="value"
    :disabled="disabled"
    @input="onInput"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: String,
    disabled: Boolean
  },

  methods: {
    onInput(e: any) {
      this.$emit('update:value', e.target.value);
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.input-text {
  display: block;
  box-sizing: border-box;
  font-size: $font-size-base;
  border: 1px solid black;
  color: $text-color;
  background: white;
  line-height: 20px;
  width: 100%;
  padding-left: $comfort-space-base;
  padding-right: $comfort-space-base;
  border: 1px solid $border-color;
  outline: none;

  &[disabled] {
    background: darken(white, 10%);
  }
}
</style>
