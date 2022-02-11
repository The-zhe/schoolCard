<template>
  <div class="layout">
    <head-top />
    <router-view class="view" />
  </div>
</template>

<script>
import HeadTop from "./headTop.vue";
export default {
  components: { HeadTop },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.layout {
  .headTop {
  }
  .view {
    margin-top: 64px;
    margin-top: 64px;
    overflow: hidden;
  }
}
</style>
