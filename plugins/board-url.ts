import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $boardUrl(id: string): void
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $boardUrl(id: string): void
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $boardUrl(id: string): void
  }
}

const myPlugin: Plugin = (context, inject) => {
  inject('boardUrl', (id: string) => `/${id}/`)
}

export default myPlugin