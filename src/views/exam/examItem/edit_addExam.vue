<template>
  <el-dialog title="添加试卷" :visible.sync="visible" width="50%">
    <el-form
      :model="dataFrom"
      ref="dataFrom"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="试卷名称" prop="testPaperName" width="100%">
        <el-input
          v-model="dataFrom.testPaperName"
          placeholder="请填写试卷名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="科目" prop="subjects">
        <el-select
          v-model="dataFrom.subjects"
          placeholder="请选择科目"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in subjects"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="年级" prop="grade">
        <el-select
          v-model="dataFrom.grade"
          placeholder="请选择年级"
          style="width: 100%"
        >
          <el-option label="一年级" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年份" prop="year">
        <el-select
          v-model="dataFrom.year"
          placeholder="请选择年份"
          style="width: 100%"
        >
          <el-option label="2021" value="2021"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区" prop="regionCode">
        <el-select
          v-model="dataFrom.regionCode"
          placeholder="请选择地区"
          style="width: 100%"
        >
          <el-option label="全国" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="testPaperType">
        <el-select
          v-model="dataFrom.testPaperType"
          placeholder="请选择类型"
          style="width: 100%"
        >
          <el-option label="期中" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教材" prop="teachBookType">
        <el-select
          v-model="dataFrom.teachBookType"
          placeholder="请选择教材"
          style="width: 100%"
        >
          <el-option label="浙教版" value="1"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button teachBookType="primary" @click="submitForm('dataFrom')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { dictType } from "@/api/admin";
import { mapState } from "vuex";
export default {
  name: "group_edit",
  data() {
    return {
      id: null,
      visible: false,
      subjects: [],
      dataFrom: {
        createBy: "",
        subjects: "",
        testPaperName: "",
        grade: "",
        year: "",
        regionCode: "",
        teachBookType: "",
        testPaperType: "",
        testPaperSource: "",
      },
      rules: {
        testPaperName: [
          { required: true, message: "请填写试卷名称", trigger: "blur" },
        ],
        subjects: [
          { required: true, message: "请选择科目", trigger: "change" },
        ],
        grade: [{ required: true, message: "请选择年级", trigger: "change" }],
        year: [{ required: true, message: "请选择年份", trigger: "change" }],
        regionCode: [
          { required: true, message: "请选择地区", trigger: "change" },
        ],
        testPaperType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        teachBookType: [
          { required: true, message: "请选择教材", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    init() {
      this.visible = true;
      this.dataFrom.createBy = this.user.data.uid;
      this.getSubjects();
    },
    async getSubjects() {
      try {
        const subjectData = await dictType("course_type"); //获取科目
        this.subjects.push(...subjectData.data);
        console.log("subject", this.subjects);
      } catch (e) {
        console.log(e);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.addTest(formName)
          this.visible = false;
          this.$router.push({
            path: "/exam/testDetail",
            query: {
              name: this.dataFrom.testPaperName,
              subject: this.dataFrom.subjects,
            },
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>