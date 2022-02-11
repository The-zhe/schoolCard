<template>
  <div class="main-wrapper">
    <template v-if="show">
      <img class="iblock" src="@/assets/cw1.png" alt="" />
      <div class="cur" @click="show = false"></div>
    </template>
    <template v-else>
      <img class="iblock" src="@/assets/cw2.png" alt="" />
      <div class="cur" @click="show = true"></div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    };
  },
};
</script>

<style lang="less" scoped>
.main-wrapper {
  margin-top: 100px !important;
  width: 1300px;
  position: relative;

  .cur {
    position: absolute;
    top: 65px;
    right: 16px;
    width: 152px;
    height: 50px;
    cursor: pointer;
  }

  .iblock {
    display: block;
    width: 100%;
  }
}
</style>