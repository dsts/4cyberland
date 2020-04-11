<template>
  <div class="board-title">
    <slot />
  </div>
</template>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.board-title {
  color: $attention-color;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -2px;
}
</style>