<template>
  <el-dialog
    title="添加题目"
    class="editExam"
    width="60%"
    :show-close="false"
    :visible.sync="visible"
  >
    <div class="add_question">
      <div>知识点：</div>
      <el-cascader
        style="width: 100%"
        :show-all-levels="false"
        clearable
        :props="{
          checkStrictly: true,
          value: 'id',
          label: 'name',
          children: 'children',
        }"
        :options="kpsList"
        @change="kpsToQuestion"
      >
        <template slot-scope="{ data }">
          <span>{{ data.name }}</span>
        </template>
      </el-cascader>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="500px"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="问题" >
          <template slot-scope="scope">
            <el-collapse style="line-height: 18px">
              <el-collapse-item accordion>
                <template slot="title">
                  <div v-html="scope.row.questionContent"></div>
                </template>
                <div
                  class="option"
                  v-for="(option, index) in scope.row.options"
                  :key="index"
                >
                  <div>{{ option.sortIndex }}.</div>
                  <div v-html="option.optionContent"></div>
                  <i
                    class="el-icon-check"
                    v-if="scope.row.rightAnswers == option.sortIndex"
                    style="font-size: 22px; color: #85ba44"
                  ></i>
                </div>
                <div>答案: <span v-html="scope.row.rightAnswers"></span></div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
        <el-table-column
          prop="questionType"
          label="类型"
          width="100"
          :filters="[
            { text: '单选题', value: 1 },
            { text: '多选题', value: 2 },
            { text: '填空题', value: 3 },
            { text: '判断题', value: 4 },
            { text: '简答题', value: 5 },
            { text: '组合题', value: 6 },
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              type="primary"
              v-if="scope.row.questionType == 1"
              disable-transitions
              >单选题</el-tag
            >
            <el-tag
              disable-transitions
              type="info"
              v-else-if="scope.row.questionType == 2"
              >多选题</el-tag
            >
            <el-tag
              disable-transitions
              type="success"
              v-else-if="scope.row.questionType == 3"
              >填空题</el-tag
            >
            <el-tag
              disable-transitions
              type="warning"
              v-else-if="scope.row.questionType == 4"
              >判断题</el-tag
            >
            <el-tag
              disable-transitions
              type="primary"
              effect="plain"
              v-else-if="scope.row.questionType == 5"
              >简答题</el-tag
            >
            <el-tag
              disable-transitions
              type="info"
              effect="plain"
              v-else-if="scope.row.questionType == 6"
              >组合题</el-tag
            >
          </template>
        </el-table-column>
        <!-- <el-table-column label="知识点" width="200">
          <template slot-scope="scope">
            {{
              scope.row.kps.length == 0 || scope.row.kps[0] == null
                ? ""
                : scope.row.kps[0].name
            }}
          </template>
        </el-table-column> -->
        <el-table-column
          prop="difficulty"
          label="难度"
          width="100"
          :filters="[
            { text: '难', value: '1' },
            { text: '中等', value: '2' },
            { text: '简单', value: '3' },
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              type="primary"
              v-if="scope.row.difficulty == 1"
              disable-transitions
              >难</el-tag
            >
            <el-tag
              disable-transitions
              type="info"
              v-else-if="scope.row.difficulty == 2"
              >中等</el-tag
            >
            <el-tag
              disable-transitions
              type="success"
              v-else-if="scope.row.difficulty == 3"
              >简单</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { questionList } from "@/api/exam";
import { kpList } from "@/api/exam";
import { formatData } from "@/utils";
import { mapState } from "vuex";
export default {
  data() {
    return {
      id: null,
      examId: null,
      visible: false,
      sort: 0,
      value: "",
      kpsId: "",
      kpsList: [],
      options: [],
      tableData: [],
      multipleSelection: [],
      kpsData: {
        id: "",
        grade: "",
        subject: "",
      },
      questionData: {
        id: -1,
        grade: "",
        subject: "",
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    init(course, grade) {
      console.log("grade", grade);
      this.kpsData.subject = course;
      this.questionData.subject = course;
      this.kpsData.grade = grade;
      this.questionData.grade = grade;
      this.getKps(this.kpsData);
      this.getQuestion(this.questionData);
      this.visible = true;
    },
    kpsToQuestion(value) {
      if (value.length == 0) {
        this.questionData.id = -1;
        this.getQuestion(this.questionData);
      } else {
        this.questionData.id = value[value.length - 1];
      }
      this.getQuestion(this.questionData);
    },
    async getQuestion(from) {
      try {
        const { data } = await questionList(from);
        this.tableData = data;
      } catch (e) {
        console.log(e);
      }
    },
    async getKps(from) {
      from.id = this.user.data.uid;
      try {
        const { data } = await kpList(from);
        this.kpsList = formatData(data);
      } catch (e) {
        console.log(e);
      }
    },
    filterTag(value, row) {
      return row.questionType === value;
    },
    selectionChange(val) {
      this.multipleSelection = val;
      console.log("sub", val);
    },
    submit() {
      console.log("multipleSelection", this.multipleSelection);
      this.$emit("getSelection", this.multipleSelection);
      this.visible = false;
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
/deep/.el-collapse {
  border: none;

  .el-collapse-item__header {
    background-color: transparent;
    border: none;
    height: inherit;
    line-height: 18px;
  }
  .el-collapse-item__wrap {
    background-color: transparent;
  }
}
.option {
  display: flex;
}
</style>