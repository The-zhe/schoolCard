<template>
  <el-dialog
    title="题目来源"
    class="editExam"
    width="40%"
    :visible.sync="visible"
  >
    <div class="btn">
      <el-button type="primary" @click="getMyTest()">我的题库</el-button>
      <el-button
        style="background-color: rgba(254, 189, 43, 1); color: white"
        @click="getTest()"
        >系统题库</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "group_edit",
  data() {
    return {
      id: null,
      visible: false,
      testType: null,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    init(id) {
      this.id = id;
      this.visible = true;
    },
    getMyTest() {
      this.testType = this.user.data.uid;
      this.$emit("sendTestType", this.testType);
      this.visible = false;
    },
    getTest() {
      this.testType = '';
      this.$emit("sendTestType", this.testType);
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.btn {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
</style>