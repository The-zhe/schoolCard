<template>
  <div>
    <tool-bar :title="id ? '编辑作业' : '新建作业'">
      <el-button class="cp-save" type="primary" @click="save('ruleForm')"
        >保存</el-button
      >
      <el-button class="cp-save" type="success" @click="release('ruleForm')"
        >发布</el-button
      >
    </tool-bar>
    <div class="homeworkTo">
      <div class="detail_main">
        <div class="detail_table">
          <div class="table_header">
            <div class="title">{{ id ? "编辑作业" : "新建作业" }}</div>
            <div class="header_msg">
              <div class="msg_detail">
                <div class="class_detail">
                  <div>发布日期：</div>
                  <el-radio-group
                    v-model="ruleForm.date"
                    size="mini"
                    @change="getHomeworkDate"
                  >
                    <el-radio-button label="今天" name="0"></el-radio-button>
                    <el-radio-button label="明天" name="1"></el-radio-button>
                    <el-radio-button label="后天" name="2"></el-radio-button>
                  </el-radio-group>
                </div>
                <div class="class_detail">
                  发布时间：{{ dataFrom.releaseTime.substring(0, 10) }}
                </div>
              </div>
            </div>
          </div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-position="right"
            label-width="80px"
            style="padding: 30px"
          >
            <el-form-item label="标题:" prop="title">
              <el-input
                placeholder="请输入标题(最多20字)"
                v-model="ruleForm.title"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="班级:" prop="classIdList">
              <el-select
                v-model="ruleForm.classIdList"
                multiple
                clearable
                placeholder="请选择"
                style="width: 1400px"
                @change="getClassId"
              >
                <el-option
                  v-for="item in teaClassList"
                  :key="item.id"
                  :label="
                    item.alias
                      ? item.alias
                      : `${item.grade}年级${item.classNo}班`
                  "
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文字说明:">
              <!-- <mainEditor
                style="width: 1400px"
                v-model="ruleForm.content"
              ></mainEditor> -->
              <el-input
                type="textarea"
                placeholder="请输入内容"
                maxlength="144"
                show-word-limit
                v-model="ruleForm.content">
              </el-input>
            </el-form-item>
            <el-form-item v-if="isEdit">
              <el-button
                type="danger"
                icon="el-icon-edit"
                @click="editCard('ruleForm')"
                >编辑答题卡</el-button
              >
              <i
                class="el-icon-delete"
                style="margin-left: 20px; cursor: pointer"
                @click="deteleCard"
              ></i>
            </el-form-item>
            <el-form-item v-else>
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="cardAdd('ruleForm')"
                >添加答题卡</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog
      title="选择答题卡类型"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <span class="juzhong">
        <el-radio v-model="addtype" label="1">书本题目</el-radio>
        <el-radio v-model="addtype" label="2">自主添加</el-radio>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toAddCard">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from "@/store";
