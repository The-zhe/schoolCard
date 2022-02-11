<template>
  <div class="workDetail">
    <div class="detail_main">
      <div class="detail_table">
        <div class="table_header">
          <div class="title">课堂分析及反思</div>
          <div class="header_msg">
            <div class="msg">
              <div class="msg_detail1">
                <div class="class_detail">
                  学科：
                  <div
                    v-for="(item, index) in this.user.teachSubject"
                    :key="index"
                    style="display: contents"
                  >
                    <div
                      v-if="homeworkType == item.type"
                      style="display: contents"
                    >
                      {{ item.course }}
                    </div>
                  </div>
                </div>
                <div class="class_detail">任课老师：{{ teacherName }}</div>
              </div>
              <div class="msg_detail2">
                <div class="class_detail">班级：{{ grade }}{{ classNo }}班</div>
                <div class="class_detail">上课日期：{{ date }}</div>
              </div>
            </div>
            <div class="num">
              <div class="aboutnum right_solid">
                <div class="text_num">{{ totalNum }}</div>
                <div class="text">应到人数</div>
              </div>
              <div class="aboutnum">
                <div class="text_num">{{ actualNum }}</div>
                <div class="text">实到人数</div>
              </div>
            </div>
          </div>
        </div>
        <div class="role">
          <div class="search">
            <el-input
              placeholder="请输入姓名"
              v-model="search"
              clearable
              class="input-with-select"
              style="width: 220px"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchName"
                style="
                  background: #2196f3;
                  color: white;
                  border: 1px solid #2196f3;
                  border-top-left-radius: 0px;
                  border-bottom-left-radius: 0px;
                "
              ></el-button>
            </el-input>
            <el-button plain style="margin: 0px 10px" @click="clearFilter"
              >默认排序</el-button
            >
          </div>
          <el-button type="danger" style="float: right" @click="writeReflect">
            {{isreflection?'查看教学反思':'填写教学反思'}}
          </el-button>
        </div>
        <el-table :data="tableData" ref="filterTable" style="width: 100%">
          <el-table-column label="序号" align="center">
            <template slot-scope="scope">
              {{ (initFrom.current - 1) * 14 + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center">
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            align="center"
            :filters="[
              { text: '正常上课', value: '正常上课' },
              { text: '缺勤', value: '缺勤' },
              { text: '事假', value: '事假' },
              { text: '病假', value: '病假' },
            ]"
            :filter-method="filterHandler"
          >
          </el-table-column>
          <el-table-column prop="vote" label="投票次数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="vies" label="抢答次数" align="center" sortable>
          </el-table-column>
          <el-table-column
            prop="accuracy"
            label="正确率"
            align="center"
            sortable
          >
          </el-table-column>
          <el-table-column prop="operation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                title="查看"
                type="text"
                style="color: #2196f3"
                @click="viewAnswer(scope.row)"
                >查看</el-button
              >
              <router-link to="/temporary/checkWork" style="color: #2196f3"
                >批改</router-link
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            :background="true"
            @current-change="handleCurrentChange"
            :current-page="initFrom.current"
            :page-size="initFrom.size"
            layout="prev, pager, next,jumper"
            :total="total"
          >
          </el-pagination>
          <el-button>确定</el-button>
        </div>
      </div>

      <!------------------------------------------------------------------    排行榜   -------------------------------------------------------------- -->
      <div class="detail_rank">
        <div class="title">排行榜</div>
        <div class="options">
          <div
            :class="index == changeNum ? 'active' : 'option'"
            v-for="(item, index) in options"
            :key="index"
            @click="change(index)"
          >
            {{ item }}
          </div>
        </div>
        <div class="total">
          <div>
            总题数：
            <div style="display: contents" v-if="changeNum === 0">
              {{ rankData.length > 0 ? rankData[0].totalNum : 0 }}
            </div>
            <div style="display: contents" v-if="changeNum === 1">
              {{ wrongData.records.length > 0 ? wrongData.total : 0 }}
            </div>
            <div style="display: contents" v-if="changeNum === 2">
              {{ noData.records.length > 0 ? noData.total : 0 }}
            </div>
          </div>
          <el-checkbox v-model="checked" @change="ischeck"
            >不计算考勤</el-checkbox
          >
        </div>
        <el-table
          v-if="changeNum === 0"
          :data="rankData"
          :span-method="arraySpanMethod0"
          height="500"
          stripe
          style="width: 100%"
        >
          <el-table-column label="排名" prop="rank" width="50" align="center">
            <template slot-scope="scope">
              {{ (rankCurrent - 1) * 10 + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">
              <div class="table_msg">
                <div>{{ scope.row.name }}</div>
                <div>{{ scope.row.rightNum }}</div>
              </div>
              <el-progress
                :color="scope.row.accuracy >= 60 ? '#409eff' : '#f56c6c'"
                :text-inside="true"
                :stroke-width="15"
                :percentage="scope.row.accuracy ? scope.row.accuracy : 0"
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="正确题数" align="center"> </el-table-column>
          <el-table-column prop="rate" label="正确率" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.accuracy ? scope.row.accuracy : "0" }}%
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="changeNum === 1"
          :data="wrongData.records"
          :span-method="arraySpanMethod1"
          height="500"
          stripe
          style="width: 100%"
        >
          <el-table-column label="排行" width="50" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="题目" align="center">
            <template slot-scope="scope">
              <el-popover
                placement="right"
                title="涉及知识点"
                width="200"
                trigger="hover"
              >
                <div class="kpList">
                  <div v-if="scope.row.kpList.length > 0">
                    <div v-for="(item, index) in scope.row.kpList" :key="index">
                      {{ index + 1 }}.{{ item }}
                    </div>
                  </div>
                  <div v-if="scope.row.kpList.length == 0">暂无知识点</div>
                </div>
                <div class="table_msg" slot="reference">
                  <div class="oneBreak">{{ scope.row.questionContent }}</div>
                  <div>{{ scope.row.errorNum }}人</div>
                  <div>
                    {{ scope.row.errorRate ? scope.row.errorRate : 0 }}%
                  </div>
                </div>
              </el-popover>
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="scope.row.errorRate ? scope.row.errorRate : 0"
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="错误人数" align="center"> </el-table-column>
          <el-table-column prop="rate" label="错误率" width="80" align="center">
          </el-table-column>
        </el-table>
        <el-table
          v-if="changeNum === 2"
          :data="noData.records"
          :span-method="arraySpanMethod1"
          height="500"
          stripe
          style="width: 100%"
        >
          <el-table-column label="排行" width="50" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="题目" align="center">
            <template slot-scope="scope">
              <el-popover
                placement="right"
                title="涉及知识点"
                width="200"
                trigger="hover"
              >
                <div class="kpList">
                  <div v-if="scope.row.kpList.length > 0">
                    <div v-for="(item, index) in scope.row.kpList" :key="index">
                      {{ index + 1 }}.{{ item }}
                    </div>
                  </div>
                  <div v-if="scope.row.kpList.length == 0">暂无知识点</div>
                </div>
                <div class="table_msg" slot="reference">
                  <div class="oneBreak">{{ scope.row.questionContent }}</div>
                  <div class="oneBreak">{{ scope.row.unMasterNum }}人</div>
                  <div>
                    {{ scope.row.unMasterRate ? scope.row.unMasterRate : 0 }}%
                  </div>
                </div>
              </el-popover>
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="
                  scope.row.unMasterRate ? scope.row.unMasterRate : 0
                "
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="未听懂人数" align="center"> </el-table-column>
          <el-table-column
            label="比例"
            width="80"
            align="center"
          ></el-table-column>
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
      <AnswerDetail v-if="isView" ref="stuDetail"></AnswerDetail>
      <Reflect v-if="isReflect" ref="reflect"></Reflect>
    </div>
  </div>
</template>
<script>
import AnswerDetail from "./answerDetail.vue";
import Reflect from './Dialog/teachReflect.vue'
import {
  detailPage,
  errorPage,
  masterPage,
  rightPage,
  editTeachReflect
} from "@/api/schoolaffair";
import { mapState } from "vuex";
export default {
  components: { AnswerDetail, Reflect },
  data() {
    return {
      id: this.$route.query.id,
      homeworkType: this.$route.query.subject,
      grade: this.$route.query.gradeName,
      classNo: this.$route.query.classNo,
      teacherName: this.$route.query.teacherName,
      date: this.$route.query.date,
      actualNum: this.$route.query.actualNum,
      totalNum: this.$route.query.totalNum,
      roomId: this.$route.query.roomId,
      isView: false,
      isReflect: false,
      isreflection:false,
      search: "",
      checked: false,
      changeNum: 0,
      total: 0,
      rankTotal: 0,
      current: 1,
      rankCurrent: 1,
      size: 10,
      options: ["正确率", "错题", "未听懂"],
      tableData: [],
      rankData: [],
      noData: "",
      wrongData: "",
      initFrom: {
        absenteeism: "1",
        classId: this.$route.query.classId,
        current: 1,
        size: 14,
        name: "",
        accuracyOrder: 0,
        roomId: this.$route.query.roomId,
        subject: this.$route.query.subject,
      },
      wrongFrom: {
        absenteeism: "1",
        classId: this.$route.query.classId,
        current: 1,
        size: 10,
        accuracyOrder: 0,
        roomId: this.$route.query.roomId,
        subject: this.$route.query.subject,
      },
      masterFrom: {
        absenteeism: "1",
        classId: this.$route.query.classId,
        current: 1,
        size: 10,
        accuracyOrder: 0,
        roomId: this.$route.query.roomId,
        subject: this.$route.query.subject,
      },
      rightFrom: {
        absenteeism: "1",
        classId: this.$route.query.classId,
        current: 1,
        size: 10,
        accuracyOrder: 0,
        roomId: this.$route.query.roomId,
        subject: this.$route.query.subject,
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    change(index) {
      this.changeNum = index;
      console.log(index);
      if (index == 0) {
        this.getRightPage(this.rightFrom);
      } else if (index == 1) {
        this.getErrorPage(this.wrongFrom);
      } else if (index == 2) {
        this.getMasterPage(this.masterFrom);
      }
    },
    ischeck(val) {
      console.log(val);
      if (val) {
        this.initFrom.absenteeism = "0";
        this.rightFrom.absenteeism = "0";
        this.wrongFrom.absenteeism = "0";
        this.masterFrom.absenteeism = "0";
        if (this.changeNum == 0) {
          this.getRightPage(this.rightFrom);
        } else if (this.changeNum == 1) {
          this.getErrorPage(this.wrongFrom);
        } else if (this.changeNum == 2) {
          this.getMasterPage(this.masterFrom);
        }
      } else {
        this.initFrom.absenteeism = "1";
        this.rightFrom.absenteeism = "1";
        this.wrongFrom.absenteeism = "1";
        this.masterFrom.absenteeism = "1";
        if (this.changeNum == 0) {
          this.getRightPage(this.rightFrom);
        } else if (this.changeNum == 1) {
          this.getErrorPage(this.wrongFrom);
        } else if (this.changeNum == 2) {
          this.getMasterPage(this.masterFrom);
        }
      }
    },
    viewAnswer(row) {
      console.log(this.roomId);
      this.isView = true;
      this.$nextTick(() => {
        this.$refs.stuDetail.init(this.roomId, row.userId);
      });
    },
    writeReflect(){
      this.isReflect = true;
      this.$nextTick(() => {
        this.$refs.reflect.init(this.roomId);
      });
    },
    searchName() {
      this.initFrom.name = this.search;
      this.getDetailPage(this.initFrom);
    },
    arraySpanMethod0({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 2];
      } else if (columnIndex === 2) {
        return [0, 0];
      }
    },
    arraySpanMethod1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 3];
      } else if (columnIndex === 2) {
        return [0, 0];
      }
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
      this.search = "";
      this.initFrom.name = "";
      this.getDetailPage(this.initFrom);
    },
    handleCurrentChange(val) {
      console.log(val);
      this.initFrom.current = val;
      this.getDetailPage(this.initFrom);
    },
    handleCurrentChangeRank(val) {
      console.log(val);
      if (this.changeNum == 0) {
        this.rightFrom.current = val;
        this.rankCurrent = val;
        this.getRightPage(this.rightFrom);
      } else if (this.changeNum == 1) {
        this.wrongFrom.current = val;
        this.rankCurrent = val;
        this.getErrorPage(this.wrongFrom);
      } else if (this.changeNum == 2) {
        this.masterFrom.current = val;
        this.rankCurrent = val;
        this.getMasterPage(this.masterFrom);
      }
    },
    async getDetailPage(from) {
      try {
        const { data } = await detailPage(from);
        console.log(data);
        data.records.forEach((item) => {
          if (item.enterRoom > 0) {
            this.$set(item, "state", "正常上课");
          } else if (item.enterRoom == 0 && item.leaveType == null) {
            this.$set(item, "state", "缺勤");
          } else if (item.enterRoom == 0 && item.leaveType == 1) {
            this.$set(item, "state", "事假");
          } else if (item.enterRoom == 0 && item.leaveType == 2) {
            this.$set(item, "state", "病假");
          } else {
            this.$set(item, "state", "异常");
          }
        });
        this.tableData = data.records;
        this.rankData = data.records;
        this.total = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async getErrorPage(from) {
      try {
        const { data } = await errorPage(from);
        console.log("ErrorPage", data);
        this.wrongData = data;
        this.rankTotal = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async getMasterPage(from) {
      try {
        const { data } = await masterPage(from);
        console.log("masterPage", data);
        this.noData = data;
        this.rankTotal = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async getRightPage(from) {
      try {
        const { data } = await rightPage(from);
        console.log("rightPage", data);
        this.rankData = data.records;
        this.rankTotal = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async editInit(roomId){
      try{
        const {data} = await editTeachReflect(roomId)
        console.log(data)
        data.reflection?this.isreflection = true:this.isreflection = false
      }catch(e){
        console.log(e)
      }
    }
  },
  mounted() {
    this.getDetailPage(this.initFrom);
    this.getRightPage(this.rightFrom);
    this.editInit(this.roomId)
  },
};
</script>
<style lang="less" scoped>
.workDetail {
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
      width: 900px;
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
            width: 80%;
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
  }
  .oneBreak {
    width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
</style>