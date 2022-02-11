<template>
  <el-dialog
    title="答题卡命名"
    class="editName"
    width="40%"
    :visible.sync="visible"
  >
    <el-input placeholder="请输入名称" v-model="name" clearable> </el-input>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="sendName()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "group_edit",
  data() {
    return {
      id: null,
      visible: false,
      name: null,
    };
  },
  methods: {
    init(id) {
      this.id = id;
      this.visible = true;
    },
    sendName(){
      this.$emit("getName", this.name);
      this.visible = false
    }
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