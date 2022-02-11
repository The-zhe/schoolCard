<template>
  <div class="afterWorkDetail">
    <div class="detail_main">
      <div class="detail_table">
        <div class="table_header">
          <div class="title">{{ title }}</div>
          <div class="header_msg">
            <div class="msg" v-html="content">
            </div>
            <div class="header_right">
              <div class="card" v-if="tempType == 1" @click="toCard">答题卡</div>
              <div class="num">
                <div class="aboutnum right_solid">
                  <div class="text_num">{{ planNum }}</div>
                  <div class="text">应交作业数</div>
                </div>
                <div class="aboutnum">
                  <div class="text_num">{{ actNum }}</div>
                  <div class="text">实交作业数</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="role">
          <div class="search">
            <el-input
              placeholder="请输入内容"
              v-model="dataFrom.name"
              class="input-with-select"
              style="width: 220px"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                style="
                  background: #2196f3;
                  color: white;
                  border: 1px solid #2196f3;
                  border-top-left-radius: 0px;
                  border-bottom-left-radius: 0px;
                "
                @click="search()"
              ></el-button>
            </el-input>
            <!-- <el-button plain style="margin: 0px 10px" @click="clearFilter"
              >默认排序</el-button
            > -->
          </div>
          <!-- <el-button
            type="danger"
            icon="el-icon-edit-outline"
            style="float: right"
            >批改作业</el-button
          > -->
        </div>
        <el-table :data="tableData" ref="filterTable" style="width: 100%">
          <el-table-column label="序号" align="center" width="100px">
            <template slot-scope="scope">
              {{ (scope.$index + 1)+(dataFrom.current-1)*17 }}
            </template>
          </el-table-column>
          <el-table-column prop="studentName" label="姓名" align="center">
          </el-table-column>
          <el-table-column
            prop="commitTime"
            label="提交时间"
            align="center"
            width="200px"
          >
          </el-table-column>
          <el-table-column
            v-if="tempType == 1"
            prop="process"
            label="作业进度"
            align="center"
            sortable
          >
          </el-table-column>
          <el-table-column
            v-if="tempType == 1"
            prop="totalScore"
            label="分数"
            align="center"
            sortable
          >
          </el-table-column>
          <el-table-column
            v-if="tempType == 1"
            prop="objectiveAccuracy"
            label="正确率(客观题)"
            align="center"
            sortable
          >
          </el-table-column>
          <el-table-column
            v-if="correctStatus != 2"
            label="是否批改"
            align="center"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.checkStatus == 0 ? "未批改" : "已批改" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                title="查看"
                type="text"
                style="color: #2196f3; padding: 0px !important"
                @click="viewAnswer(scope.row)"
                >查看</el-button
              >
              <!-- <router-link
                to="/temporary/checkWork"
                style="color: #2196f3; margin-left: 10px"
                >批改</router-link
              > -->
              <el-button
                v-if="scope.row.checkStatus == 0"
                title="批改"
                type="text"
                style="color: #2196f3; padding: 0px !important"
                @click="viewAnswer(scope.row)"
                >批改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            :background="true"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="17"
            layout="prev, pager, next,jumper"
            :total="total"
          >
          </el-pagination>
          <el-button>确定</el-button>
        </div>
      </div>
      <!-- <div class="detail_rank">
        <div class="title">数据分析</div>
        <div class="options">
          <div
            :class="index == activeNum ? 'active' : 'option'"
            v-for="(item, index) in options"
            :key="index"
            @click="change(index)"
          >
            {{ item }}
          </div>
        </div>
        <div v-if="activeNum === 1">
          <div id="echartMain" style="width: 100%; height: 300px"></div>
          <el-table :data="synList">
            <el-table-column
              label="区间"
              prop="name"
              align="center"
            ></el-table-column>
            <el-table-column
              label="人数"
              prop="nums"
              align="center"
            ></el-table-column>
            <el-table-column label="比例" align="center">
              <template slot-scope="scope">
                {{
                  countNums == 0
                    ? 0
                    : (scope.row.nums / countNums).toFixed(2) * 100
                }}%
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="rank" v-else-if="activeNum === 0">
          <div class="msg">总题数：{{ totalQuestion }}</div>
          <el-table
            :data="noData"
            :span-method="arraySpanMethod"
            height="500"
            stripe
            style="width: 100%"
          >
            <el-table-column label="排行" prop="rank" width="50" align="center">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="题目" align="center">
              <template slot-scope="scope">
                <div class="table_msg">
                  <div>题目{{ scope.row.sort }}</div>
                  <div>{{ scope.row.answerErrorNums }}人</div>
                </div>
                <el-progress
                  :text-inside="true"
                  :stroke-width="15"
                  :percentage="scope.row.answerErrorRate * 100"
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="错误人数" align="center"> </el-table-column>
            <el-table-column
              prop="rate"
              label="错误率"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.answerErrorRate * 100 }}%
              </template>
            </el-table-column>
          </el-table>
          <div class="paginationRank">
            <el-pagination
              layout="prev, pager, next"
              @current-change="handleCurrentChangeRank"
              :total="rankTotal"
            >
            </el-pagination>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
