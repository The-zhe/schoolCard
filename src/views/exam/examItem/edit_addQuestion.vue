<template>
  <el-dialog title="添加题目" :visible.sync="visible" width="30%">
    <el-form :model="dataFrom" ref="dataFrom" :rules="rules" label-width="100px">
      <el-form-item label="选择题型" prop="type">
        <el-select
          v-model="dataFrom.type"
          placeholder="请选择题型"
          style="width: 100%"
        >
          <el-option label="单选题" value="1"></el-option>
          <el-option label="多选题" value="2"></el-option>
          <el-option label="判断题" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加数量" prop="num">
        <el-input v-model="dataFrom.num"></el-input>
      </el-form-item>
      <el-form-item label="每题分值" prop="score">
        <el-input v-model="dataFrom.score"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('dataFrom')">确 定</el-button>
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
      dataFrom: {
        num: "",
        type: "",
        score: "",
      },
      rules: {
        type: [{ required: true, message: "请选择题型", trigger: "change" }],
        num: [{ required: true, message: "请输入数量", trigger: "blur" }],
        score: [{ required: true, message: "请输入分值", trigger: "blur" }],
      },
    };
  },
  methods: {
    init(id) {
      this.id = id;
      this.visible = true;
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('questionNum',this.dataFrom)
            this.visible = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
  },
};
</script>