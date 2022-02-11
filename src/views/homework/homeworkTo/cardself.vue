<template>
  <div class="cardEdit">
    <div class="card">
      <div class="card_deader">
        <div class="header_title">
          {{ templateName }}
          <div style="padding: 0px 10px; font-size: 16px; margin-left: 50px">
            当前题数:{{ totalNum }}
          </div>
          <div style="padding: 0px 10px; font-size: 16px">
            当前总分:{{ totalScore == NaN ? "0" : totalScore }}
          </div>
          <div style="padding: 0px 10px; font-size: 16px; color: red">
            拍照题的图片最多上传3张！
          </div>
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
          <el-table-column label="序号" width="50">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="sort" label="题号" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sort" style="width: 50px"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="分值" align="center">
            <template slot-scope="scope">
              <el-input
                class="inputScore"
                v-model="scope.row.questionScore"
                @blur="getScore(scope.row.questionScore, scope.$index)"
                style="width: 50px"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="题目类型" prop="type" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.questionType == 1">单选题</div>
              <div v-else-if="scope.row.questionType == 2">多选题</div>
              <div v-else-if="scope.row.questionType == 4">判断题</div>
              <div v-else-if="scope.row.questionType == 5">简答题</div>
            </template>
          </el-table-column>
          <el-table-column label="正确答案" align="center" width="300">
            <template slot-scope="scope">
              <el-radio-group
                v-if="scope.row.questionType == 1"
                v-model="scope.row.rightAnswer"
              >
                <el-radio-button
                  v-for="(item, index) in scope.row.questionOptionsNum"
                  :key="index"
                  :label="String.fromCharCode(index + 65)"
                ></el-radio-button>
              </el-radio-group>
              <el-checkbox-group
                v-else-if="scope.row.questionType == 2"
                v-model="scope.row.rightAnswer"
              >
                <el-checkbox-button
                  v-for="(item, index) in scope.row.questionOptionsNum"
                  :key="index"
                  :label="String.fromCharCode(index + 65)"
                ></el-checkbox-button>
              </el-checkbox-group>
              <el-radio-group
                v-else-if="scope.row.questionType == 4"
                v-model="scope.row.rightAnswer"
              >
                <el-radio-button
                  v-for="(item, index) in scope.row.questionOptionsNum"
                  :key="index"
                  :label="String.fromCharCode(index + 65)"
                ></el-radio-button>
              </el-radio-group>
              <div v-else-if="scope.row.questionType == 5">
                <el-upload
                  :action="serverUrl"
                  :headers="header"
                  :ref="'upload' + scope.$index"
                  list-type="picture-card"
                  :limit="3"
                  :auto-upload="false"
                  :on-change="(value) => onchange(scope.$index, value)"
                  :on-success="
                    (value) => success(scope.$index, scope.row, value)
                  "
                >
                  <i
                    slot="default"
                    class="el-icon-plus"
                    style="
                      position: absolute;
                      top: 15px;
                      left: 17px;
                      font-size: 16px;
                    "
                  ></i>
                  <div slot="file" slot-scope="{ file }">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url"
                      alt=""
                    />
                    <span class="el-upload-list__item-actions">
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(scope.$index, scope.row, file)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remake" label="备注" align="center">
            <template slot-scope="scope">
              {{ scope.row.remake }}
            </template>
          </el-table-column>
          <el-table-column label="解题思路" align="center">
            <template slot-scope="scope">
              <div
                style="color: #2196f3; cursor: pointer"
                @click="toparse(scope.row, scope.$index)"
              >
                编辑
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="知识点"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.kpIdNames"
                class="item"
                effect="dark"
                :content="
                  scope.row.kpIdNames ? scope.row.kpIdNames : '暂无知识点'
                "
                placement="top"
                show-overflow-tooltip
              >
                <div
                  style="cursor: pointer"
                  @click="toKps(scope.row, scope.$index)"
                >
                  查看
                </div>
              </el-tooltip>
              <div
                v-else
                style="color: #409eff; cursor: pointer"
                @click="toKps(scope.row, scope.$index)"
              >
                添加
              </div>
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
                style="color: #2196f3; padding: 0px"
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
      <!-- <div class="pagination">
        <el-pagination
          :background="true"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pagesize"
          layout="prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <el-button>确定</el-button>
      </div> -->
    </div>
    <AddQuestion
      ref="addQuestion"
      v-if="isAdd"
      @questionNum="getNum"
    ></AddQuestion>
    <Kps ref="kps" v-if="iskps" @getKp="kpget"></Kps>
    <ParseSelf
      ref="parseEdit"
      v-if="isparse"
      @analysis="getAnalysis"
    ></ParseSelf>
    <!-- <EditName ref="editName" v-if="isName" @getName="nameGet"></EditName> -->
  </div>
