<template>
  <div>
    <div class="layout-board__head">
      <link-chain :items="boardsLinkChain" />
      <link-chain :items="metaLinkChain" />
    </div>

    <div class="layout-board__logo-container">
      <neutral-link to="/"><logo /></neutral-link>
    </div>

    <!-- The framework wills it. -->
    <nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import LinkChain from '~/components/LinkChain.vue'
import NeutralLink from '~/components/NeutralLink.vue'
import { GlobalStateBoard } from '~/store/global';

export default Vue.extend({
  components: {
    Logo,
    LinkChain,
    NeutralLink
  },

  computed: {
    boardsLinkChain() {
      return this.$store.state.global.boards.map((board: GlobalStateBoard) => ({
        text: board.id,
        url: this.$boardUrl(board.id),
      }))
    },

    metaLinkChain() {
      return [
        {
          text: 'Home',
          url: '/',
        }
      ]
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";
@import "~/assets/scss/base.scss";

.layout-board__logo-container {
  display: flex;
  justify-content: center;

  // When the logo is unable to be responsive, it will get cut down on
  // the sides.
  max-width: 100%;
  overflow: hidden;
}

.layout-board__head {
  display: flex;
  justify-content: space-between;
}
</style>
