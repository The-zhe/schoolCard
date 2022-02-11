<template>
  <el-dialog title="作业详情" :visible.sync="visible" width="60%">
    <div class="detail_main" v-if="detailData.length > 0">
      <!-- 题目 -->
      <div class="question">{{ detailData[0].questionContent }}</div>
      <div class="rightAnswer">
        <div class="title">选项:</div>
        <div class="text">正确答案:{{ detailData[0].rightAnswers }}</div>
        <div class="text">学生选择:{{ detailData[0].myAnswers }}</div>
      </div>
      <div class="options">
        <div class="radio" v-if="questionType == 1">
          <div
            :class="
              item.sortIndex == detailData[0].rightAnswers
                ? 'right'
                : 'option' && item.sortIndex == detailData[0].myAnswers
                ? 'wrong'
                : 'option'
            "
            v-for="(item, index) in options"
            :key="index"
          >
            <div class="title">{{ item.sortIndex }}</div>
            <div class="text">{{ item.optionContent }}</div>
          </div>
        </div>
        <div class="multiple" v-if="questionType == 2">
          <div class="list" v-for="(item, index) in optionsMore" :key="index">
            <div
              :class="
                item.type == 1
                  ? 'right'
                  : 'option' && item.type == 2
                  ? 'wrong'
                  : 'option'
              "
            >
              <div class="title">{{ item.sortIndex }}</div>
              <div class="text">{{ item.optionContent }}</div>
            </div>
          </div>
        </div>
        <div class="judge" v-if="questionType == 4">
          <div
            :class="
              item.sortIndex == detailData[0].rightAnswers
                ? 'right'
                : 'option' && item.sortIndex == detailData[0].myAnswers
                ? 'wrong'
                : 'option'
            "
            v-for="(item, index) in judgeOption"
            :key="index"
          >
            <div class="title">{{ item.sortIndex }}</div>
            <div class="text">{{ item.optionContent }}</div>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          :page-size="1"
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <div class="detail_main" v-if="detailData.length == 0">
      暂无数据
    </div>
  </el-dialog>
</template>
<script>
import { answerDetail } from "@/api/schoolaffair";
export default {
  data() {
    return {
      id: null,
      roomId: null,
      visible: false,
      questionType: 1,
      total: 0,
      rightAnswer: [],
      stuAnswer: [],
      options: [],
      optionsMore: [],
      judgeOption: [],
      detailData: [],
      detailFrom: {
        roomId: null,
        userId: null,
        current: 1,
        size: 1,
      },
    };
  },
  methods: {
    init(roomId, stuId) {
      console.log(roomId);
      if (stuId) {
        this.id = stuId;
        this.roomId = roomId;
      }
      this.detailFrom.roomId = this.roomId;
      this.detailFrom.userId = this.id;
      this.visible = true;
      this.getAnswerDetail(this.detailFrom);
    },
    optionsDeal() {
      this.stuAnswer = this.detailData.myAnswers.split(",");
      this.rightAnswer = this.detailData.rightAnswers.split(",");
      this.$set(this.optionsMore, "type", 0);
      this.optionsMore.forEach((item, index1) => {
        this.stuAnswer.forEach((wrong, index3) => {
          if (item.sortIndex == wrong) {
            console.log(item.sortIndex, wrong);
            this.$set(item, "type", 2);
          }
        });
        this.rightAnswer.forEach((right, index2) => {
          if (item.sortIndex == right) {
            this.$set(item, "type", 1);
          }
        });
      });
    },
    handleCurrentChange(val) {
      console.log(val);
      this.detailFrom.current = val;
      this.getAnswerDetail(this.detailFrom);
    },
    async getAnswerDetail(from) {
      try {
        const { data } = await answerDetail(from);
        console.log("answerDetail", data.records);
        if (data.records.length > 0) {
          this.detailData = data.records;
          console.log('detailData',this.detailData)
          this.total = data.total;
          this.questionType = data.records[0].questionType;
          if (this.questionType == 1) {
            this.options = data.records[0].optionList;
          } else if (this.questionType == 2) {
            this.optionsMore = data.records[0].optionList;
            this.optionsDeal();
          } else if (this.questionType == 3) {
            this.judgeOption = data.records[0].optionList;
            console.log(this.judgeOption);
          }
        }else{
          this.detailData = []
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.detail_main {
  position: relative;
  display: flex;
  flex-direction: column;
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
        // width: 300px;
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
</style>