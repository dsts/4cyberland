<template>
  <div class="board-post-form">
    <fortune-field>
      <template #label>Name</template>

      <div class="board-post-form__submit">
        <input-text value="Anonymous" disabled />
        <btn :disabled="submitting" @click="onSubmit">Post</btn>
      </div>
    </fortune-field>

    <fortune-field>
      <template #label>Comment</template>

      <input-textarea :value.sync="fields.content"/>
    </fortune-field>

    <div v-if="error" class="board-post-form__errors">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FortuneField from '~/components/FortuneField.vue'
import InputText from '~/components/InputText.vue'
import InputTextarea from '~/components/InputTextarea.vue'
import Btn from '~/components/Btn.vue'

interface Data {
  fields: {
    content: string
  },
  submitting: boolean,
  error: string | null
}

interface Props {
  submit: Function
}

export default Vue.extend<Data, any, any, Props>({
  components: {
    FortuneField,
    InputText,
    InputTextarea,
    Btn
  },

  props: {
    submit: Function
  },

  data(): Data {
    return {
      fields: {
        content: '',
      },
      submitting: false,
      error: null
    };
  },

  methods: {
    async onSubmit() {
      this.submitting = true;
      this.error = null

      try {
        if (this.submit === undefined) {
          throw new Error('Form not wired to any action.');
        }

        await this.submit({
          content: this.fields.content
        });

        this.reset();
      } catch (e) {
        console.error(e)
        this.error = e.message
      } finally {
        this.submitting = false;
      }
    },

    reset() {
      this.fields.content = '';
    }
  }
})
</script>

<style lang="scss">
@import "~/assets/scss/variables.scss";

.board-post-form {
  max-width: 500px;

  > * {
    margin-top: ($comfort-space-base / 4);

    &:first-child {
      margin-top: 0;
    }
  }
}

.board-post-form__submit {
  display: flex;

  > *:nth-child(1) {
    flex: 1;
  }

  > *:nth-child(2) {
    margin-left: $comfort-space-close;
    flex: 0 0;
  }
}

.board-post-form__errors {
  margin-top: $comfort-space-base;
  color: $attention-color;
}
</style>
