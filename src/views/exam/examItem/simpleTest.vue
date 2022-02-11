<template>
  <div>
    <tool-bar :title="type == 'add' ? '添加答案' : '修改答案'"></tool-bar>
    <div class="main-wrapper">
      <div class="simple-header">
        <div class="f1">
          <div class="t18">{{ time }} 的试卷</div>
          <div class="remark">
            <span>备注：</span>
            <el-input v-model="remark" style="width: 233px" />
          </div>
        </div>
        <div class="score">
          <el-button type="warning" @click="show()">批量修改分数</el-button>
          <div v-if="isShow" class="ipt">
            <el-input v-model="score" placeholder="请输入分值"></el-input>
            <div class="btn">
              <el-button type="success" @click="modifyScores()"
                >确 定</el-button
              >
              <el-button type="danger" @click="isShow = false">取 消</el-button>
            </div>
          </div>
        </div>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
      <div class="simple-body">
        <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedList" @change="handleCheckedCitiesChange"> -->
        <div v-for="(item, i) in list" :key="item.type">
          <div class="simple-talbe-header">
            {{ (i + 1) | convertToChinaNum }}、{{ item.title }}
          </div>
          <el-table
            :data="item.data"
            style="width: 100%"
            stripe
            @selection-change="handleSelectionChange($event, item)"
          >
            <!-- <el-table-column width="55">
              <template slot-scope="scope">
                <el-checkbox :label="scope.row"></el-checkbox>
              </template>
            </el-table-column> -->
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              prop="testSumAnswer"
              label="题号"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                题号{{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="testSumAnswer"
              label="正确答案"
              align="center"
            >
              <div class="options" slot-scope="scope">
                <!-- 单选 -->
                <el-radio-group
                  v-if="scope.row.questionType == 1"
                  v-model="scope.row.paperRightAnswers"
                >
                  <el-radio-button
                    v-for="(item, index) in scope.row.paperQuestionOptions"
                    :key="index"
                    :label="item"
                  ></el-radio-button>
                </el-radio-group>
                <!-- 多选 -->
                <el-checkbox-group
                  v-else-if="scope.row.questionType == 2"
                  v-model="scope.row.paperRightAnswers"
                >
                  <el-checkbox-button
                    v-for="(item, index) in scope.row.paperQuestionOptions"
                    :key="index"
                    :label="item"
                  ></el-checkbox-button>
                </el-checkbox-group>
                <!-- 判断 -->
                <el-radio-group
                  v-if="scope.row.questionType == 4"
                  v-model="scope.row.paperRightAnswers"
                >
                  <el-radio-button
                    v-for="(item, index) in scope.row.paperQuestionOptions"
                    :key="index"
                    :label="item"
                    >{{ item == "A" ? "正确" : "错误" }}</el-radio-button
                  >
                </el-radio-group>
              </div>
            </el-table-column>

            <el-table-column
              prop="score"
              label="分值"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <el-input
                  class="simple-input"
                  v-model="scope.row.score"
                  @blur="isNumber(scope.row, scope.$index)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- </el-checkbox-group> -->
      </div>
    </div>
  </div>
</template>

<script>
import { saveAnswer, answerList } from "@/api/exam";
import ToolBar from "@/components/navigation/toolBar.vue";
import { convertToChinaNum } from "@/utils";
import { number } from "echarts";
export default {
  data() {
    return {
      isShow: false,
      isIndeterminate: true,
      checkAll: false,
      checkAllList: [],
      checkedList: [],
      type: this.$route.query.type || "",
      templateId: this.$route.query.id,
      time: this.$route.query.time,
      roomId: this.$route.query.roomId,
      list: [],
      score: "",
      remark: "",
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleChecked(val) {
      console.log(val);
    },
    handleSelectionChange(val, question) {
      console.log(val, question);
      // this.list = [...val]
      if (val == "") {
        //如果val为空数组，则该类型的题目全没选，从全选里删除该题目
        // console.log(this.checkedList)
        this.checkedList.forEach((item, index) => {
          // if(item.questionType == question.type){
          //   this.checkedList.splice(index,1)
          // }
          this.checkedList = this.checkedList.filter((item) => {
            return item.questionType != question.type;
          });
        });
        console.log(this.checkedList);
      } else {
        //如果val不为空数组，则该类型的题目还有，从全选里删除该类型题目并重新添加
        console.log("val不为空数组");
        if (this.checkedList.length == 0) {
          //空数组
          console.log("checkedList为空数组");
          this.checkedList = [...this.checkedList, ...val];
        } else {
          //不为空数组
          console.log("checkedList不为空数组");
          this.checkedList.forEach((item, index) => {
            //先删除，后添加
            this.checkedList = this.checkedList.filter((item) => {
              return item.questionType != question.type;
            });
          });
          this.checkedList = [...this.checkedList, ...val];
        }
      }
      console.log("选择？！", this.checkedList);
    },
    // handleCheckAllChange(val) {
    //   this.checkedList = val ? this.checkedList : [];
    //   this.isIndeterminate = false;
    // },
    // handleCheckedCitiesChange(value) {
    //   console.log('handleCheckedCitiesChange',value)
    //   let checkedCount = value.length;
    //   this.checkAll = checkedCount === this.checkAllList.length;
    //   this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkAllList.length;
    // },
    show() {
      this.isShow = !this.isShow;
    },
    isNumber(item, index) {
      if (Number(item.score) != NaN && Number(item.score) >= 0) {
        if (item.score.substr(0, 1) == 0) {
          if (Number(item.score) < 1) {
            this.list.forEach((item1, index1) => {
              if (item.questionType == item1.type) {
                console.log(item1);
                item1.data.forEach((itemdata, index2) => {
                  if (itemdata.id == item.id) {
                    console.log(itemdata);
                    this.list[index1].data[index2].score = Number(
                      this.list[index1].data[index2].score
                    );
                  }
                });
              }
            });
          } else {
            this.list.forEach((item1, index1) => {
              if (item.questionType == item1.type) {
                console.log(item1);
                item1.data.forEach((itemdata, index2) => {
                  if (itemdata.id == item.id) {
                    console.log(itemdata);
                    this.list[index1].data[index2].score = 0;
                  }
                });
              }
            });
            this.$message({
              message: "请输入正确的分值！",
              type: "info",
            });
          }
        } else {
          this.list.forEach((item1, index1) => {
            if (item.questionType == item1.type) {
              console.log(item1);
              item1.data.forEach((itemdata, index2) => {
                if (itemdata.id == item.id) {
                  console.log(itemdata);
                  this.list[index1].data[index2].score = Number(
                    this.list[index1].data[index2].score
                  );
                }
              });
            }
          });
        }
      } else {
        this.list.forEach((item1, index1) => {
          if (item.questionType == item1.type) {
            item1.data.forEach((itemdata, index2) => {
              if (itemdata.id == item.id) {
                this.list[index1].data[index2].score = 0;
              }
            });
          }
        });
        this.$message({
          message: "请输入正确的分值！",
          type: "info",
        });
      }
    },
    modifyScores() {
      if (!isNaN(this.score) && Number(this.score) > 0) {
        //数字
        this.score.toString();
        if (this.score.substr(0, 1) == 0) {
          if (this.score < 1) {
            this.score = Number(this.score);
            this.list.forEach((listitem) => {
              listitem.data.forEach((item1) => {
                this.checkedList.forEach((checkitem) => {
                  if (item1.id == checkitem.id) {
                    item1.score = this.score;
                  }
                });
              });
            });
            this.score = "";
            this.isShow = false;
          } else {
            this.$message({
              message: "请输入正确的分值！",
              type: "info",
            });
          }
        } else {
          this.score = Number(this.score);
          this.list.forEach((listitem) => {
            listitem.data.forEach((item) => {
              this.checkedList.forEach((checkitem) => {
                if (item.id == checkitem.id) {
                  item.score = this.score;
                }
              });
            });
          });
          this.score = "";
          this.isShow = false;
        }
      } else {
        this.$message({
          message: "请输入正确的分值！",
          type: "info",
        });
      }
    },
    async save() {
      const list = [];
      const data = JSON.parse(JSON.stringify(this.list));
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        for (let j = 0; j < item.data.length; j++) {
          let otem = item.data[j];
          if (
            !otem.paperRightAnswers ||
            (Array.isArray(otem.paperRightAnswers) &&
              otem.paperRightAnswers.length == 0)
          ) {
            return this.$message({
              message: `${item.title} -- 题目${j + 1}未设置答案`,
              type: "warning",
            });
          }
          otem.paperQuestionOptions = otem.paperQuestionOptions.join("");
          otem.paperRightAnswers = Array.isArray(otem.paperRightAnswers)
            ? otem.paperRightAnswers
                .filter((s) => s && s.trim())
                .sort()
                .join(",")
            : otem.paperRightAnswers;
          list.push(otem);
        }
      }
      const params = {
        list,
        templateId: this.templateId,
        remark: this.remark,
        roomId: this.roomId,
      };
      console.log('list',params.list)
      // await saveAnswer(params);
      // let message = this.type == "add" ? "添加成功" : "修改成功";
      // this.$message({
      //   message,
      //   type: "success",
      // });
      // setTimeout(() => {
      //   window.history.back();
      // }, 2000);
    },
    async getData() {
      const { data } = await answerList({ templateId: this.templateId });
      const list = [
        { title: "单选题", type: 1, data: data.singleList },
        { title: "多选题", type: 2, data: data.multipleList },
        { title: "判断题", type: 4, data: data.judgeList },
      ];
      list.forEach((item) => {
        item.data.forEach((otem) => {
          otem.paperQuestionOptions = otem.paperQuestionOptions.split("");
          if (otem.questionType == 2) {
            otem.paperRightAnswers = otem.paperRightAnswers.split(",");
          }
        });
      });
      this.list = list;
      this.checkAllList = list;
      console.log("全部数据", this.list);
    },
  },
  components: { ToolBar },
  filters: {
    convertToChinaNum,
  },
};
</script>

<style lang="less" scoped>
/deep/.has-gutter {
  font-size: 16px;
  > tr {
    background-color: transparent;

    > th {
      background: #e1f1ff;
    }
  }

  color: #333333;
}
.score {
  position: relative;
  margin-right: 10px;
  .ipt {
    position: absolute;
    margin-top: 5px;
    background-color: white;
    padding: 10px;
    border: 1px solid #eeeeee;
    .btn {
      display: flex;
      flex-direction: row;
      margin-top: 10px;
    }
  }
}
.simple-input {
  width: 80px;
  /deep/input {
    text-align: center;
  }
}
.simple-body {
  background: #fff;
  margin-top: 15px;
  padding: 30px 0;

  .simple-talbe-header {
    padding-left: 25px;
    font-size: 16px;
    line-height: 54px;
  }
}
.simple-header {
  height: 83px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background: #fff;
  .f1 {
    flex: 1;
    overflow: hidden;
    .t18 {
      font-size: 18px;
    }
    span {
      color: #2196f3;
    }
    .remark {
      display: flex;
      align-items: center;
      margin-top: 5px;
    }
  }
}
.el-checkbox {
  /deep/ .el-checkbox__label {
    display: none;
  }
}
</style>