import {
  homeworkDetail,
  questionErrorRank,
  SynthesisScoreDistribute,
  classWorkDetail,
} from "@/api/schoolaffair";
import { teacherSubject } from "@/api/teach";
export default {
  data() {
    return {
      id: this.$route.query.id,
      createTime: this.$route.query.createTime,
      releaseTime: this.$route.query.releaseTime,
      changeNum: this.$route.query.changeNum,
      homeworkType: this.$route.query.homeworkType,
      correctStatus: this.$route.query.correctStatus,
      grade: this.$route.query.grade,
      classNo: this.$route.query.classNo,
      actNum: this.$route.query.actNum,
      planNum: this.$route.query.planNum,
      teacherName: this.$route.query.teacherName,
      title: this.$route.query.title,
      content: this.$route.query.content,
      tempType: this.$route.query.tempType,
      isView: false,
      activeNum: 0,
      checked: "",
      total: null,
      totalQuestion: 0,
      rankTotal: 0,
      currentPage: 1,
      countNums: "",
      tableData: [],
      rankData: [],
      noData: [],
      synList: [],
      dataFrom: {
        homeworkId: "",
        current: 1,
        size: 17,
        name: "",
        tempType: this.$route.query.tempType,
      },
      directory: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    change(index) {
      this.activeNum = index;
      if (this.activeNum == 1) {
        this.$nextTick(() => {
          this.getSynthesisScoreDistribute();
        });
      }
    },
    search() {
      this.getHomeworkDetail();
    },
    viewAnswer(row) {
      this.$router.push({
        name: "checkWork",
        query: {
          id: row.homeworkId,
          stuId: row.studentId,
          stuName: row.studentName,
          grade: this.grade,
          classNo: this.classNo,
        },
      });
    },
    toCard(){
      this.$router.push({
        name: "afterWorkCard",
        query: {
          id: this.dataFrom.homeworkId,
        },
      });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 2];
      } else if (columnIndex === 2) {
        return [0, 0];
      }
    },
    handleCurrentChangeRank(val) {
      this.rankFrom.current = val;
      this.getRank();
    },
    async getHomeworkDetail() {
      this.dataFrom.homeworkId = this.id;
      console.log('getHomeworkDetail',this.dataFrom)
      try {
        const { data } = await homeworkDetail(this.dataFrom);
        console.log(data);
        this.tableData = data.records;
        this.total = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async getClassWorkDetail() {
      // 获取总题数
      try {
        const { data } = await classWorkDetail(this.id);
        this.totalQuestion = data.homeworkQuestionList.length;
      } catch (e) {
        console.log(e);
      }
    },
    async getRank() {
      //获取错题排行
      try {
        const { data } = await questionErrorRank(this.rankFrom);
        console.log("Rank", data);
        this.noData = data.records;
        this.rankTotal = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    // async getSynthesisScoreDistribute() {
    //   //获取综合评分分布
    //   try {
    //     const { data } = await SynthesisScoreDistribute(this.synFrom);
    //     console.log("SynthesisScoreDistribute", data);
    //     data.list.forEach((item) => {
    //       this.$set(item, "value", item.nums);
    //     });
    //     this.synList = data.list;
    //     this.countNums = data.countNums;
    //     this.showEchart();
    //   } catch (e) {
    //     console.log(e);
    //   }
    // },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    handleCurrentChange(val) {
      this.dataFrom.current = val;
      this.getHomeworkDetail();
    },
  },
  async mounted() {
    const { data } = await teacherSubject();
    this.directory = data;

    this.$nextTick(() => {
      this.getHomeworkDetail();
      // this.getRank();
      // this.getClassWorkDetail();
    });

    // console.log(this.id)
  },
};
</script>
<style lang="less" scoped>
.afterWorkDetail {
  margin: 84px auto;
  height: 1200px;
  width: 1400px;
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
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
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
          .msg {
            display: flex;
            flex-direction: row;
            width: 75%;
            .msg_detail1 {
              width: 60%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              font-size: 16px;
              color: #212121;
              margin: 5px 50px;
              .class_detail {
                font-size: 16px;
                color: #333333;
                margin: 5px 0px;
              }
            }
            .msg_detail2 {
              width: 40%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              font-size: 16px;
              color: #212121;
              margin: 5px 50px;
              .class_detail {
                font-size: 16px;
                color: #333333;
                margin: 5px 0px;
              }
            }
          }
          .num {
            display: flex;
            flex-direction: row;
            background: #ffffff;
            border: 1px solid #eeeeee;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.08);
            border-radius: 8px;
            padding: 8px 10px;
            .right_solid {
              border-right: 1px solid rgba(238, 238, 238, 1);
            }
            .aboutnum {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 0px 5px;
              .text_num {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                margin-bottom: 3px;
              }
              .text {
                font-size: 14px;
                color: #333333;
              }
            }
          }
        }
        .header_right{
          display: flex;
          .card{
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: #169BD5;
            border: 1px solid #169BD5;
            border-radius: 8px;
            color:white;
            margin-right: 20px;
            padding: 0px 20px;
            cursor: pointer;
          }
        }
      }
      .role {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px 30px;
        .search {
          display: flex;
          flex-direction: row;
        }
      }
      .pagination {
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
    }
    .detail_rank {
      position: relative;
      height: min-content;
      width: 380px;
      margin-left: 10px;
      background-color: white;
      padding-bottom: 30px;
      .title {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #febd2b;
        font-size: 18px;
        font-weight: bold;
        color: #212121;
        padding: 10px 0px;
      }
      .options {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        cursor: pointer;
        border-bottom: 1px solid #e5e5e5;
        .option {
          width: 100%;
          text-align: center;
          font-size: 16px;
          color: #999999;
          padding: 10px 0px;
        }
        .active {
          width: 100%;
          text-align: center;
          font-size: 16px;
          color: #333333;
          padding: 10px 0px;
          background-color: #fff2d5;
        }
      }
      .total {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px 30px;
        border-bottom: 1px solid #eeeeee;
      }
      .table_msg {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .rank {
        .paginationRank {
          position: absolute;
          bottom: 0px;
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
        .msg {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 10px 10px 0px;
        }
      }
    }
  }
}
</style>