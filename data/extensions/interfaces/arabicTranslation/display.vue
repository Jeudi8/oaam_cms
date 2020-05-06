<template>
  <div>{{ value }}</div>
</template>

<script>
import mixins from "./vue-mixins";

export default {
  mixins: [mixins]
};
</script>

<style lang="scss" scoped>
div {
  text-align: right;
  direction: rtl !important;
  unicode-bidi: bidi-override !important;
}
</style>
