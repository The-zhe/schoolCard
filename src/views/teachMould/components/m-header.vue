<template>
  <div class="header">
    <div class="title">{{ title }}</div>
    <div class="input">
      <input type="text" v-model="text" @keyup.enter="onSubmit" />
      <div class="search" @click="onSubmit"><i class="el-icon-search"></i></div>
    </div>
    <router-link
      v-if="type == 'my'"
      to="/resources/teachMould/edit?type=add"
      class="add"
      ><i class="el-icon-plus"></i>新增模板</router-link
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  props: ["title", "type"],
  methods: {
    onSubmit() {
      this.$emit("search", this.text);
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  padding: 20px 0;
  align-items: center;
  .add {
    margin-left: 16px;
    width: 128px;
    height: 40px;
    background: #85ba44;
    border-radius: 2px;
    color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    i {
      font-size: 20px;
      margin-right: 5px;
    }
  }
  .input {
    display: flex;

    input {
      width: 348px;
      height: 40px;
      border: 1px solid #e0e0e0;
      border-right: 0;
      line-height: 40px;
      padding: 0 15px;
    }
    .search {
      width: 60px;
      height: 40px;
      background: #2196f3;
      border-radius: 0px 2px 2px 0px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        font-size: 20px;
      }
    }
  }
  .title {
    flex: 1;
    overflow: hidden;
    font-size: 22px;
  }
}
</style>