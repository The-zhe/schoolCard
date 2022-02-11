<template>
  <el-dialog
    :title="!id ? '新增题目' : '修改题目'"
    width="950px"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="false"
  >
    <el-form :model="dataForm" ref="dataForm" :label-position="labelPosition">
      <el-form-item label="题目类型" prop="type">
        <el-radio-group v-model="dataForm.question_type" @change="getType">
          <el-radio-button v-for="(item,index) in question" :label="item.type" :key="index">{{item.name}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学段" prop="period">
        <el-select v-model="period1" placeholder="请选择难易程度">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="学科" prop="subject">
        <el-select v-model="subject1" placeholder="请选择难易程度">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
      </el-form-item>
      
      <!------------------------------------- 单选题 ---------------------------------------------->
      <div class="judge" v-if="dataForm.question_type == 1">
        <el-form-item label="题目内容" prop="questionContent">
          <mainEditor v-model="dataForm.content"></mainEditor>
        </el-form-item>
        <div>
          <el-form-item v-for="(item,index) in dataForm.options" :key="index" :label="'选项'+String.fromCharCode(index + 65)" prop="qoption">
            <mainEditor v-model="item.optionContent"></mainEditor>
            <el-button type="danger" icon="el-icon-delete" @click="deleteHandle(item,index)"></el-button>
          </el-form-item>
        </div>
        <el-form-item label="正确答案">
          <el-radio-group v-model="dataForm.rightAnswers">
            <el-radio-button v-for="(item,index) in dataForm.options" :label="item" :key="index">{{String.fromCharCode(index + 65)}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-button
          icon="el-icon-plus"
          type="success"
          style="margin: 10px 0px 10px 0px"
          @click="addHandle()"
          >增加选项</el-button>
        </el-form-item>
        <el-form-item label="题目解析">
          <mainEditor v-model="dataForm.parsing"></mainEditor>
        </el-form-item>
        <el-form-item label="知识点">
          <el-cascader v-model="dataForm.kps"></el-cascader>
        </el-form-item>
        <el-form-item label="难易程度">
          <el-radio-group v-model="dataForm.difficulty">
            <el-radio-button label="1">高</el-radio-button>
            <el-radio-button label="2">中</el-radio-button>
            <el-radio-button label="3">低</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <!------------------------------------- 多选题 ---------------------------------------------->
      <div class="judge" v-if="dataForm.question_type == 2">
        <el-form-item label="题目内容" prop="questionContent">
          <mainEditor v-model="dataForm.content"></mainEditor>
        </el-form-item>
        <div>
          <el-form-item v-for="(item,index) in dataForm.options" :key="index" :label="'选项'+String.fromCharCode(index + 65)" prop="qoption">
            <mainEditor v-model="item.optionContent"></mainEditor>
            <el-button type="danger" icon="el-icon-delete" @click="deleteHandle(item,index)"></el-button>
          </el-form-item>
        </div>
        <el-form-item label="正确答案">
          <el-checkbox-group v-model="dataForm.rightAnswers">
            <el-checkbox-button v-for="(item,index) in dataForm.options" :label="item" :key="index">{{String.fromCharCode(index + 65)}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="">
          <el-button
          icon="el-icon-plus"
          type="success"
          style="margin: 10px 0px 10px 0px"
          @click="addHandle()"
          >增加选项</el-button>
        </el-form-item>
        <el-form-item label="题目解析">
          <mainEditor v-model="dataForm.parsing"></mainEditor>
        </el-form-item>
        <el-form-item label="知识点">
          <el-cascader v-model="dataForm.kps"></el-cascader>
        </el-form-item>
        <el-form-item label="难易程度">
          <el-radio-group v-model="dataForm.difficulty">
            <el-radio-button label="1">高</el-radio-button>
            <el-radio-button label="2">中</el-radio-button>
            <el-radio-button label="3">低</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <!------------------------------------- 判断题 ---------------------------------------------->
      <div class="judge" v-if="dataForm.question_type == 4">
        <el-form-item label="题目内容" prop="questionContent">
          <mainEditor v-model="dataForm.content"></mainEditor>
        </el-form-item>
        <el-form-item label="正确答案">
          <el-radio-group v-model="dataForm.rightAnswers">
            <el-radio-button label="A">T</el-radio-button>
            <el-radio-button label="B">F</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目解析">
          <mainEditor v-model="dataForm.parsing"></mainEditor>
        </el-form-item>
        <el-form-item label="知识点">
          <el-cascader v-model="dataForm.kps"></el-cascader>
        </el-form-item>
        <el-form-item label="难易程度">
          <el-radio-group v-model="dataForm.difficulty">
            <el-radio-button label="1">高</el-radio-button>
            <el-radio-button label="2">中</el-radio-button>
            <el-radio-button label="3">低</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <!------------------------------------- 简答题 ---------------------------------------------->
      <div class="judge" v-if="dataForm.question_type == 5">
        <el-form-item label="题目内容" prop="questionContent">
          <mainEditor v-model="dataForm.content"></mainEditor>
        </el-form-item>
        <el-form-item label="正确答案">
          <mainEditor v-model="dataForm.rightAnswers"></mainEditor>
        </el-form-item>
        <el-form-item label="题目解析">
          <mainEditor v-model="dataForm.parsing"></mainEditor>
        </el-form-item>
        <el-form-item label="知识点">
          <el-cascader v-model="dataForm.kps"></el-cascader>
        </el-form-item>
        <el-form-item label="难易程度">
          <el-radio-group v-model="dataForm.difficulty">
            <el-radio-button label="1">高</el-radio-button>
            <el-radio-button label="2">中</el-radio-button>
            <el-radio-button label="3">低</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
    <!-- <knowledge
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
    ></knowledge> -->
  </el-dialog>
</template>
<script>
import mainEditor from "./editer2";
import editer3 from "./editer3";
import Vue from "vue";
import knowledge from "./knowledge.vue";
import { mapState } from "vuex";
import grid from "@/mixins/grid";
import { questionAdd, questionDetail, questionUpdata } from "@/api/empcustomer";
export default {
  mixins: [grid],
  components: { editer3, mainEditor, knowledge },
  props: ["gradeName", "semesterName", "subjectName", "chapterName"],
  watch: {
    gradeName: function (val) {
      this.grade = val;
    },
    semesterName: function (val) {
      this.schoolTerm = val;
    },
    subjectName: function (val) {
      this.subject = val;
    },
    chapterName: function (val) {
      this.chapterId = val;
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  data() {
    return {
      subject1:null,
      period1:null,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      qOptions:[
        {
          content:''
        },
        {
          content:''
        },
        {
          content:''
        },
        {
          content:''
        },
      ],
      id: null,
      type: null,
      visible: false,
      grade: this.gradeName,
      schoolTerm: this.semesterName,
      subject: this.subjectName,
      chapterId: this.chapterName,
      labelPosition: 'top',
      kpList: null,
      kpType: null,
      question: [
        {
          type: 1,
          name: "单选题",
        },
        {
          type: 2,
          name: "多选题",
        },
        {
          type: 4,
          name: "判断题",
        },
        {
          type: 5,
          name: "简答题",
        },
      ],
      checkQuestion:'单选题',
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
        options: [
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
        ],
        kps: [], //知识点
      },
       rules: {
          period: [
            { required: true, message: '请选择学段', trigger: 'change' },
          ],
          subject: [
            { required: true, message: '请选择学科', trigger: 'change' }
          ],
          qoption: [
            { required: true, message: '请填写选项内容', trigger: 'blur' }
          ],
          questionContent: [
            { required: true, message: '请填写题目内容', trigger: 'blur' }
          ]
        }
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
    getType(val){
      console.log(val)
      this.dataForm.question_type = val
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