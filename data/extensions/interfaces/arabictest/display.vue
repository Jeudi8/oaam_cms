<template>
  <div class="class-name">
    {{ value }}
  </div>
</template>

<script>
import mixins from './vue-mixins';

export default {
  mixins: [mixins],
};
</script>

<style lang="scss" scoped>
.class-name {
  direction: rtl;
  color: var(--accent);
}
</style>
