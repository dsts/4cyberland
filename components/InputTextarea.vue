<template>
  <textarea class="input-textarea" rows="7" @input="onInput" :value="value"></textarea>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: String
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

.input-textarea {
  display: block;
  box-sizing: border-box;
  font-size: $font-size-base;
  border: 1px solid black;
  color: $text-color;
  background: white;
  line-height: 20px;
  width: 100%;
  border: 1px solid $border-color;
  outline: none;
}
</style>
