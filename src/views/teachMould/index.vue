<template>
  <div class="main-wrapper">
    <div class="teach-mould-menu">
      <router-link
        v-for="item in list"
        class="teach-mould-menu-item"
        :key="item.path"
        :to="item.path"
        :class="{ active: $route.path == item.path }"
        >{{ item.name }}</router-link
      >
    </div>
    <router-view class="teach-mould-body"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: "我的模板",
          path: "/resources/teachMould/my",
        },
        {
          name: "系统模板",
          path: "/resources/teachMould/system",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.main-wrapper {
  height: 925px;
  display: flex;
  margin-top: 94px !important;
}
.teach-mould-menu {
  width: 174px;
  margin-right: 15px;
  background: #fff;

  &-item {
    font-size: 16px;
    display: block;
    padding-left: 30px;
    height: 46px;
    line-height: 46px;
    transition: background-color 0.3s;
    position: relative;

    &:hover {
      background-color: #ecf5ff;
    }
  }
  &-item.active {
    color: #2196f3;
    background-color: #ecf5ff;

    &::before {
      content: "";
      width: 6px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2196f3;
    }
  }
}
.teach-mould-body {
  flex: 1;
  background: #fff;
}
</style>