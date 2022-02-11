<template>
  <div class="cardEdit">
    <div class="card">
      <div class="card_deader">
        <div class="header_title">
          {{ templateName }}
          <span
            @click="editName"
            style="
              font-size: 12px;
              color: #2196f3;
              margin-left: 20px;
              cursor: pointer;
            "
            >编辑名称</span
          >

          <span style="margin: 0 8px 0 20px">科目：</span>
          <el-select v-model="course" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="btn">
          <el-button
            type="success"
            style="padding: 9px 20px !important"
            @click="back()"
            >返回</el-button
          >
          <el-button
            type="danger"
            style="padding: 9px 20px !important"
            @click="allDelete"
            >批量删除</el-button
          >
          <el-button
            @click="addQuestion()"
            style="
              width: 100px;
              background-color: rgba(254, 189, 43, 1);
              color: white;
              padding: 9px 20px !important;
            "
            >添加</el-button
          >
          <el-button
            type="primary"
            style="width: 100px; padding: 9px 20px !important"
            @click="submit()"
            >保存</el-button
          >
        </div>
      </div>
      <div class="card_main">
        <el-table
          :data="tableData"
          ref="card"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column label="序号" width="100">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            label="题目类型"
            prop="type"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.questionType == 1">单选题</div>
              <div v-else-if="scope.row.questionType == 2">多选题</div>
              <div v-else-if="scope.row.questionType == 4">判断题</div>
              <div v-else-if="scope.row.questionType == 5">简答题</div>
            </template>
          </el-table-column>
          <el-table-column label="正确答案" align="center">
            <template slot-scope="scope">
              <el-radio-group
                v-if="scope.row.questionType == 1"
                v-model="scope.row.paperRightAnswers"
              >
                <el-radio-button
                  v-for="(item, index) in scope.row.paperOptions"
                  :key="index"
                  :label="item"
                ></el-radio-button>
              </el-radio-group>
              <el-checkbox-group
                v-else-if="scope.row.questionType == 2"
                v-model="scope.row.paperRightAnswers"
              >
                <el-checkbox-button
                  v-for="(item, index) in scope.row.paperOptions"
                  :key="index"
                  :label="item"
                ></el-checkbox-button>
              </el-checkbox-group>
              <el-radio-group
                v-else-if="scope.row.questionType == 4"
                v-model="scope.row.paperRightAnswers"
              >
                <el-radio-button
                  v-for="(item, index) in scope.row.paperOptions"
                  :key="index"
                  :label="item"
                ></el-radio-button>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="分值" align="center" width="120">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.score"
                style="width: 50px"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="题号" align="center" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sort" style="width: 50px"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            align="center"
            width="220"
          >
            <template slot-scope="scope">
              <el-button
                title="人员划分"
                type="text"
                style="color: #2196f3"
                @click="indexAdd(scope.$index)"
                v-if="scope.$index != 0"
                >上移</el-button
              >
              <el-button
                title="编辑"
                type="text"
                style="color: #2196f3"
                @click="indexReduce(scope.$index)"
                v-if="scope.$index != tableData.length - 1"
                >下移</el-button
              >
              <el-button
                title="删除"
                type="text"
                style="color: rgba(236, 86, 86, 1)"
                @click="deleteQuestion(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <AddQuestion
      ref="addQuestion"
      v-if="isAdd"
      @questionNum="getNum"
    ></AddQuestion>
    <EditName ref="editName" v-if="isName" @getName="nameGet"></EditName>
  </div>
