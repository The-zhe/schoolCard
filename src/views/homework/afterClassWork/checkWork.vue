<template>
  <div class="afterClassWork">
    <tool-bar title="查看课后作业"
      ><el-button class="cp-save" type="primary" @click="back()"
        >完成</el-button
      ></tool-bar
    >
    <div class="afterClassWork_main">
      <div class="qb_detail">
        <div class="detail_header">
          <div class="header_msg">
            <div class="msg_stu">
              <span>姓名:{{ stuName }}</span>
              <span>年级:{{ grade }}年级</span>
              <span>班级:{{ classNo }}班</span>
            </div>
            <div class="msg_score">
              <div>此题:{{ questionScore }}</div>
              <div style="margin-left: 20px">该题得分:</div>
              <el-input
                v-model="commitFrom.answerScore"
                style="width:50px;25px !important"
                @change="isNum"
              ></el-input>
            </div>
          </div>
          <div class="header_next">
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="dataFrom.size"
              layout="total, prev, pager, next"
              :total="total"
            >
            </el-pagination>
            <div>
              <el-button type="primary" @click="nextStu">下一位</el-button>
              <el-button type="primary" @click="sub">提交</el-button>
            </div>
          </div>
        </div>
        <div class="detail">
          <div class="detail_correct">
            <div v-if="questionType == 5">
              <div>
                <div class="text" v-if="questionFrom.questionId">
                  正确答案：
                </div>
                <div v-else>暂无题目</div>
                <div
                  style="
                    height: 300px;
                    width: 100%;
                    padding: 0px 20px;
                    margin-bottom: 10px;
                  "
                >
                  <el-carousel trigger="click" :autoplay="autoplay">
                    <el-carousel-item
                      v-for="(item, index) in picList"
                      :key="index"
                    >
                      <div class="pic" style="height: 100%">
                        <img
                          :src="imgPrefix + picList[index]"
                          alt=""
                          style="width: 100%; height: 100%"
                        />
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
              <div>
                <div class="text" v-if="questionFrom.questionId">
                  学生答案：
                </div>
                <div
                  style="height: 300px; width: 100%; padding: 0px 20px"
                  v-if="stuAnswer"
                >
                  <img
                    :src="imgPrefix + stuList[picIndex]"
                    alt=""
                    style="width: 100%; height: 100%"
                  />
                </div>
                <div v-else style="margin-left: 20px">该学生未提交答案</div>
              </div>
            </div>
            <div v-else>
              <div v-if="questionFrom.questionId">
                正确答案：{{ rightAnswer }}
              </div>
              <div v-if="questionFrom.questionId">
                学生答案：{{ commitAnswer }}
              </div>
              <div v-else>暂无题目</div>
            </div>

            <div class="carousel" v-if="questionType == 5">
              <el-carousel
                v-if="stuAnswer"
                type="card"
                height="100px"
                :autoplay="autoplay"
                @change="getGarousel"
              >
                <el-carousel-item v-for="(item, index) in stuList" :key="index">
                  <div class="pic" style="height: 100px">
                    <img
                      :src="imgPrefix + stuList[index]"
                      alt=""
                      style="width: 100%; height: 100%"
                    />
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <Subjective ref="editor"></Subjective>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ToolBar from "../../../components/navigation/toolBar.vue";
import Subjective from "./subjective.vue";
import {
  stuHomeworkType,
  stuHomeworkInfo,
  nextStudent,
  commitTeacher,
} from "@/api/schoolaffair";
export default {
  name: "classWork",
  components: { ToolBar, Subjective },
  data() {
    return {
      id: this.$route.query.id,
      isScore: false,
      isSub: false,
      stuName: this.$route.query.stuName,
      grade: this.$route.query.grade,
      classNo: this.$route.query.classNo,
      stuId: this.$route.query.stuId,
      changeNum: 0,
      autoplay: false,
      total: 0,
      score: 0,
      picIndex: 0,
      questionScore: 0,
      questionType: 2,
      commitAnswer: "",
      remark: "",
      rightAnswer: [],
      stuAnswer: [],
      options: [],
      optionsMore: [],
      date: [],
      value: [],
      topic: [
        {
          title: "主观题",
          value: "1",
        },
        {
          title: "客观题",
          value: "2",
        },
      ],
      picList: [],
      stuList: [],
      infoData: {},
      dataFrom: {
        homeworkId: this.$route.query.id,
        studentId: this.$route.query.stuId,
        size: 1,
        current: 1,
      },
      questionFrom: {
        homeworkId: this.$route.query.id,
        studentId: this.$route.query.stuId,
        questionId: "",
      },
      stuFrom: {
        studentId: "",
        homeworkId: this.$route.query.id,
      },
      commitFrom: {
        recordId: "",
        answerScore: "",
        teacherComment: "",
      },
    };
  },
  methods: {
    back() {
      // if(this.isSub){
      //   this.$router.go(-1);
      // }else{
      //   this.$confirm('尚未提交该题, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$router.go(-1);
      //   }).catch(() => {});
      // }
      this.$router.go(-1);
    },
    isNum(val) {
      console.log(val);
      if (!isNaN(val)) {
        console.log(this.questionScore);
        if (val < 0 || val > this.questionScore) {
          this.$message({
            type: "warning",
            message: "请输入合理的分数",
          });
          this.isScore = false;
        } else {
          this.commitFrom.answerScore = val;
          this.isScore = true;
        }
      } else {
        this.isScore = false;
        this.$message({
          type: "warning",
          message: "请输入分数",
        });
      }
    },
    change(item, index) {
      console.log(index);
      this.changeNum = index;
      this.dataFrom.type = item.value;
      this.getStuHomeworkType(this.dataFrom);
    },
    sub() {
      this.commitFrom.teacherComment = this.$refs.editor.remark;
      if (this.isScore) {
        this.getCommitTeacher(this.commitFrom);
      } else {
        this.$message({
          type: "warning",
          message: "输入分数不合理，无法批改！",
        });
      }
    },
    nextStu() {
      // if(this.isSub){
      //   this.stuFrom.studentId = this.stuId;
      //   this.stuFrom.homeworkId = this.infoData.homeworkId;
      //   this.getnextStudent(this.stuFrom);
      // }else{
      //   this.$confirm('尚未提交该题, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.stuFrom.studentId = this.stuId;
      //     this.stuFrom.homeworkId = this.infoData.homeworkId;
      //     this.getnextStudent(this.stuFrom);
      //   }).catch(() => {});
      // }
      this.stuFrom.studentId = this.stuId;
      this.stuFrom.homeworkId = this.infoData.homeworkId;
      this.getnextStudent(this.stuFrom);
    },
    toDeatil() {
      this.$router.push("./afterWorkDetail");
    },
    // optionsDeal() {
    //   if (this.infoData.answerContent) {
    //     this.stuAnswer = this.infoData.answerContent.split(",");
    //   } else {
    //     this.stuAnswer = [];
    //   }
    //   console.log("this.infoData", this.infoData);
    //   this.rightAnswer = this.infoData.rightAnswers.split(",");
    //   console.log("this.rightAnswer", this.rightAnswer);
    //   if (this.optionsMore) {
    //     this.$set(this.optionsMore, "type", 0);
    //     console.log("this.optionsMore", this.optionsMore);
    //     this.optionsMore.forEach((item, index1) => {
    //       this.stuAnswer.forEach((wrong, index3) => {
    //         if (item.sortIndex == wrong) {
    //           this.$set(item, "type", 2);
    //         }
    //       });
    //       this.rightAnswer.forEach((right, index2) => {
    //         if (item.sortIndex == right) {
    //           this.$set(item, "type", 1);
    //         }
    //       });
    //     });
    //   }
    //   console.log("this.optionsMore", this.optionsMore);
    // },
    handleCurrentChange(val) {
      console.log(val);
      this.dataFrom.current = val;
      this.commitFrom.answerScore = "";
      this.$refs.editor.remark = "";
      // this.isSub = false
      this.getStuHomeworkType(this.dataFrom);
    },
    getGarousel(val) {
      //获取当前图片
      console.log(val);
      this.picIndex = val;
    },
    async getStuHomeworkType(from) {
      try {
        const { data } = await stuHomeworkType(from);
        console.log("getStuHomeworkType", data);
        this.stuName = data.name;
        this.grade = data.classGrade;
        this.classNo = data.classNo;
        this.total = data.page.total;

        if (data.page.records.length > 0) {
          this.questionFrom.questionId = data.page.records[0];
          this.getStuHomeworkInfo(this.questionFrom);
        } else {
          console.log(this.questionFrom.questionId);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getStuHomeworkInfo(from) {
      try {
        const { data } = await stuHomeworkInfo(from);
        this.commitFrom.recordId = data.recordId;
        this.commitAnswer = data.commitAnswer;
        this.commitFrom.answerScore = data.answerScore;
        this.commitFrom.teacherComment = data.teacherComment;
        this.$refs.editor.remark = data.teacherComment;
        this.rightAnswer = data.rightAnswer;
        this.questionType = data.questionType;
        this.questionScore = data.questionScore;
        if (this.commitFrom.answerScore || this.commitFrom.answerScore === 0) {
          this.isScore = true;
        }
        if (this.questionType == 5) {
          this.rightAnswer = this.rightAnswer.slice(
            0,
            this.rightAnswer.length - 1
          );
          if (data.commitAnswer) {
            this.stuAnswer = true;
            this.stuList = data.commitAnswer.split(",");
          } else {
            this.stuAnswer = null;
          }

          this.picList = data.rightAnswer.split(",").filter((item) => item);
          console.log("this.picList", this.picList);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getnextStudent(from) {
      console.log("下一位", from);
      try {
        const { data } = await nextStudent(from);
        console.log("nextStudent", data);
        if (!isNaN(data)) {
          this.dataFrom.studentId = data;
          this.stuId = data;
          this.getStuHomeworkType(this.dataFrom);
          this.changeNum = 0;
        } else {
          this.$message({
            type: "info",
            message: data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getCommitTeacher(from) {
      //老师提交批改的作业
      console.log("批改的作业", from);
      try {
        const { data } = await commitTeacher(from);
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.isScore = true;
        // this.isSub = true
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.getStuHomeworkType(this.dataFrom);
  },
};
</script>
<style lang="less" scoped>
.afterClassWork_main {
  margin: 84px auto;
  height: 1000px;
  width: 1200px;
  display: flex;
  flex-direction: row;
  .qb_directory {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 174px;
    margin-right: 20px;
    .list_name {
      background-color: #85ba44;
      color: #ffffff;
      padding: 10px;
      text-align: center;
    }
    .dir_list {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      .list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        color: #212121;
        cursor: pointer;
        border-left: 2px solid #fff;
      }
      .qb {
        background-color: #f5f5f5;
        border-left: 2px solid #2196f3;
      }
    }
  }
  .qb_detail {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 20px;
    .detail_header {
      display: flex;
      flex-direction: column;
      padding: 0px 30px;
      margin-bottom: 30px;
      .header_msg {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        margin-bottom: 20px;
        .msg_stu {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #cccccc;
          box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          padding: 10px;
          span {
            font-size: 16px;
            margin: 0px 10px;
          }
        }
        .msg_score {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
      .header_next {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    }
    .detail {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 100%;
      .detail_main {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 550px;
        .question {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 2px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .rightAnswer {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          margin-bottom: 30px;
          .title {
            font-size: 20px;
            font-weight: bold;
            color: #212121;
            margin-right: 20px;
          }
          .text {
            font-size: 16px;
            line-height: 21px;
            color: #212121;
            margin-right: 20px;
          }
        }
        .options {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-bottom: 30px;
          .judge {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            .right {
              display: flex;
              flex-direction: row;
              align-items: center;
              background: #fff5f5;
              border: 2px solid #f81f1f;
              box-shadow: 0px 3px 5px rgba(248, 31, 31, 0.2);
              opacity: 1;
              border-radius: 2px;
              padding: 30px 50px;
              .el-icon-check {
                font-size: 32px;
                color: #f81f1f;
              }
              .right_text {
                font-size: 32px;
                color: #f81f1f;
              }
            }
            .wrong {
              display: flex;
              flex-direction: row;
              align-items: center;
              background: #f5fff9;
              border: 2px solid #2ecc71;
              box-shadow: 0px 3px 5px rgba(46, 204, 113, 0.2);
              border-radius: 2px;
              padding: 30px 50px;
              .el-icon-close {
                font-size: 32px;
                color: #2ecc71;
              }
              .wrong_text {
                font-size: 32px;
                color: #2ecc71;
              }
            }
          }
          .radio {
            display: flex;
            flex-direction: column;
            .option {
              display: flex;
              flex-direction: row;
              align-items: center;
              background: #ffffff;
              border: 1px solid #cccccc;
              opacity: 1;
              border-radius: 0px 2px 2px 0px;
              font-size: 14px;
              color: #333333;
              margin: 5px;
              .title {
                padding: 10px 15px;
                border-right: 1px solid #cccccc;
              }
              .text {
                width: 100%;
                padding: 10px;
              }
            }
          }
          .multiple {
            .list {
              width: 300px;
              float: left;
              margin: 0px 25px;
            }
            .option {
              display: flex;
              flex-direction: row;
              align-items: center;
              background: #ffffff;
              border: 1px solid #cccccc;
              opacity: 1;
              border-radius: 0px 2px 2px 0px;
              font-size: 14px;
              color: #333333;
              margin: 5px;
              .title {
                padding: 10px 15px;
                border-right: 1px solid #cccccc;
              }
              .text {
                width: 100%;
                padding: 10px;
              }
            }
          }
        }
        .pagination {
          // position: absolute;
          // bottom: 20px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 100%;
          .el-pagination.is-background .el-pager li:not(.disabled).qbive {
            background-color: #85ba44; // 进行修改背景和字体
            color: #ffffff;
          }
        }

        .right {
          display: flex;
          flex-direction: row;
          align-items: center;
          background: #ffffff;
          border: 1px solid #2ecc71;
          border-radius: 2px 0px 0px 2px;
          font-size: 14px;
          color: #333333;
          margin: 5px;
          .title {
            padding: 10px 15px;
            //   border-right: 1px solid #2ecc71;
          }
          .text {
            width: 100%;
            padding: 10px;
            background-color: #2ecc71;
            color: white;
          }
        }
        .wrong {
          display: flex;
          flex-direction: row;
          align-items: center;
          background: #ffffff;
          border: 1px solid #f81f1f;
          border-radius: 2px 0px 0px 2px;
          font-size: 14px;
          color: #333333;
          margin: 5px;
          .title {
            padding: 10px 15px;
          }
          .text {
            width: 100%;
            padding: 10px;
            background-color: #f81f1f;
            color: white;
          }
        }
      }
      .detail_correct {
        position: relative;
        height: 100%;
        width: 48%;
        border: 1px solid #e0e0e0;
        border-radius: 2px;
        padding-top: 5px;
        .carousel {
          position: absolute;
          width: 100%;
          bottom: 0px;
        }
        .text {
          padding: 5px 10px;
          font-size: 18px;
        }
        .btn {
          position: absolute;
          bottom: 0px;
        }
      }
    }
  }
  .noQuestions {
    font-size: 32px;
    color: #c2c5cf;
    margin: 0 auto;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 50px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
</style>