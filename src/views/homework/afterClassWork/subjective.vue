<template>
  <div class="subjective">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in directory"
        :key="index"
        :label="item"
      ></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == 0" style="height: 100%;">
      <!--  文本  -->
      <quill-editor
        v-model="remark"
        ref="myQuillEditor"
        style="height: 75%"
        :options="{}"
      ></quill-editor>
      <!-- <el-button
        class="btn"
        style="background-color: #febd2b; width: 100%; color: white"
        >点评本题</el-button
      > -->
    </div>
    <!--  图片  -->
    <!-- <div v-else-if="activeName == 1" style="height: 100%;">
        <div class="main">
            <img src="" alt="">
        </div>
        <el-button
        class="btn"
        style="background-color: #febd2b; width: 100%; color: white"
        >点评本题</el-button
      >
    </div> -->
    <!--  视频  -->
    <!-- <div v-else-if="activeName == 2" style="height:100%">
        <div class="main">
            <video src=""></video>
        </div>
        <el-button
        class="btn"
        style="background-color: #febd2b; width: 100%; color: white"
        >点评本题</el-button
      >
    </div> -->
    <!--  音频  -->
    <!-- <div v-else-if="activeName == 3" style="height: 100%;">
        <div class="main">
        </div>
        <el-button
        class="btn"
        style="background-color: #febd2b; width: 100%; color: white"
        >点评本题</el-button
      >
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "",
      remark: "",
      directory: ["文本", "图片", "视频", "音频"],
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(this.activeName);
    },
  },
};
</script>
<style lang="less" scoped>
.subjective {
  position: relative;
  height: 100%;
  width: 48%;
//   border: 1px solid #e0e0e0;
  border-radius: 2px;
  .btn {
    position: absolute;
    bottom: 0px;
  }
  .main{
      width: 100%;
      height: 75%;
      border: 1px solid #e0e0e0;
  }
}
</style>