</template>
<script>
import Vue from "vue";
import AddQuestion from "./edit_addQuestion.vue";
import { dictType } from "@/api/admin";
import { cardQuestionList, saveAnswerCard } from "@/api/exam";
import EditName from "./edit_name.vue";
import { mapState } from "vuex";
export default {
  name: "cardEdit",
  components: { AddQuestion, EditName },
  data() {
    return {
      course: "",
      options: [],
      id: this.$route.query.id,
      templateName: "答题卡名称",
      isAdd: false,
      isName: false,
      templateContent: "",
      currentRowIndex: [],
      selectedData: [],
      msgData: "",
      noAnswerNum: 0,
      tableData: [],
      dataFrom: {
        id: "",
        userId: "",
      },
      cardFrom: {
        list: [],
        testPaperTemplate: {
          createdBy: 0,
          id: 0,
          templateName: "",
        },
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    handleSelectionChange(data) {
      this.selectedData = data;
    },
    allDelete() {
      var that = this;
      if (this.selectedData.length > 0) {
        this.selectedData.forEach((item, index) => {
          that.tableData.forEach((v, i) => {
            if (item === v) {
              that.tableData.splice(i, 1);
            }
          });
        });
        this.$refs.card.clearSelection();
      } else {
        this.$message({
          type: "info",
          message: "请选择要删除的题目",
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex;
    },
    editName() {
      this.isName = true;
      this.$nextTick(() => {
        this.$refs.editName.init();
      });
    },
    nameGet(value) {
      this.templateName = value;
    },
    getNum(value) {
      switch (value.type) {
        case "1":
          for (let a = 0; a < Number(value.num); a++) {
            this.tableData.push({
              id: 4,
              createdBy: this.user.data.uid,
              paperOptions: "",
              paperQuestionOptions: "ABCD",
              paperRightAnswers: "",
              questionType: 1,
              score: value.score,
              sort: this.tableData.length + 1,
              templateId: 1,
            });
          }
          this.tableData.forEach((item, index) => {
            item.paperOptions = item.paperQuestionOptions.split("");
          });
          break;
        case "2":
          for (let a = 0; a < Number(value.num); a++) {
            this.tableData.push({
              id: 4,
              createdBy: this.user.data.uid,
              paperOptions: "",
              paperQuestionOptions: "ABCD",
              paperRightAnswers: [],
              questionType: 2,
              score: value.score,
              sort: this.tableData.length + 1,
              templateId: 1,
            });
          }
          this.tableData.forEach((item, index) => {
            item.paperOptions = item.paperQuestionOptions.split("");
          });
          break;
        case "4":
          for (let a = 0; a < Number(value.num); a++) {
            this.tableData.push({
              id: 4,
              createdBy: this.user.data.uid,
              paperOptions: "",
              paperQuestionOptions: "AB",
              paperRightAnswers: "",
              questionType: 4,
              score: value.score,
              sort: this.tableData.length + 1,
              templateId: 1,
            });
          }
          this.tableData.forEach((item, index) => {
            item.paperOptions = item.paperQuestionOptions.split("");
          });
          break;
        default:
      }
    },
    addQuestion() {
      this.isAdd = true;
      this.$nextTick(() => {
        this.$refs.addQuestion.init();
      });
    },
    async save(from) {
      const params = JSON.parse(JSON.stringify(from));
      params.testPaperTemplate.courseType = this.course;
      try {
        const { data } = await saveAnswerCard(params);
        console.log(data);
        this.$message({
          type: "success",
          message: "保存成功!",
        });
        setTimeout(() => {
          this.$router.push("/exam/examItem");
        }, 1000);
      } catch {
        console.log(e);
      }
    },
    async getQuestionList() {
      this.dataFrom.id = this.id;
      this.dataFrom.userId = this.user.data.uid;
      try {
        const { data } = await cardQuestionList(this.dataFrom);
        if (data && data.testPaperTemplate.courseType) {
          this.course = data.testPaperTemplate.courseType + "";
        }

        if (data.list.length > 0) {
          data.list.forEach((item, index) => {
            this.$set(
              item,
              "paperOptions",
              item.paperQuestionOptions.split("")
            );
            if (item.questionType == 2) {
              item.paperRightAnswers = item.paperRightAnswers.split(",");
            }
          });
        }
        this.tableData = data.list;
        this.msgData = data.testPaperTemplateRes;
        this.templateName = this.msgData.templateName;
      } catch (e) {
        console.log(e);
      }
    },
    deleteQuestion(index) {
      this.$confirm("确定删除该题目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    indexAdd(index) {
      if (index != 0) {
        this.templateContent = this.tableData[index - 1]; // 获取目标上一个数据
        Vue.set(this.tableData, index - 1, this.tableData[index]); //修改索引
        Vue.set(this.tableData, index, this.templateContent);
      }
    },
    indexReduce(index) {
      if (index != this.tableData.length - 1) {
        this.templateContent = this.tableData[index + 1]; // 获取目标下一个数据
        Vue.set(this.tableData, index + 1, this.tableData[index]); //修改索引
        Vue.set(this.tableData, index, this.templateContent);
      }
    },
    submit() {
      if (!this.course) {
        return this.$message({
          type: "info",
          message: "请选择科目",
        });
      }
      this.noAnswerNum = 0;
      this.cardFrom.list = JSON.parse(JSON.stringify(this.tableData));
      this.cardFrom.list.forEach((item, index) => {
        if (item.questionType == 2) {
          item.paperRightAnswers = item.paperRightAnswers.sort().toString();
        }
      });
      this.cardFrom.testPaperTemplate.createdBy = this.user.data.uid;
      this.cardFrom.testPaperTemplate.id = this.id;
      this.cardFrom.testPaperTemplate.templateName = this.templateName;
      this.cardFrom.list.forEach((item, index) => {
        if (item.paperRightAnswers == "") {
          this.noAnswerNum++;
        }
      });
      console.log("cardFrom", this.cardFrom, this.noAnswerNum);
      if (this.noAnswerNum == 0) {
        this.save(this.cardFrom);
      } else if (this.noAnswerNum > 0) {
        this.$message({
          type: "info",
          message: "请选择答案",
        });
      }
    },
  },
  mounted() {
    dictType("course_type").then(({ data }) => {
      this.options = data;
    });
    if (this.id) {
      this.getQuestionList();
    } else {
      this.id = null;
    }
  },
};
</script>
<style lang="less" scoped>
.card {
  margin: 54px auto;
  min-height: 1200px;
  width: 1200px;
  background-color: white;
  .card_deader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    .header_title {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      display: flex;
      align-items: center;

      .header_course {
      }
    }
    .btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .el-button {
    padding: 0px !important;
  }
}
</style>