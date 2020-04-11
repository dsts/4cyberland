<template>
  <div class="index__container">
    <card title="Boards">
      <div v-for="board in boards">
        <nuxt-link :to="board.url">{{ board.display }}</nuxt-link>
      </div>
    </card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import Card from '~/components/Card.vue'
import { GlobalStateBoard } from '~/store/global';

interface Board {
  display: string
  url: string
}

export default Vue.extend({
  components: {
    Logo,
    Card
  },

  computed: {
    boards(): Board[] {
      return this.$store.state.global.boards.map((board: GlobalStateBoard) => ({
        display: board.name,
        url: this.$boardUrl(board.id),
      }))
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.index__container {
  max-width: 740px;
  padding: $comfort-space-base;
  margin: auto;
}
</style>
