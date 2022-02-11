<template>
  <div class="afterClassWork">
    <tool-bar title="课后作业"></tool-bar>
    <div class="afterClassWork_main">
      <div class="qb_directory">
        <div class="list_name">科目</div>
        <div class="dir_list">
          <div
            class="list"
            v-for="(item, index) in directory"
            :key="index"
            :class="index == changeNum ? 'qb' : 'list'"
            @click="change(item, index)"
          >
            {{ item.course }}
          </div>
        </div>
      </div>

      <div class="qb_detail">
        <div class="qb_upload">
          <div class="hw_date">
            <div style="margin-right: 10px">日期:</div>
            <el-date-picker
              v-model="date"
              type="date"
              placeholder="选择日期"
              @change="getDate"
            >
            </el-date-picker>
            <a
              :href="pub + '个性化错题分析报告.pdf'"
              style="margin-left: 20px"
              download
            >
              <el-button type="primary">下载个性化错题分析报告</el-button>
            </a>
            <a :href="pub + '测评报告.pdf'" style="margin-left: 20px" download>
              <el-button type="primary">下载测评报告</el-button>
            </a>
          </div>
          <div class="hw_date">
            <!-- <div style="margin-right: 10px">年级:</div>
            <el-select v-model="value" placeholder="请选择" style="width:120px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
            <div style="margin-right: 10px">班级:</div>
            <el-select
              v-model="value"
              clearable
              placeholder="请选择"
              style="width: 120px"
              @change="getGradeAndClass"
            >
              <el-option
                v-for="item in teaClassList"
                :key="item.id"
                :label="`${item.grade}年级${item.classNo}班`"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="table">
          <el-table
            ref="filterTable"
            :data="tableData"
            style="width: 100%"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column label="序号" align="center">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column
              label="年级"
              prop="grade"
              align="center"
              width="100px"
            >
              <template slot-scope="scope">
                {{ scope.row.grade }}年级
              </template>
            </el-table-column>
            <el-table-column
              prop="classNo"
              label="班级"
              align="center"
              width="100px"
            >
              <template slot-scope="scope">
                {{ scope.row.classNo? scope.row.classNo+'班':'暂无班级'}}
              </template>
            </el-table-column>
            <el-table-column
              label="标题"
              prop="title"
              align="center"
              width="150px"
            >
            <template slot-scope="scope">
              <span>
                {{scope.row.title}}
              </span>
            </template>
            </el-table-column>
            <el-table-column
              label="发布日期"
              align="center"
              width="150px"
              sortable
            >
              <template slot-scope="scope">
                {{
                  scope.row.releaseTime
                    ? scope.row.releaseTime.substring(0, 10)
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="送达人数"
              prop="planNum"
              align="center"
            ></el-table-column>
            <el-table-column
              label="上交人数"
              prop="actNum"
              align="center"
            ></el-table-column>
            <el-table-column label="需要批改" prop="createBy" align="center">
              <template slot-scope="scope">
                <p
                  style="display: contents"
                  v-if="scope.row.correctStatus == 0"
                >
                  未批改
                </p>
                <p
                  style="display: contents"
                  v-else-if="scope.row.correctStatus == 1"
                >
                  已批改
                </p>
                <p
                  style="display: contents"
                  v-else-if="scope.row.correctStatus == 2"
                >
                  无需批改
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="operation" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.recall == 0"
                  style="color: #2196f3; padding: 0px !important"
                  title="查看"
                  type="text"
                  @click="toDeatil(scope.row)"
                  >查看</el-button
                >
                <el-button
                  style="color: rgb(236, 86, 86); padding: 0px !important"
                  title="撤回"
                  type="text"
                  @click="recall(scope.row)"
                >
                  {{ scope.row.recall == 0 ? "撤回" : "已撤回" }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="pagination">
          <el-pagination
            :background="true"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="15"
            layout="prev, pager, next,jumper"
            :total="total"
          >
          </el-pagination>
          <el-button>确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import ToolBar from "../../../components/navigation/toolBar.vue";
import { studenthomework, classList, recallHomework } from "@/api/schoolaffair";
import { formatDate } from "@/utils/formatTime";
import { teacherSubject } from "@/api/teach";
export default {
  name: "classWork",
  components: { ToolBar },
  data() {
    return {
      changeNum: 0,
      currentPage: 1,
      total: 1,
      pub: process.env.BASE_URL + "assets/",
      homeworkFrom: {
        teacherId: "",
        homeworkType: 1,
        classId: "",
        date: null,
        current: 1,
        size: 15,
      },
      date: "",
      value: [],
      teaClassList: [],
      directory: [],
      tableData: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
      classList: (state) => state.classList,
      teachSubject: (state) => state.user.teachSubject,
    }),
  },
  methods: {
    change(item, index) {
      this.changeNum = index;
      this.homeworkFrom.homeworkType = item.type;
      this.getStuAfterHomework();
    },
    toDeatil(row) {
      console.log(row);
      sessionStorage.setItem("changeNum", this.changeNum);
      this.$router.push({
        name: "afterWorkDetail",
        query: {
          id: row.id,
          changeNum: this.changeNum,
          grade: row.grade,
          classNo: row.classNo,
          planNum: row.planNum,
          actNum: row.actNum,
          teacherName: row.teacherName,
          createTime: row.createTime,
          releaseTime: row.releaseTime,
          homeworkType: row.homeworkType,
          correctStatus: row.correctStatus,
          title:row.title,
          content:row.content,
          tempType:row.tempType
        },
      });
    },
    getDate(val) {
      if (val) {
        this.homeworkFrom.date = formatDate(val).value;
      } else {
        this.homeworkFrom.date = null;
      }
      this.getStuAfterHomework();
    },
    getGradeAndClass(val) {
      if (val != "") {
        this.homeworkFrom.classId = val;
      } else {
        this.homeworkFrom.classId = null;
      }
      this.getStuAfterHomework();
    },
    recall(row) {
      if (row.recall == 0) {
        this.getRecallHomework(row.id);
      } else if (row.recall == 1) {
        this.$message({
          type: "info",
          message: "已撤回，无须操作",
        });
      } else {
        this.$message({
          type: "error",
          message: "撤回失败，请联系管理人员",
        });
      }
    },
    async getStuAfterHomework() {
      this.homeworkFrom.teacherId = this.user.data.uid;
      try {
        const { data } = await studenthomework(this.homeworkFrom);
        console.log("studenthomework", data);
        this.tableData = data.records;
        this.total = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async getClassList() {
      try {
        const { data } = await classList(this.user.data.uid);
        console.log("classlist", data);
        this.teaClassList = data;
      } catch (e) {
        console.log(e);
      }
    },
    async getRecallHomework(from) {
      try {
        const { data } = await recallHomework(from);
        console.log("recall", data);
        this.getStuAfterHomework();
      } catch (e) {
        console.log(e);
      }
    },
    handleCurrentChange(val) {
      console.log(val);
      this.homeworkFrom.current = val;
      this.getStuAfterHomework();
    },
  },
  async mounted() {
    this.changeNum = sessionStorage.getItem("changeNum") || 0;
    sessionStorage.removeItem("changeNum");
    const { data } = await teacherSubject();
    this.directory = data;
    this.homeworkFrom.homeworkType = this.directory[this.changeNum].type;
    await this.getStuAfterHomework();
    await this.getClassList();
  },
};
</script>
<style lang="less" scoped>
.afterClassWork_main {
  margin: 84px auto;
  height: 1200px;
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
        background-color: #cee9ff;

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
    .qb_type {
      display: flex;
      flex-direction: column;
      background-color: white;
      padding: 10px 30px 10px 10px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      color: #666666;
      margin-bottom: 20px;
      .type {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        .green {
          color: #85ba44;
        }
        .pad {
          padding: 10px;
        }
      }
      // .type_grade{
      //     display: flex;
      //     flex-direction: row;
      // }
    }
    .qb_upload {
      // width: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px 30px 10px 10px;
      background-color: #fafbfc;
      font-size: 14px;
      font-family: Microsoft YaHei;
      .hw_date {
        display: flex;
        align-items: center;
        margin: 10px;
      }
    }
    .table {
      background-color: #ffffff;
      margin-top: 20px;
      height: 100%;
      .option {
        display: flex;
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
  .el-collapse /deep/ .el-collapse-item__header {
    line-height: 18px;
  }
}
</style>