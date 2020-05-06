<template>
  <input :id="name" :value="value" @input="emitValue" />
</template>

<script>
import mixins from "./vue-mixins";

export default {
  name: "Arabic Translation",
  mixins: [mixins],
  methods: {
    emitValue(event) {
      this.$emit("input", event.target.value);
    }
  }
};
</script>

<style lang="scss" scoped>
input {
  text-align: right;
  direction: rtl !important;
  unicode-bidi: bidi-override !important;
  border: var(--input-border-width) solid var(--input-border-color);
  border-radius: var(--border-radius);
  color: var(--input-text-color);
  background-color: var(--input-background-color);
  height: var(--input-height);
  font-size: var(--input-font-size);
  padding: var(--input-padding);
}
</style>
