<template>
  <div class="flow-search">
    <div class="flow-input-box">
      <div class="flow-input">
        <input
          type="text"
          v-model="text"
          @input="input"
          @keydown.enter="search"
        />
        <div class="flow-btn" @click="search">
          <i class="el-icon-search"></i>
        </div>
      </div>
      <el-button
        type="primary"
        style="margin-left: 10px"
        v-show="fileType == mould && show"
        @click="addMould"
        >增加教学活动</el-button
      >
    </div>

    <div class="flow-type" @click="change">
      <i class="icon iconfont" v-show="listType == 'list'">&#xe616;</i>
      <i class="icon iconfont" v-show="listType != 'list'">&#xe619;</i>
    </div>
  </div>
</template>

<script>
import { files, mould } from "@/configs/file";
export default {
  data() {
    return {
      text: "",
      mould,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
    fileType: {
      type: [String, Number],
      defult: files[0],
    },
    listType: {
      type: String,
      default: "list",
    },
  },
  watch: {
    value(val) {
      this.text = val;
    },
  },
  methods: {
    change() {
      let value = this.listType == "list" ? "menu" : "list";
      this.$emit("change", value);
    },
    addMould() {
      this.$emit("addMould");
    },
    search() {
      this.$emit("search");
    },
    input() {
      this.$emit("input", this.text);
    },
  },
};
</script>

<style lang="less" scoped>
.flow-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  .flow-type {
    height: 34px;
    padding-left: 15px;
    display: flex;
    align-items: center;
    color: #888;
    i {
      cursor: pointer;
      font-size: 22px;
    }
  }
  .flow-input-box {
    display: flex;
    align-items: center;
  }

  .flow-input {
    height: 34px;
    width: 250px;
    position: relative;
    padding-right: 40px;
    border: 1px solid #dcdfe6;

    .flow-btn {
      width: 40px;
      height: 34px;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #dcdfe6;
      cursor: pointer;
      border-radius: 3px;
    }

    input {
      display: block;
      width: 100%;
      height: 34px;
      line-height: 32px;
      padding-left: 15px;
    }
  }
}
</style>