<template>
  <div class="fortune-field">
    <div class="fortune-field__label"><slot name="label" /></div>

    <div class="fortune-field__content"><slot /></div>
  </div>
</template>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.fortune-field {
  display: flex;
}

.fortune-field__label {
  padding: $comfort-space-base;
  background-color: $accent-color;
  font-weight: bold;
  border: 1px solid black;
  flex: 0 0 74px;
  display: flex;
  align-items: center;
}

.fortune-field__content {
  padding-left: 1px;
  flex: 1;
}
</style>