</template>
<script>
import Vue from "vue";
import AddQuestion from "./cardDialog/addQuestion.vue";
import Kps from "./cardDialog/cardKnowledge.vue";
import { cardQuestionList } from "@/api/exam";
import ParseSelf from "./cardDialog/parseSelf.vue";
import { homeWorkCardDeatil } from "@/api/schoolaffair";
import fileType from "@/views/myMaterial/materialManage/isFiles";
// import EditName from "./edit_name.vue";
import { mapState } from "vuex";
import store from "@/store";
import { baseUrl, uploadUrl } from "@/configs";
export default {
  name: "cardEdit",
  components: { AddQuestion, Kps, ParseSelf },
  data() {
    return {
      id: this.$route.query.id,
      disabled: false,
      classId: this.$route.query.classId,
      homeworkType: this.$route.query.homeworkType,
      templateName: "自主添加答题卡",
      serverUrl: baseUrl + uploadUrl, //默认素材上传路径
      header: {
        Authorization: `Bearer ${store.state.user.access_token}`,
      },
      iskps: false,
      isAdd: false,
      isName: false,
      isparse: false,
      fileList: [],
      total: 0,
      totalNum: 0,
      totalScore: 0,
      currentPage: 1,
      pagesize: 19,
      templateContent: "",
      currentRowIndex: [],
      selectedData: [],
      msgData: "",
      fileList: [],
      noAnswerNum: 0,
      tableData: [],
      dataFrom: {
        id: "",
        userId: "",
      },
      cardFrom: {
        createdBy: "",
        totalScore: "",
        totalNum: "",
        type: this.$route.query.type,
        questionList: [],
      },
    };
  },
  watch: {
    tableData() {
      this.totalNum = this.tableData.length;
      this.totalScore = 0;
      this.tableData.forEach((item) => {
        this.totalScore += Number(item.questionScore);
      });
    },
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
    getScore(score, index) {
      console.log(score);
      if (!isNaN(score) && score !== "") {
        if (score < 0) {
          this.$message({
            message: "分值不可为负数！",
            type: "info",
          });
          this.tableData[index].questionScore = 0;
        }
      } else {
        this.$message({
          message: "请输入正确的分值！",
          type: "info",
        });
        this.tableData[index].questionScore = 0;
      }
      this.totalScore = 0;
      this.tableData.forEach((item) => {
        this.totalScore += Number(item.questionScore);
      });
    },
    kpget(val) {
      console.log(val);
      val.kpsIds = String(val.kpIdsTree)
      this.tableData[val.indexSort] = val;
      console.log("tableData", this.tableData);
    },
    toKps(item, index) {
      console.log("toKps", item, index);
      this.iskps = true;
      this.$nextTick(() => {
        this.$refs.kps.init(item, index,this.homeworkType);
      });
    },
    toparse(item, index) {
      this.isparse = true;
      this.$nextTick(() => {
        this.$refs.parseEdit.init(item, index);
      });
    },
    getAnalysis(val) {
      console.log("解题思路值", val);
      console.log("总数据", this.tableData);
      this.tableData.forEach((card,index) => {
        if(card.templateQuestionId){
          if (card.templateQuestionId == val.templateQuestionId) {
            console.log("card", card);
            this.tableData[index] = val;
          }
        }else{
          if (card.sort == val.sort) {
              console.log("card", card);
              this.tableData[index] = val;
            }
        }
        
      });
      console.log("总数据-----11111", this.tableData);
    },
    handleSelectionChange(data) {
      console.log('SelectionChange',data)
      this.selectedData = data;
    },
    // handleCurrentChange(val){
    //   console.log(val)
    //   if(this.id){
    //     console.log(id)
    //   }else{
    //     let newData = this.tableData
    //     this.tableData = this.newData.slice(20*val-20,20*val)
    //   }
    // },
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
      console.log("getNum", value);
      switch (value.type) {
        case "1":
          for (let a = 0; a < Number(value.num); a++) {
            this.tableData.push({
              createdBy: this.user.data.uid,
              paperOptions: "",
              questionOptionsNum: Number(value.optionNum),
              rightAnswer: "",
              questionType: 1,
              questionScore: value.score,
              sort: this.tableData.length + 1,
              templateId: null,
              remake: null,
              kpIds: null,
              kpIdsTree: null,
              kpIdNames: null,
              upImgFiles: [],
            });
          }
          console.log(this.tableData);
          // this.tableData.forEach((item, index) => {
          //   item.paperOptions = item.questionOptionsNum.split("");
          // });
          break;
        case "2":
          for (let a = 0; a < Number(value.num); a++) {
            this.tableData.push({
              createdBy: this.user.data.uid,
              paperOptions: "",
              questionOptionsNum: Number(value.optionNum),
              rightAnswer: [],
              questionType: 2,
              questionScore: value.score,
              sort: this.tableData.length + 1,
              templateId: null,
              remake: "",
              kpIds: null,
              kpIdsTree: null,
              kpIdNames: null,
              upImgFiles: [],
            });
          }
          break;
        case "4":
          for (let a = 0; a < Number(value.num); a++) {
            this.tableData.push({
              createdBy: this.user.data.uid,
              paperOptions: "",
              // questionOptionsNum: Number(value.optionNum),
              questionOptionsNum: 2, //判断默认2个选项
              rightAnswer: "",
              questionType: 4,
              questionScore: value.score,
              sort: this.tableData.length + 1,
              templateId: null,
              remake: "",
              kpIds: null,
              kpIdsTree: null,
              kpIdNames: null,
              upImgFiles: [],
            });
          }
          break;
        case "5":
          for (let a = 0; a < Number(value.num); a++) {
            this.tableData.push({
              createdBy: this.user.data.uid,
              paperOptions: "",
              questionOptionsNum: "",
              rightAnswer: "",
              questionType: 5,
              questionScore: value.score,
              sort: this.tableData.length + 1,
              templateId: null,
              remake: "",
              kpIds: null,
              kpIdsTree: null,
              kpIdNames: null,
              upImgFiles: [],
            });
          }
          break;
        default:
      }
      console.log("-----------------getNum------------");
    },
    addQuestion() {
      this.isAdd = true;
      this.$nextTick(() => {
        this.$refs.addQuestion.init();
      });
    },
    async getQuestionList() {
      this.dataFrom.id = this.id;
      this.dataFrom.userId = this.user.data.uid;
      try {
        const { data } = await cardQuestionList(this.dataFrom);
        if (data.list.length > 0) {
          data.list.forEach((item, index) => {
            this.$set(item, "paperOptions", item.questionOptionsNum.split(""));
            if (item.questionType == 2) {
              item.rightAnswer = item.rightAnswer.split(",");
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
      console.log(index);
      if (index != 0) {
        this.templateContent = this.tableData[index - 1]; // 获取目标上一个数据
        Vue.set(this.tableData, index - 1, this.tableData[index]); //修改索引
        Vue.set(this.tableData, index, this.templateContent);
        this.$nextTick(() => {
          if (this.tableData[index - 1].questionType == 5) {
            this.$refs["upload" + (index - 1)].uploadFiles =
              this.tableData[index - 1].upImgFiles;
          }
          if (this.tableData[index].questionType == 5) {
            this.$refs["upload" + index].uploadFiles =
              this.tableData[index].upImgFiles;
          }
        });
      }
    },
    indexReduce(index) {
      if (index != this.tableData.length - 1) {
        this.templateContent = this.tableData[index + 1]; // 获取目标下一个数据
        Vue.set(this.tableData, index + 1, this.tableData[index]); //修改索引
        Vue.set(this.tableData, index, this.templateContent);
        this.$nextTick(() => {
          if (this.tableData[index + 1].questionType == 5) {
            this.$refs["upload" + (index + 1)].uploadFiles =
              this.tableData[index + 1].upImgFiles;
          }
          if (this.tableData[index].questionType == 5) {
            this.$refs["upload" + index].uploadFiles =
              this.tableData[index].upImgFiles;
          }
        });
      }
    },
    handleRemove(index, row, file) {
      console.log("handleRemove", index, row, file);
      this.$refs["upload" + index].uploadFiles.splice(
        this.$refs["upload" + index].uploadFiles.indexOf(file),
        1
      );
      row.upImgFiles = this.$refs.upload.uploadFiles;
      // this.fileList = this.$refs.upload.uploadFiles;
      // if (this.fileList.length < 3) {
      //   let uploadDom = document.getElementsByClassName(
      //     "el-upload el-upload--picture-card"
      //   );
      //   uploadDom[0].style.display = "inline-block";
      // }
    },
    onchange(index, file) {
      console.log("onchange", file);
      if (fileType.matchType(file.name).fooderType !== "6") {
        this.$message({
          message: "暂不支持除图片外的文件上传！",
          type: "info",
        });
      } else {
        console.log("111111111111", "upload" + index);
        this.fileList = this.$refs["upload" + index].uploadFiles;
        // if (this.fileList.length == 3) {
        //   let uploadDom = document.getElementsByClassName(
        //     "el-upload el-upload--picture-card"
        //   );
        //   uploadDom[0].style.display = "none";
        // }
        console.log("this.$refs.upload", this.$refs["upload" + index]);
        this.$refs["upload" + index].submit();
      }
    },
    success(index, row, data) {
      console.log("------------success-----------", index, row, data);
      row.upImgFiles = this.$refs["upload" + index].uploadFiles;
      // row.upImgFile.push({
      //   uid: `${new Date().getTime()}`,
      //   url: this.imgPrefix + data.data.fileName,
      // });
      // console.log("----success-refs---",this.$refs['upload'+index])
      // row.upImgFile = this.$refs['upload'+index].uploadFiles;
      row.upImgFiles[this.fileList.length - 1].url =
        this.imgPrefix + data.data.fileName;
      // console.log("row", row);
    },
    submit() {
      this.noAnswerNum = 0;
      this.cardFrom.questionList = JSON.parse(JSON.stringify(this.tableData));
      console.log("this.cardFrom.questionList", this.cardFrom.questionList);
      this.cardFrom.questionList.forEach((item, index) => {
        if (item.questionType == 2) {
          item.rightAnswer = item.rightAnswer.sort().toString();
        } else if (item.questionType == 5) {
          console.log("1111", item);
          item.rightAnswer = item.upImgFiles;
        }
        item.sort  = index + 1
      });
      this.cardFrom.createdBy = this.user.data.uid;
      this.cardFrom.questionList.forEach((item, index) => {
        if (item.rightAnswer == "") {
          this.noAnswerNum++;
        }
      });
      this.cardFrom.totalNum = this.totalNum;
      // if(this.totalScore == NaN){
      //   this.$message({
      //     type: "info",
      //     message: "部分分值有误",
      //   })
      // }else{
      //   this.cardFrom.totalScore = this.totalScore;
      // }
      this.cardFrom.totalScore = this.totalScore;
      console.log("cardFrom", this.cardFrom);
      if (this.noAnswerNum == 0) {
        localStorage.setItem("cardDataFrom", JSON.stringify(this.cardFrom));
        this.back();
      } else if (this.noAnswerNum > 0) {
        this.$message({
          type: "info",
          message: "请选择答案",
        });
      }
    },
    async getDetail() {
      try {
        const { data } = await homeWorkCardDeatil(this.id);
        console.log(data);
        this.tableData = data;
        if (data) {
          setTimeout(() => {
            data.forEach((item, index) => {
              if (item.questionType == 2) {
                item.rightAnswer = item.rightAnswer.split(",");
              } else if (item.questionType == 5) {
                if (item.questionType == 5) {
                  item.rightAnswer = item.rightAnswer.slice(
                    0,
                    item.rightAnswer.length - 1
                  ); //去逗号
                  item.rightAnswer = item.rightAnswer.split(",");
                  this.$refs["upload" + index].uploadFiles = [];
                  item.rightAnswer.forEach((item) => {
                    setTimeout(() => {
                      this.$refs["upload" + index].uploadFiles.push({
                        uid: `${new Date().getTime()}`,
                        url: this.imgPrefix + item,
                      });
                    }, 1);
                  });
                  item.upImgFiles = this.$refs["upload" + index].uploadFiles;
                }
              }
            });
          }, 500);
        }
        this.tableData = data;
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("cardDataFrom"))) {
      this.$nextTick(() => {
        this.cardFrom = JSON.parse(localStorage.getItem("cardDataFrom"));
        this.tableData = this.cardFrom.questionList;
        setTimeout(() => {
          if (this.cardFrom) {
            this.cardFrom.questionList.forEach((item, index) => {
              if (item.questionType == 2) {
                item.rightAnswer = item.rightAnswer.split(",");
              } else if (item.questionType == 5 && item.upImgFiles.length > 0) {
                this.$refs["upload" + index].uploadFiles = item.upImgFiles;
              }
            });
            this.tableData = this.cardFrom.questionList;
            this.totalNum = this.cardFrom.totalNum;
            this.totalScore = this.cardFrom.totalScore;
          } else {
            this.cardFrom = {
              createdBy: "",
              totalScore: "",
              totalNum: "",
              type: this.$route.query.type,
              questionList: [],
            };
            console.log(this.cardFrom);
          }
        }, 1000);
      });
    } else {
      if (this.id) {
        this.$nextTick(() => {
          this.getDetail();
        });
      } else {
        this.id = null;
      }
    }
  },
};
</script>
<style lang="less" scoped>
.card {
  position: relative;
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
      display: flex;
      align-items: end;
      font-size: 20px;
      font-weight: bold;
      color: #333333;
    }
    .btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .cell {
    .el-button {
      padding: 0px !important;
    }
  }
  /deep/.pagination {
    position: absolute;
    bottom: 20px;
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
  .imgUpload {
    width: 50px;
    height: 50px;
  }
  /deep/.el-upload--picture-card {
    position: relative;
    width: 50px;
    height: 50px;
  }
  /deep/.el-upload-list__item {
    width: 50px;
    height: 50px;
  }
   /deep/.el-dialog__wrapper{
    max-width: 400px;
  }
}
</style>
<style>
.el-tooltip__popper{
  max-width: 400px;
}
</style>