import ToolBar from "../../../components/navigation/toolBar";
import { baseUrl, uploadUrl } from "@/configs";
import {
  classList,
  saveHomework,
  releaseHomework,
  homeWorkDeatil,
  classDetail,
  teacherDetail,
} from "@/api/schoolaffair";
import { teacherSubject } from "@/api/teach";
import { mapState } from "vuex";
import { formatDate } from "@/utils/formatTime";
import { dictType } from "@/api/admin";
// import mainEditor from "@/views/myMaterial/questionBank/editer2";
export default {
  components: { ToolBar },
  data() {
    return {
      id: this.$route.query.id, //this.$route.query.id
      isclick: true,
      isEdit: false,
      addtype: "1",
      tempType: 0,
      dialogVisible: false,
      questionList: null,
      homeworkType: this.$route.query.homeworkType,
      teacherName: this.$route.query.teacherName,
      myTeachName: "",
      subjects: null,
      date: "今天",
      isAdd: false,
      isMater: false,
      isQuestion: false,
      checkGrade: "", //收件人（班级）
      classId: "",
      serverUrl: baseUrl + uploadUrl,
      uploadName: "",
      option: "",
      firstHandlePreview: true,
      header: {
        Authorization: `Bearer ${store.state.user.access_token}`,
      },
      teachPlanName: "",
      remark: "",
      imgUrl: [],
      teaClassList: [],
      options: [],
      attachList: [],
      selectedData: [],
      ruleForm: {
        date: "今天",
        title: "",
        classIdList: [],
        content: "",
      },
      dataFrom: {
        tempType: "",
        type: "",
        blockingTime: "",
        classIdList: [],
        content: "",
        correctStatus: 0,
        createBy: 0,
        homeworkType: this.$route.query.homeworkType,
        id: this.$route.query.id,
        imgUrl: null,
        officeUrl: null,
        questionType: 0,
        releaseStatus: 0,
        releaseTime: "",
        teacherId: 0,
        title: "",
        questionList: null,
      },
      editData: "",
      rules: {
        title: [{ required: true, message: "请输入标题名称", trigger: "blur" }],
        classIdList: [
          { required: true, message: "请选择班级", trigger: "change" },
        ],
      },
      directory: [],
      cardData: {
        type: null,
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
      classList: (state) => state.user.classList,
      teachSubject: (state) => state.user.teachSubject,
    }),
  },
  methods: {
    cardAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editCard() {
      if (this.id) {
        console.log("editCard", this.id);
        localStorage.setItem("ruleForm", JSON.stringify(this.ruleForm));
        if (this.type == "1") {
          this.$router.push(`/newAnswerCard?id=${this.id}&type=1&homeworkType=${this.homeworkType}`);
        } else if (this.type == "2") {
          this.$router.push(`/cardself?id=${this.id}&type=2&homeworkType=${this.homeworkType}`);
        } else {
          console.log(this.type);
        }
      } else {
        let edit = JSON.parse(localStorage.getItem("cardDataFrom"));
        console.log(edit);
        if (edit) {
          if (edit.type == "1") {
            this.$router.push({
              name: "newAnswerCard",
              query: {
                type: "1",
              },
            });
          } else if (edit.type == "2") {
            this.$router.push({
              name: "cardself",
              query: {
                id: this.id,
                classId: this.dataFrom.classId,
                homeworkType: this.homeworkType,
                type: "2",
              },
            });
          }
        }
      }
    },
    toAddCard() {
      console.log("toAddCard", this.ruleForm);
      localStorage.setItem("ruleForm", JSON.stringify(this.ruleForm));
      if (this.addtype == "1") {
        //书本添加
        this.$router.push({
          name: "newAnswerCard",
          query: {
            type: "1",
          },
        });
      } else if (this.addtype == "2") {
        this.$router.push({
          name: "cardself",
          query: {
            id: this.id,
            classId: this.dataFrom.classId,
            homeworkType: this.homeworkType,
            type: "2",
          },
        });
      }
      console.log(this.addtype);
    },
    getHomeworkDate(val) {
      var dateTime = new Date();
      // console.log("getDate", val);
      // console.log("dateTime", dateTime);
      var hour = dateTime.getHours();
      if (hour < 10) hour = "0" + hour;
      var minutes = dateTime.getMinutes();
      if (minutes < 10) minutes = "0" + minutes;
      var seconds = dateTime.getSeconds();
      if (seconds < 10) seconds = "0" + seconds;
      switch (val) {
        case "今天":
          this.dataFrom.releaseTime = `${
            formatDate(dateTime).value
          } ${hour}:${minutes}:${seconds}`;
          break;
        case "明天":
          dateTime = dateTime.setDate(dateTime.getDate() + 1);
          dateTime = new Date(dateTime);
          this.dataFrom.releaseTime = `${
            formatDate(dateTime).value
          } ${hour}:${minutes}:${seconds}`;
          break;
        case "后天":
          dateTime = dateTime.setDate(dateTime.getDate() + 2);
          dateTime = new Date(dateTime);
          this.dataFrom.releaseTime = `${
            formatDate(dateTime).value
          } ${hour}:${minutes}:${seconds}`;
          break;
        default:
          this.$message({
            type: "warning",
            message: "时空紊乱，请联系时间管理员！",
          });
      }
    },
    getClassId(val) {
      console.log("getid", val);
    },
    deteleCard() {
      this.$confirm("此操作会删除该答题卡, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.removeItem("cardDataFrom");
          localStorage.removeItem("questionList");
          this.isEdit = false;
          this.tempType = "0";
          (this.cardData.type = null),
            this.$message({
              type: "success",
              message: "删除成功!",
            });
        })
        .catch(() => {});
    },
    save(formName) {
      console.log(this.cardData);
      if (this.cardData.type == "1") {
        //书本作业保存
        this.$refs[formName].validate((valid) => {
          if (valid && this.isclick) {
            this.dataFrom.title = this.ruleForm.title;
            this.dataFrom.classIdList = this.ruleForm.classIdList;
            this.dataFrom.content = this.ruleForm.content;
            this.dataFrom.questionList = JSON.parse(
              localStorage.getItem("questionList")
            );
            this.dataFrom.teacherId = this.user.data.uid;
            this.dataFrom.createBy = this.user.data.uid;
            if (this.dataFrom.questionList) {
              this.dataFrom.questionList.forEach((item) => {
                item.exercisePageId = item.exerciseBookPageId;
                delete item.exerciseBookPageId;
                item.exerciseTopicId = item.id;
                delete item.id;
                delete item.exerciseBookId;
              });
            }
            if (this.id) {
              if (this.questionList) {
                this.dataFrom.questionList
                  ? (this.dataFrom.tempType = "1")
                  : (this.dataFrom.tempType = "0");
              } else {
                this.dataFrom.tempType = this.tempType;
              }
            } else {
              this.dataFrom.questionList
                ? (this.dataFrom.tempType = "1")
                : (this.dataFrom.tempType = "0");
            }

            let cardDataFrom = JSON.parse(localStorage.getItem("cardDataFrom"));
            console.log("cardDataFrom", cardDataFrom);
            if (cardDataFrom) {
              this.dataFrom.type = cardDataFrom.type;
            } else {
              this.dataFrom.type = this.type;
            }
            console.log("上传", this.dataFrom);
            this.saveWork(this.dataFrom);
            localStorage.removeItem("ruleForm");
            localStorage.removeItem("questionList");
            localStorage.removeItem("cardList");
            localStorage.removeItem("cardDataFrom");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (this.cardData.type == "2") {
        this.$refs[formName].validate((valid) => {
          if (valid && this.isclick) {
            // this.dataFrom = {...this.ruleForm,...this.cardData}
            if (this.cardData.questionList) {
              this.cardData.questionList.forEach((item) => {
                if (typeof item.kpIdsTree !== "string" && item.kpIdsTree) {
                  item.kpIdsTree = JSON.stringify(item.kpIdsTree);
                }
              });
              this.cardData.questionList.forEach(item => {
                if(item.questionType == 5){
                  item.rightAnswer = ''
                  item.upImgFiles.forEach(imgfile => {
                    item.rightAnswer = item.rightAnswer + imgfile.url.split("/")[3] +"/"+imgfile.url.split("/")[4] +",";
                  })
                }
              })
              this.dataFrom.questionList = this.cardData.questionList;
              this.dataFrom.totalNum = this.cardData.totalNum;
              this.dataFrom.totalScore = this.cardData.totalScore;
            }
            this.isEdit ? (this.tempType = "1") : (this.tempType = "0");
            this.dataFrom.tempType = this.tempType;
            this.dataFrom.type = "2";
            this.dataFrom.title = this.ruleForm.title;
            this.dataFrom.content = this.ruleForm.content;
            this.dataFrom.classIdList = this.ruleForm.classIdList;
            this.dataFrom.teacherId = this.user.data.uid;
            this.dataFrom.createBy = this.user.data.uid;
            console.log("自主提交", this.dataFrom);
            this.saveWork(this.dataFrom);
            localStorage.removeItem("ruleForm");
            localStorage.removeItem("cardDataFrom");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$confirm("无答题卡，确定保存?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.dataFrom.title = this.ruleForm.title;
            this.dataFrom.content = this.ruleForm.content;
            this.dataFrom.classIdList = this.ruleForm.classIdList;
            this.dataFrom.teacherId = this.user.data.uid;
            this.dataFrom.createBy = this.user.data.uid;
            this.dataFrom.tempType = '0'
            console.log(this.dataFrom);
            this.saveWork(this.dataFrom);
          })
          .catch(() => {});
      }
    },
    async saveWork(from) {
      // 保存作业
      try {
        const { data } = await saveHomework(from);
        console.log("save", data);
        this.$message({
          type: "success",
          message: "保存成功",
        });
        localStorage.removeItem("ruleForm");
        localStorage.removeItem("questionList");
        localStorage.removeItem("cardList");
        localStorage.removeItem("cardDataFrom");
        setTimeout(() => {
          this.$router.go(-1);
        }, 200);
      } catch (e) {
        console.log(e);
        this.$message({
          type: "success",
          message: "保存失败，请重新保存",
        });
      }
    },
    release(formName) {
      console.log(this.cardData);
      if (this.cardData.type == "1") {
        //书本作业发布
        this.$refs[formName].validate((valid) => {
          if (valid && this.isclick) {
            this.dataFrom.title = this.ruleForm.title;
            this.dataFrom.classIdList = this.ruleForm.classIdList;
            this.dataFrom.content = this.ruleForm.content;
            this.dataFrom.questionList = JSON.parse(
              localStorage.getItem("questionList")
            );
            this.dataFrom.teacherId = this.user.data.uid;
            this.dataFrom.createBy = this.user.data.uid;
            if (this.dataFrom.questionList) {
              this.dataFrom.questionList.forEach((item) => {
                item.exercisePageId = item.exerciseBookPageId;
                delete item.exerciseBookPageId;
                item.exerciseTopicId = item.id;
                delete item.id;
                delete item.exerciseBookId;
              });
            }
            if (this.id) {
              if (this.questionList) {
                this.dataFrom.questionList
                  ? (this.dataFrom.tempType = "1")
                  : (this.dataFrom.tempType = "0");
              } else {
                this.dataFrom.tempType = this.tempType;
              }
            } else {
              this.dataFrom.questionList
                ? (this.dataFrom.tempType = "1")
                : (this.dataFrom.tempType = "0");
            }

            let cardDataFrom = JSON.parse(localStorage.getItem("cardDataFrom"));
            console.log("cardDataFrom", cardDataFrom);
            if (cardDataFrom) {
              this.dataFrom.type = cardDataFrom.type;
            } else {
              this.dataFrom.type = this.type;
            }
            console.log("上传", this.dataFrom);
            this.releaseWork(this.dataFrom);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (this.cardData.type == "2") {
        this.$refs[formName].validate((valid) => {
          if (valid && this.isclick) {
            // this.dataFrom = {...this.ruleForm,...this.cardData}
            if (this.cardData.questionList) {
              this.cardData.questionList.forEach((item) => {
                if (typeof item.kpIdsTree !== "string" && item.kpIdsTree) {
                  item.kpIdsTree = JSON.stringify(item.kpIdsTree);
                }
              });
              this.cardData.questionList.forEach(item => {
                if(item.questionType == 5){
                  item.rightAnswer = ''
                  item.upImgFiles.forEach(imgfile => {
                    item.rightAnswer = item.rightAnswer + imgfile.url.split("/")[3] +"/"+imgfile.url.split("/")[4] +",";
                  })
                }
              })
              this.dataFrom.questionList = this.cardData.questionList;
              this.dataFrom.totalNum = this.cardData.totalNum;
              this.dataFrom.totalScore = this.cardData.totalScore;
            }
            console.log("tempType", this.tempType);
            this.isEdit ? (this.tempType = "1") : (this.tempType = "0");
            this.dataFrom.tempType = this.tempType;
            this.dataFrom.type = "2";
            this.dataFrom.title = this.ruleForm.title;
            this.dataFrom.content = this.ruleForm.content;
            this.dataFrom.classIdList = this.ruleForm.classIdList;
            this.dataFrom.teacherId = this.user.data.uid;
            this.dataFrom.createBy = this.user.data.uid;
            console.log("自主提交", this.dataFrom);
            this.releaseWork(this.dataFrom);
            localStorage.removeItem("ruleForm");
            localStorage.removeItem("cardDataFrom");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$confirm("无答题卡，确定发布?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.dataFrom.title = this.ruleForm.title;
            this.dataFrom.content = this.ruleForm.content;
            this.dataFrom.classIdList = this.ruleForm.classIdList;
            this.dataFrom.teacherId = this.user.data.uid;
            this.dataFrom.createBy = this.user.data.uid;
            this.dataFrom.tempType = '0'
            this.releaseWork(this.dataFrom);
          })
          .catch(() => {});
      }
    },
    async releaseWork(from) {
      // 发布作业
      try {
        const { data } = await releaseHomework(from);
        console.log("release", data);
        this.$message({
          type: "success",
          message: "发布成功",
        });
        localStorage.removeItem("ruleForm");
        localStorage.removeItem("questionList");
        localStorage.removeItem("cardList");
        localStorage.removeItem("cardDataFrom");
        setTimeout(() => {
          this.$router.go(-1);
        }, 200);
      } catch (e) {
        console.log(e);
        this.$message({
          type: "success",
          message: "发布失败，请重新发布",
        });
      }
    },
    async getClassList() {
      try {
        const { data } = await classList(this.user.data.uid);
        this.teaClassList = data;
        // console.log("classList", data);
      } catch (e) {
        console.log(e);
      }
    },
    async getClassDetail(id) {
      try {
        const { data } = await classDetail(id);
        // console.log("data", data);
        this.ruleForm.clazz = `${data.grade}年级${data.classNo}班`;
        this.dataFrom.classId = data.id;
        this.dataFrom.grade = data.grade;
      } catch (e) {
        console.log(e);
      }
    },
    async getClassDetailToQuestion(id) {
      try {
        const { data } = await classDetail(id);
        // console.log("data", data);
        this.checkGrade = data.grade;
      } catch (e) {
        console.log(e);
      }
    },
    async getHomework(id) {
      try {
        const { data } = await homeWorkDeatil(id);
        console.log("homework", data);
        this.editData = data;
        this.dataFrom.content = data.content;
        this.dataFrom.homeworkType = data.homeworkType;
        this.cardData.type = data.type;
        if (JSON.parse(localStorage.getItem("ruleForm"))) {
          this.ruleForm = JSON.parse(localStorage.getItem("ruleForm"));
        } else {
          this.ruleForm.title = data.title;
          this.ruleForm.classIdList = [];
          this.ruleForm.classIdList.push(data.classId);
          this.ruleForm.content = data.content;
        }
        this.tempType = data.tempType;
        if (this.tempType == 1) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
        this.type = data.type;
        let intervalDate =
          (new Date(data.releaseTime) - new Date()) / (24 * 3600 * 1000);
        if (intervalDate <= 0) {
          this.ruleForm.date = "今天";
          this.getHomeworkDate(this.ruleForm.date);
        } else if (0 < intervalDate && intervalDate <= 1) {
          this.ruleForm.date = "明天";
          this.getHomeworkDate(this.ruleForm.date);
        } else if (1 < intervalDate && intervalDate <= 2) {
          this.ruleForm.date = "后天";
          this.getHomeworkDate(this.ruleForm.date);
        }
        this.getClassDetail(data.classId);
      } catch (e) {
        console.log(e);
      }
    },
    async getTeacher() {
      try {
        const { data } = await teacherDetail(this.user.data.uid);
        // console.log("getTeacher", data);
        this.myTeachName = data.name;
      } catch (e) {
        console.log(e);
      }
    },
    async subContent(e) {
      e.quill.deleteText(800, 1, e.quill.getText());
    },
    async getSubjects() {
      try {
        const subjectData = await dictType("course_type"); //获取科目
        this.subjects = subjectData.data;
        // console.log("subjectData", subjectData);
      } catch (e) {
        console.log(e);
        this.$message({
          message: "信息错误",
          type: "warning",
        });
      }
    }
  },
  async mounted() {
    const { data } = await teacherSubject();
    this.directory = data;
    this.getClassList();
    this.getTeacher();
    this.getSubjects();
    this.questionList = JSON.parse(localStorage.getItem("questionList"));
    if (localStorage.getItem("cardDataFrom")) {
      this.cardData = JSON.parse(localStorage.getItem("cardDataFrom"));
    }
    if (JSON.parse(localStorage.getItem("ruleForm"))) {
      this.ruleForm = JSON.parse(localStorage.getItem("ruleForm"));
    }
    if (this.id) {
      console.log('tempType',this.tempType)
    } else {
      if (this.questionList || this.cardData.questionList) {
        this.isEdit = true;
        this.ruleForm = JSON.parse(localStorage.getItem("ruleForm"));
      } else {
        this.isEdit = false;
      }
    }
    // this.ruleForm.date = "今天";
    this.$nextTick(() => {
      this.getHomeworkDate(this.ruleForm.date);
    });
    if (this.id) {
      this.getHomework(this.id);
    }
  },
};
</script>
<style lang="less" scoped>
.homeworkTo {
  margin: 84px auto;
  //   height: 1200px;
  width: 1600px;
  display: flex;
  flex-direction: column;
  .detail_main {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    margin-top: 24px;
    .detail_table {
      display: flex;
      flex-direction: column;
      // width: 900px;
      height: 100%;
      background-color: white;
      .table_header {
        padding: 30px 30px 10px 30px;
        .title {
          font-size: 18px;
          line-height: 21px;
          color: #212121;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .header_msg {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid #eeeeee;
          .msg_detail {
            display: flex;
            flex-direction: column;
            font-size: 16px;
            color: #212121;
            margin: 5px 50px;
            .class_detail {
              display: flex;
              flex-direction: row;
              align-items: center;
              font-size: 16px;
              color: #333333;
              margin: 5px 0px;
            }
          }
        }
      }
    }
    .transferList {
      padding: 10px;
      background-color: #d7edff;
      font-size: 16px;
      color: #212121;
      line-height: 20px;
    }
    .attch {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 5px 0px;
      .img {
        height: 50px;
        width: 50px;
        margin-right: 10px;
        img {
          height: 100%;
          width: 100%;
        }
        video {
          height: 100%;
          width: 100%;
        }
        audio {
          height: 100%;
          width: 100%;
        }
      }
      .uploadName {
        margin-right: 10px;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
    .progress {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 5px 0px;
      /deep/.el-progress-bar__outer {
        width: 620px;
      }
      .tag {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: 5px;
      }
    }
    .detail_rank {
      height: 500px;
      width: 460px;
      margin-left: 10px;
      background-color: white;
      .rank_header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 20px;
        .title {
          font-size: 18px;
          font-weight: bold;
          line-height: 21px;
          color: #212121;
        }
        .question_add {
          display: flex;
          flex-direction: row;
          .text {
            font-size: 14px;
            color: #2196f3;
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
      .msg {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0px 20px 20px;
      }
      /deep/ .el-input__inner {
        text-align: center;
        padding: 0px 5px !important;
        height: 30px !important;
      }
      /deep/ input::-webkit-outer-spin-button,
      /deep/ input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
      }
      /deep/ input[type="number"] {
        -moz-appearance: textfield !important;
      }
    }
    .cp-save {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .cp-nosave {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
    /deep/.avatar-uploader .el-upload {
      border: 1px dashed #2196f3;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      background-color: #eff8ff;
    }
    /deep/.avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    /deep/.avatar-uploader-icon {
      font-size: 56px;
      color: #2196f3;
      width: 320px;
      height: 180px;
      line-height: 180px;
      text-align: center;
    }
    /deep/.avatar {
      width: 320px;
      height: 180px;
      display: block;
    }

    /deep/ .cp-upload .el-upload-dragger {
      width: 320px;
      height: 180px;
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .oneBreak {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  .juzhong {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>