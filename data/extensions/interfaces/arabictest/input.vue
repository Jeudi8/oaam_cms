<template>
  <input :value="value" @input="emitValue" />
</template>

<script>
import mixins from './vue-mixins';

export default {
  mixins: [mixins],
  methods: {
    emitValue(event) {
      const value = event.target.value;
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  direction: rtl;
  border-radius: var(--border-radius);
}
</style>
