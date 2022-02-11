<template>
  <div class="toolBar">
    <div class="left">{{ title }}</div>
    <div class="right">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.toolBar {
  height: 60px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 64px;
  z-index: 999;
  .left {
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 50px;
    color: #333333;
    font-size: 16px;
    font-family: Microsoft YaHei;
  }
  .right {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-right: 35px;
  }
}
</style>
