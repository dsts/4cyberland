import { Plugin } from '@nuxt/types'
import { GlobalStateBoard } from '~/store/global';

declare module 'vue/types/vue' {
  interface Vue {
    $boardName(id: string): string | null
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $boardName(id: string): string | null
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $boardName(id: string): string | null
  }
}

const myPlugin: Plugin = (context, inject) => {
  inject('boardName', (id: string) => {
    let match = context.store.state.global.boards.find((board: GlobalStateBoard) => board.id === id)

    return match ? match.name : null;
  })
}

export default myPlugin