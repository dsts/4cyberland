<template>
  <div>
    <div class="layout-default__logo-container">
      <neutral-link to="/"><logo /></neutral-link>
    </div>

    <!-- The framework wills it. -->
    <nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import NeutralLink from '~/components/NeutralLink.vue'

export default Vue.extend({
  components: {
    Logo,
    NeutralLink
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";
@import "~/assets/scss/base.scss";

.layout-default__logo-container {
  display: flex;
  justify-content: center;
}
</style>
