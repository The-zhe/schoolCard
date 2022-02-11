<template>
  <el-dialog
    :title="!id ? '新增课堂分组' : '修改'"
    class="home_edit"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :model="dataForm" ref="dataForm" :rules="rules">
      <el-form-item label="班级" prop="className">
        <el-select v-model="dataForm.className" placeholder="请选择班级" style="width:100%">
          <el-option label="1班" value="1班"></el-option>
          <el-option label="2班" value="2班"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分组方案名称" prop="groupName">
        <el-input v-model="dataForm.groupName" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="是否默认">
        <el-radio v-model="dataForm.default" label="1">是</el-radio>
        <el-radio v-model="dataForm.default" label="2">否</el-radio>
      </el-form-item>
      <el-form-item label="分组状态">
        <el-radio v-model="dataForm.groupState" label="1">固定</el-radio>
        <el-radio v-model="dataForm.groupState" label="2">临时</el-radio>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          :rows="2"
          resize="none"
          v-model="dataForm.textarea">
        </el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" style="float: right;" @click="submitForm('dataForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "home_edit",
  data() {
    return {
      id: null,
      visible: false,
      dataForm: {
        className:"",
        groupName:"",
        default:"1",
        groupState:"1",
        textarea:""
      },
      rules: {
        className: [{ required: true, message: "请选择班级", trigger: "change" }],
        groupName:[{ required: true, message: "请输入分组方案名称", trigger: "blur" }]
      },
    };
  },
  methods: {
    init(id) {
      // if(!id){
      //   this.dataForm.isOutUrl = '0'
      //   this.chooseCategory = []
      //   this.changeLink()
      // }
      // this.id = id;
      // this.visible = true;
      // this.$nextTick(() => {
      //    this.$refs["dataForm"].resetFields();
      //   //this.$refs.wangeditor.init()
      //   if (this.id) {
      //     this.getInfo();
      //   }
      // });
      this.visible = true;
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('formName',formName)
            console.log('this.$refs[formName]',this.$refs[formName])
            console.log('vaild',valid)
            console.log('this.$refs[formName].model',this.$refs[formName].model)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
  },
};
</script>