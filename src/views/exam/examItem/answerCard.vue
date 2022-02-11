<template>
  <div class="answerCard">
    <div class="card">
      <div class="card_header">
        <div class="header_top">
          <div class="top_title">{{msgData.templateName}}</div>
          <el-button class="top_btn" @click="toCardEdit()">编辑</el-button>
        </div>
        <div class="header_bottom">
          <div class="date">上次编辑时间：{{msgData.updateTime}}</div>
          <div class="question">
            <div class="num">总题数：{{msgData.totalNum}}</div>
            <div class="num">单选题：{{msgData.single}}</div>
            <div class="num">多选题：{{msgData.multiple}}</div>
            <div class="num">判断题：{{msgData.judge}}</div>
          </div>
          <div class="totalScore">总分：{{msgData.totalScore}}</div>
        </div>
      </div>
      <div class="card_table">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column label="序号" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            prop="questionType"
            label="题目类型"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.questionType == 1">单选题</span>
              <span v-else-if="scope.row.questionType == 2">多选题</span>
              <span v-else-if="scope.row.questionType == 4">判断题</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="paperRightAnswers"
            label="正确答案"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="score"
            label="分值"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="sort"
            label="题号"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { cardQuestionList } from "@/api/exam";
import { mapState } from "vuex";
export default {
  data() {
    return {
      id: this.$route.query.id,
      tableData: [],
      msgData:'',
      dataFrom:{
        id:'',
        userId:'',
      }
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    async getQuestionList(){
      this.dataFrom.id = this.id
      this.dataFrom.userId = this.user.data.uid
      try{
        const {data} = await cardQuestionList(this.dataFrom)
        this.tableData = data.list
        this.msgData = data.testPaperTemplateRes
      }catch(e){
        console.log(e)
      }
    },
    toCardEdit() {
      this.$router.push(
        {
          name:'cardEdit',
          query:{
            id:this.id,
            name:this.msgData.templateName,
          }
        }
      );
    },
  },
  mounted(){
    this.getQuestionList()
  }
};
</script>
<style lang="less" scoped>
.card {
  margin: 50px auto;
  min-height: 1200px;
  width: 1200px;
  .card_header {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: white;
    margin-bottom: 20px;
    .header_top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px rgba(238, 238, 238, 1) solid;
      margin-bottom: 10px;
      .top_btn {
        background: rgba(254, 189, 43, 1);
        color: white;
        font-size: 20px;
        font-size: 16px;
        width: 120px;
      }
      .top_title {
        font-size: 20px;
        font-weight: bold;
        color: #333333;
      }
    }
    .header_bottom {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      color: #333333;
      .date {
        margin: 5px 5px;
      }
      .question {
        display: flex;
        flex-direction: row;
        .num {
          margin: 5px 5px;
        }
      }
      .totalScore {
        margin: 5px 5px;
      }
    }
  }
}
</style>