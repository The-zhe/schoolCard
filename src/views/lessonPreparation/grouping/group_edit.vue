<template>
  <el-dialog
    :title="!id ? '新增课堂分组' : '编辑'"
    class="home_edit"
    :visible.sync="visible"
  >
    <el-form :model="dataForm" ref="dataForm" :rules="rules">
      <el-form-item label="班级" prop="classId">
        <el-select
          v-model="dataForm.className"
          placeholder="请选择班级"
          style="width: 100%"
        >
          <el-option
            v-for="item in classList"
            :key="item.uuid"
            :label="item.className"
            :value="item.uuid"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分组方案名称" prop="name">
        <el-input v-model="dataForm.name" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="是否默认">
        <el-radio v-model="dataForm.defaultStatus" :label="1">是</el-radio>
        <el-radio v-model="dataForm.defaultStatus" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="分组状态">
        <el-radio v-model="dataForm.fixedStatus" :label="1">固定</el-radio>
        <el-radio v-model="dataForm.fixedStatus" :label="0">临时</el-radio>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          :rows="2"
          resize="none"
          v-model="dataForm.remark"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="float: right"
          @click="submitForm('dataForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  getTeachGroupAdd,
  getTeachGroupEdit,
  getTeachGroupPlanInfo,
} from "@/api/empcustomer";
const form = {
  classId: "",
  name: "",
  defaultStatus: "0",
  fixedStatus: "0",
  remark: "",
};
export default {
  name: "group_edit",
  props: ["classList"],
  data() {
    return {
      id: null,
      visible: false,
      dataForm: { ...form },
      rules: {
        classId: [{ required: true, message: "请选择班级", trigger: "change" }],
        name: [
          { required: true, message: "请输入分组方案名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    init(id = "") {
      this.id = id;
      this.dataForm = { ...form };
      if (id) {
        this.getInfo();
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.id);
          const params = { ...this.dataForm };
          if (this.id) {
            params.id = this.id;
            await getTeachGroupEdit(params);
          } else {
            await getTeachGroupAdd(params);
          }
          this.$message({
            message: `${this.id ? "编辑" : "新增"}成功`,
            type: "success",
          });
          this.visible = false;
          this.$emit("refresh");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getInfo() {
      try {
        const { data } = await getTeachGroupPlanInfo(this.id);
        console.log('getTeachGroupPlanInfo',data)
        this.dataForm = data
      } catch (e) {}
    },
  },
};
</script>