<template>
  <div class="rich-content">
    <client-only :placeholder="content">
      <template v-for="token in tokens">

        <template v-if="token.constructor.name === 'TextToken'">{{ token.text }}{{ '\n' }}</template>

        <template v-else-if="token.constructor.name === 'MemeArrowToken'">
          <span class="rich-content__implying">{{ token.text }}{{ '\n' }}</span>
        </template>

      </template>
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

class TextToken {
  text: string = ''

  constructor(text: string) {
    this.text = text
  }
}

class MemeArrowToken {
  text: string = ''

  constructor(text: string) {
    this.text = text
  }
}

export default Vue.extend({
  props: {
    content: String
  },

  computed: {
    tokens() {
      let tokens = []
      let lines = this.content.split('\n')

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]

        if (line.startsWith('>')) {
          tokens.push(new MemeArrowToken(line))
        } else {
          tokens.push(new TextToken(line))
        }
      }

      return tokens
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.rich-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.rich-content__implying {
  color: #789922
}
</style>