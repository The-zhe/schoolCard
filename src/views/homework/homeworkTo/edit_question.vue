<template>
  <el-dialog
    :title="!id ? '自主编题' : '修改题目'"
    width="950px"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="false"
  >
    <el-form :model="dataForm" ref="dataForm">
      <!-- 题目类型 -->
      <div class="type">
        <div style="display: flex; align-items: center; color: #409eff">1.</div>
        <el-dropdown
          trigger="click"
          placement="bottom"
          @command="handleCommand"
        >
          <span class="el-dropdown-link" style="font-size: 16px" v-if="!id">
            {{ dataForm.question_name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <span
            class="el-dropdown-link"
            style="font-size: 16px"
            v-else-if="type == 1"
          >
            单选题
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <span
            class="el-dropdown-link"
            style="font-size: 16px"
            v-else-if="type == 2"
          >
            多选题
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <span
            class="el-dropdown-link"
            style="font-size: 16px"
            v-else-if="type == 4"
          >
            判断题
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <span
            class="el-dropdown-link"
            style="font-size: 16px"
            v-else-if="type == 5"
          >
            简答题
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :class="item.type === dataForm.question_type ? 'done' : ''"
              icon="el-icon-plus"
              v-for="(item, index) in question"
              :key="index"
              :command="item"
              >{{ item.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!------------------------------------- 判断题 ---------------------------------------------->
      <div class="judge" v-if="dataForm.question_type == 4">
        <div class="judge_title">题目编辑</div>
        <!-- <quill-editor
          v-model="dataForm.content"
          ref="myQuillEditor"
          :options="{}"
        ></quill-editor> -->
        <mainEditor v-model="dataForm.content"></mainEditor>
        <el-button
          icon="el-icon-star-on"
          type="success"
          style="margin: 80px 0px 10px 0px"
          @click="editHandle()"
          >知识点设置</el-button
        >
        <div>
          <el-tag
            v-for="(item, index) in kpList"
            :key="index"
            type="success"
            style="margin: 10px 10px 10px 0px"
            >{{ item.name }}</el-tag
          >
        </div>
        <!-- <el-input id="parse"  v-model="dataForm.parsing">
            <template slot="prepend">答案解析</template>
        </el-input> -->
        <div class="parse">
          <div class="parse_title">解析</div>
          <editer3 v-model="dataForm.parsing" proIndex="e1" :num="'1'" />
        </div>
        <div class="answer">
          <div class="answer_title">答案</div>
          <el-radio
            v-model="dataForm.rightAnswer"
            label="T"
            style="margin-left: 20px"
            >是</el-radio
          >
          <el-radio v-model="dataForm.rightAnswer" label="F">否</el-radio>
        </div>
        <div class="answer">
          <div class="answer_title">难度系数</div>
          <el-radio
            v-model="dataForm.difficulty"
            label="1"
            style="margin-left: 20px"
            >高</el-radio
          >
          <el-radio v-model="dataForm.difficulty" label="2">中</el-radio>
          <el-radio v-model="dataForm.difficulty" label="3">低</el-radio>
        </div>
      </div>

      <!------------------------------------- 简答题 ---------------------------------------------->
      <div class="judge" v-else-if="dataForm.question_type == 5">
        <div class="judge_title">题目编辑</div>
        <!-- <quill-editor
          v-model="dataForm.content"
          ref="myQuillEditor"
          :options="{}"
        ></quill-editor> -->
        <mainEditor v-model="dataForm.content"></mainEditor>
        <el-button
          icon="el-icon-star-on"
          type="success"
          style="margin: 80px 0px 10px 0px"
          @click="editHandle()"
          >知识点设置</el-button
        >
        <div>
          <el-tag
            v-for="(item, index) in kpList"
            :key="index"
            type="success"
            style="margin: 10px 10px 10px 0px"
            >{{ item.name }}</el-tag
          >
        </div>
        <!-- <el-input id="parse"  v-model="dataForm.parsing">
            <template slot="prepend">答案解析</template>
        </el-input> -->
        <div class="parse">
          <div class="parse_title">解析</div>
          <editer3 v-model="dataForm.parsing" proIndex="e1" :num="'1'" />
        </div>
        <!-- <div class="answer">
          <div class="answer_title">答案</div>
          <el-input v-model="dataForm.rightAnswers"></el-input>
        </div> -->
        <div class="answer">
          <div class="answer_title">难度系数</div>
          <el-radio
            v-model="dataForm.difficulty"
            label="1"
            style="margin-left: 20px"
            >高</el-radio
          >
          <el-radio v-model="dataForm.difficulty" label="2">中</el-radio>
          <el-radio v-model="dataForm.difficulty" label="3">低</el-radio>
        </div>
      </div>

      <!------------------------------------- 单选题 ---------------------------------------------->
      <div class="judge" v-else-if="dataForm.question_type == 1">
        <div class="judge_title">题目编辑</div>
        <!-- <quill-editor
          v-model="dataForm.content"
          ref="myQuillEditor"
          :options="{}"
        ></quill-editor> -->
        <mainEditor v-model="dataForm.content"></mainEditor>
        <el-button
          icon="el-icon-star-on"
          type="success"
          style="margin: 80px 0px 10px 0px"
          @click="editHandle()"
          >知识点设置</el-button
        >
        <div>
          <el-tag
            v-for="(item, index) in kpList"
            :key="index"
            type="success"
            style="margin: 10px 10px 10px 0px"
            >{{ item.name }}</el-tag
          >
        </div>
        <!--<div v-else>
            <el-tag v-for="(item,index) in kpList" :key="index" type="success" style="margin:10px 10px 10px 0px">{{item}}</el-tag>
          </div> -->
        <div class="parse">
          <div class="parse_title">解析</div>
          <editer3 v-model="dataForm.parsing" proIndex="e1" :num="'0'" />
        </div>
        <el-table v-if="dataForm.question_type == 1" :data="dataForm.options">
          <el-table-column prop="sortIndex" label="选项" width="60">
            <template slot-scope="scope">{{
              String.fromCharCode(scope.$index + 65)
            }}</template>
          </el-table-column>
          <el-table-column prop="optionContent " label="选项文字" width="600">
            <template slot-scope="scope">
              <el-input v-model="scope.row.optionContent"></el-input>
              <!-- <editer3 v-model="scope.row.content" :proIndex="scope.row.index" :num="scope.$index+1" /> -->
            </template>
          </el-table-column>
          <el-table-column prop="rightAnswers" label="答案" width="100">
            <template slot-scope="scope">
              <el-radio
                v-model="dataForm.rightAnswer"
                :label="String.fromCharCode(scope.$index + 65)"
                @change.native="getTemplateRow(scope.$index, scope.row)"
                ><span></span
              ></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="100">
            <template slot-scope="scope">
              <i
                class="el-icon-caret-top"
                size="medium "
                :class="scope.$index == 0 ? 'disabled' : 'add'"
                @click="indexAdd(scope.row, scope.$index)"
              ></i>
              <i
                class="el-icon-caret-bottom"
                :class="
                  scope.$index == dataForm.options.length - 1
                    ? 'disabled'
                    : 'reduce'
                "
                @click="indexReduce(scope.row, scope.$index)"
              ></i>
              <i
                class="el-icon-close"
                style="color: #ed5565; font-size: 22px"
                @click="deleteHandle(scope.row, scope.$index)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          icon="el-icon-plus"
          type="success"
          style="margin: 80px 0px 10px 0px"
          @click="addHandle()"
          >新增选项</el-button
        >
        <div class="answer">
          <div class="answer_title">难度系数</div>
          <el-radio
            v-model="dataForm.difficulty"
            label="1"
            style="margin-left: 20px"
            >高</el-radio
          >
          <el-radio v-model="dataForm.difficulty" label="2">中</el-radio>
          <el-radio v-model="dataForm.difficulty" label="3">低</el-radio>
        </div>
      </div>
      <!------------------------------------- 多选题 ---------------------------------------------->
      <div class="judge" v-else-if="dataForm.question_type == 2">
        <div class="judge_title">题目编辑</div>
        <!-- <quill-editor
          v-model="dataForm.content"
          ref="myQuillEditor"
          :options="{}"
        ></quill-editor> -->
        <mainEditor v-model="dataForm.content"></mainEditor>
        <el-button
          icon="el-icon-star-on"
          type="success"
          style="margin: 80px 0px 40px 0px"
          @click="editHandle()"
          >知识点设置</el-button
        >
        <div>
          <el-tag
            v-for="(item, index) in kpList"
            :key="index"
            type="success"
            style="margin: 10px 10px 10px 0px"
            >{{ item.name }}</el-tag>
        </div>
        <div class="parse">
          <div class="parse_title">解析</div>
          <editer3 v-model="dataForm.parsing" proIndex="e1" :num="'0'" />
        </div>
        <el-table v-if="dataForm.question_type == 2" :data="dataForm.options">
          <el-table-column prop="sortIndex" label="选项" width="60">
            <template slot-scope="scope">{{
              String.fromCharCode(scope.$index + 65)
            }}</template>
          </el-table-column>
          <el-table-column prop="optionContent " label="选项文字" width="600">
            <template slot-scope="scope">
              <el-input v-model="scope.row.optionContent"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="答案" width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.rightAnswer"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="100">
            <template slot-scope="scope">
              <i
                class="el-icon-caret-top"
                size="medium "
                :class="scope.$index == 0 ? 'disabled' : 'add'"
                @click="indexAdd(scope.row, scope.$index)"
              ></i>
              <i
                class="el-icon-caret-bottom"
                :class="
                  scope.$index == dataForm.options.length - 1
                    ? 'disabled'
                    : 'reduce'
                "
                @click="indexReduce(scope.row, scope.$index)"
              ></i>
              <i
                class="el-icon-close"
                style="color: #ed5565; font-size: 22px"
                @click="deleteHandle(scope.row, scope.$index)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          icon="el-icon-plus"
          type="success"
          style="margin: 80px 0px 40px 0px"
          @click="addHandle()"
          >新增选项</el-button
        >
        <div class="answer">
          <div class="answer_title">难度系数</div>
          <el-radio
            v-model="dataForm.difficulty"
            label="1"
            style="margin-left: 20px"
            >高</el-radio
          >
          <el-radio v-model="dataForm.difficulty" label="2">中</el-radio>
          <el-radio v-model="dataForm.difficulty" label="3">低</el-radio>
        </div>
      </div>
      <el-form-item>
        <el-button
          type="info"
          style="float: right"
          @click="cancelFrom('dataForm')"
          >取消</el-button
        >
        <el-button
          type="primary"
          style="float: right; margin-right: 30px"
          @click="submitForm('dataForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
    <knowledge
      v-if="editVisible"
      ref="edit"
      :gradeName="grade"
      :schoolTermName="schoolTerm"
      :subjectName="subject"
      :questionType="dataForm.question_type"
      :chapter="chapterId"
      @getKp="getKpList"
      @getType="getQuestionType"
      @getData="getCheckData"
    ></knowledge>
  </el-dialog>
</template>
<script>
import mainEditor from "@/views/myMaterial/questionBank/editer2";
import editer3 from "@/views/myMaterial/questionBank/editer3";
import Vue from "vue";
import knowledge from "./knowledge.vue";
import { mapState } from "vuex";
import grid from "@/mixins/grid";
import { questionAdd, questionDetail, questionUpdata } from "@/api/empcustomer";
export default {
  mixins: [grid],
  components: { editer3, mainEditor, knowledge },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  data() {
    return {
      id: null,
      type: null,
      visible: false,
      grade: this.gradeName,
      schoolTerm: this.semesterName,
      subject: this.subjectName,
      chapterId: this.chapterName,
      kpList: null,
      kpType: null,
      question: [
        {
          type: 4,
          name: "判断题",
        },
        {
          type: 5,
          name: "简答题",
        },
        {
          type: 1,
          name: "单选题",
        },
        {
          type: 2,
          name: "多选题",
        },
      ],
      dataForm: {
        id: null,
        createdBy: "",
        chapterId: this.chapterName,
        question_name: "单选",
        question_type: 1,
        content: "", //编辑题目
        parsing: "", //解析
        rightAnswer: "",
        rightAnswers: [], //答案
        difficulty: "1", //难度系数
        grade: this.gradeName,
        schoolTerm: this.semesterName,
        subject: this.subjectName,
        templateSelection: "",
        templateContent: "",
        options: [],
        kps: [], //知识点
      },
    };
  },
  methods: {
    init(id, type) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
      if (id) {
        this.id = id;
        this.type = type;
        this.dataForm.question_type = type;
        this.dataForm.id = id;
        this.$nextTick(() => {
          this.getQuestionDetail(id);
        });
      } else {
        this.id = null;
      }
    },
    getKpList(data) {
      //从获取知识点
      this.kpList = data;
    },
    getQuestionType(data) {
      (this.dataForm.kps = []), (this.kpType = data);
    },
    getCheckData(data) {
      (this.dataForm.kps = []),
        // data.forEach( item => {
        //   this.dataForm.kps.push({uuid:item.uuid})
        // });
        (this.dataForm.kps = data);
      console.log("getCheckData", this.dataForm);
    },
    getTemplateRow(index, row) {
      this.dataForm.templateSelection = row;
      // this.dataForm.rightAnswers = String.fromCharCode(this.dataForm.rightAnswers + 65)
    },
    handleCommand(command) {
      // this.$message('click on item ' + command);
      this.dataForm.question_name = command.name;
      this.dataForm.question_type = command.type;
    },
    indexAdd(item, index) {
      if (index != 0) {
        console.log("templateContent", index);
        this.dataForm.answer = "";
        this.templateContent = this.dataForm.options[index - 1]; // 获取目标上一个数据
        Vue.set(this.dataForm.options, index - 1, this.dataForm.options[index]); //修改索引
        Vue.set(this.dataForm.options, index, this.templateContent);
      }
    },
    indexReduce(item, index) {
      if (index != this.dataForm.options.length - 1) {
        // console.log("templateContent", index);
        this.dataForm.answer = "";
        this.templateContent = this.dataForm.options[index + 1]; // 获取目标下一个数据
        Vue.set(this.dataForm.options, index + 1, this.dataForm.options[index]); //修改索引
        Vue.set(this.dataForm.options, index, this.templateContent);
      }
    },
    deleteHandle(item, index) {
      this.dataForm.options.splice(index, 1);
    },
    addHandle() {
      // console.log('add',this.dataForm)
      this.dataForm.options.push({
        id: "",
        index: "",
        content: "",
      });
    },
    submitForm(formName) {
      if (this.id) {
        //编辑
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let addForm = this.$refs[formName].model;
            addForm.createdBy = this.user.data.uid;
            addForm.questionType = this.$refs[formName].model.question_type;
            addForm.questionContent = this.$refs[formName].model.content;
            addForm.analysis = this.$refs[formName].model.parsing;
            switch (this.$refs[formName].model.question_type) {
              case 1: //单选
                addForm.options.forEach((item, index) => {
                  item.sortIndex = String.fromCharCode(index + 65);
                  if (item.sortIndex == addForm.rightAnswer) {
                    item.rightAnswer = 1;
                    addForm.rightAnswers = item.sortIndex;
                  }
                });
                // this.addQuestion(addForm)
                console.log("edit", addForm);
                this.addQuestion(addForm);
                break;
              case 2: //多选
                addForm.rightAnswers = [];
                addForm.options.filter((item, index) => {
                  if (item.rightAnswer === true) {
                    addForm.rightAnswers.push(String.fromCharCode(index + 65));
                  }
                });
                addForm.options.forEach((item, index) => {
                  item.sortIndex = String.fromCharCode(index + 65);
                  addForm.rightAnswers.forEach((answer, index) => {
                    if (item.rightAnswer == true) {
                      item.rightAnswer = 1;
                    } else {
                      item.rightAnswer = 0;
                    }
                  });
                });
                addForm.rightAnswers = addForm.rightAnswers.toString();
                this.addQuestion(addForm);
                break;
              case 4: //判断
                addForm.rightAnswers = addForm.rightAnswer;
                this.addQuestion(addForm);
                break;
              case 5: //简答
                addForm.rightAnswers = addForm.parsing;
                this.addQuestion(addForm);
                break;
              default:
                console.log("添加失败");
            }
          } else {
            this.$message({
              message: "上传失败",
              type: "warning",
            });
            return false;
          }
        });
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //添加
            let addForm = this.$refs[formName].model;
            addForm.createdBy = this.user.data.uid;
            addForm.questionType = this.$refs[formName].model.question_type;
            addForm.questionContent = this.$refs[formName].model.content;
            addForm.analysis = this.$refs[formName].model.parsing;
            switch (this.$refs[formName].model.question_type) {
              case 1: //单选
                addForm.options.forEach((item, index) => {
                  item.sortIndex = String.fromCharCode(index + 65);
                  if (item.sortIndex == addForm.rightAnswer) {
                    item.rightAnswer = 1;
                    addForm.rightAnswers = item.sortIndex;
                  }
                });
                this.addQuestion(addForm);
                console.log("addForm", addForm);
                break;
              case 2: //多选
                addForm.rightAnswers = [];
                addForm.options.filter((item, index) => {
                  if (item.rightAnswer === true) {
                    addForm.rightAnswers.push(String.fromCharCode(index + 65));
                  }
                });
                addForm.options.forEach((item, index) => {
                  item.sortIndex = String.fromCharCode(index + 65);
                  addForm.rightAnswers.forEach((answer, index) => {
                    if (item.rightAnswer == true) {
                      item.rightAnswer = 1;
                    } else {
                      item.rightAnswer = 0;
                    }
                  });
                });
                addForm.rightAnswers = addForm.rightAnswers.toString();
                this.addQuestion(addForm);
                break;
              case 4: //判断
                addForm.rightAnswers = addForm.rightAnswer;
                this.addQuestion(addForm);
                break;
              case 5: //简答
                addForm.rightAnswers = addForm.parsing;
                this.addQuestion(addForm);
                break;
              default:
                console.log("添加失败");
            }
          } else {
            this.$message({
              message: "上传失败",
              type: "warning",
            });
            return false;
          }
        });
      }
      this.visible = false;
      // window.location.reload()
    },
    cancelFrom(fromName) {
      this.visible = false;
      this.$nextTick(() => {
        this.$refs[fromName].resetFields();
      });
      (this.dataForm.id = null),
        (this.dataForm.createdBy = ""),
        (this.dataForm.question_name = "单选"),
        (this.dataForm.question_type = 1),
        (this.dataForm.content = ""), //编辑题目
        (this.dataForm.parsing = ""), //解析
        (this.dataForm.rightAnswers = []), //答案
        (this.dataForm.difficulty = "1"), //难度系数
        (this.dataForm.grade = null),
        (this.dataForm.schoolTerm = null),
        (this.dataForm.subject = null),
        (this.dataForm.templateSelection = ""),
        (this.dataForm.templateContent = ""),
        (this.dataForm.options = [
          {
            index: "e1",
            rightAnswer: 0,
            optionContent: "",
            sortIndex: "",
          },
          {
            index: "e2",
            rightAnswer: 0,
            optionContent: "",
            sortIndex: "",
          },
          {
            index: "e3",
            rightAnswer: 0,
            optionContent: "",
            sortIndex: "",
          },
          {
            index: "e4",
            rightAnswer: 0,
            optionContent: "",
            sortIndex: "",
          },
        ]),
        (this.dataForm.kps = []); //知识点
      // window.location.reload()
    },
    async addQuestion(from) {
      try {
        const { data } = await questionAdd(from);
        this.$message({
          message: "上传成功",
          type: "success",
        });
      } catch (e) {
        this.$message({
          message: "上传失败",
          type: "warning",
        });
      }
    },
    async getQuestionDetail(id) {
      try {
        const { data } = await questionDetail(id);
        console.log("detail", data);
        this.dataForm.content = data.questionContent;
        this.dataForm.parsing = data.analysis;
        this.kpList = data.kps;
        console.log(this.kpList, "kpList");
        this.dataForm.options = data.options;
        this.question_type = data.questionType;
        this.dataForm.rightAnswer = data.rightAnswers;
        this.dataForm.difficulty = String(data.difficulty);
        if (data.questionType == 2) {
          this.dataForm.options.forEach((item, index) => {
            if (item.rightAnswer == "1") {
              item.rightAnswer = true;
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getquestionUpdata(form) {
      try {
        const { data } = await questionUpdata(form);
        this.$message({
          message: "修改成功",
          type: "success",
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    console.log("mounted", this.chapterId);
  },
};
</script>
<style lang="less" scoped>
.type {
  display: flex;
  flex-direction: row;
}
.done {
  display: none;
}
.disabled {
  color: #e0e0e0;
  pointer-events: none;
  font-size: 26px;
}
.add {
  color: #2196f3;
  font-size: 26px;
}
.reduce {
  color: #2196f3;
  font-size: 26px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.judge {
  margin-top: 25px;
  border-top: 1px solid #ccc;
  .judge_title {
    color: #2196f3;
    font-size: 16px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 10px 10px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #2196f3;
    color: white;
  }
  .parse {
    display: flex;
    flex-direction: row;
    //   background-color: #2196f3;
    font-size: 14px;
    font-family: Microsoft YaHei;
    border-radius: 2px;
    // border: 1px solid #e7e7e7;
    margin-bottom: 20px;
    .parse_title {
      width: 71px;
      background: #2196f3;
      color: white;
      padding: 10px 20px;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }
    input {
      padding: 0px 20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }
  .answer {
    display: flex;
    flex-direction: row;
    //   background-color: #2196f3;
    font-size: 14px;
    font-family: Microsoft YaHei;
    border-radius: 2px;
    margin-bottom: 20px;
    align-items: center;
    .answer_title {
      // width: 71px;
      background: #2196f3;
      color: white;
      padding: 10px 20px;
      border-radius: 2px;
    }
  }
  .kp {
    margin-bottom: 30px;
  }
}
</style>