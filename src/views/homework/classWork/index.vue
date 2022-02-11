<template>
  <div class="classWork">
    <tool-bar title="课上作业"></tool-bar>
    <div class="classWork_main">
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
          </div>
          <div class="hw_date">
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
            <el-table-column label="年级" align="center">
              <template slot-scope="scope">{{ scope.row.gradeName }}</template>
            </el-table-column>
            <el-table-column prop="classNo" label="班级" align="center">
              <template slot-scope="scope">{{ scope.row.classNo }}班</template>
            </el-table-column>
            <el-table-column
              label="上课日期"
              prop="startDate"
              align="center"
              sortable
              width="150px"
            ></el-table-column>
            <el-table-column label="时间段" align="center">
              <template slot-scope="scope">{{ scope.row.startTime }}</template>
            </el-table-column>
            <el-table-column
              label="应到人数"
              prop="totalNum"
              align="center"
            ></el-table-column>
            <el-table-column
              label="上课人数"
              prop="actualNum"
              align="center"
            ></el-table-column>
            <el-table-column
              label="创建者"
              prop="teacherName"
              align="center"
            ></el-table-column>
            <el-table-column label="操作" prop="operation" align="center">
              <template slot-scope="scope">
                <el-button
                  title="查看"
                  type="text"
                  style="color: #2196f3"
                  @click="toView(scope.row)"
                  >查看</el-button
                >
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
import { classList, classRecord } from "@/api/schoolaffair";
import ToolBar from "../../../components/navigation/toolBar.vue";
import { mapState } from "vuex";
import { formatDate } from "@/utils/formatTime";
import { teacherSubject } from "@/api/teach";
export default {
  name: "classWork",
  components: { ToolBar },
  data() {
    return {
      changeNum: 0,
      total: 10,
      currentPage: 1,
      recordFrom: {
        classId: "",
        subject: 1,
        teacherId: "",
        time: "",
        current: 1,
        size: "15",
      },
      date: "",
      value: [],
      options: [],
      teaClassList: [],
      directory: [],
      tableData: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
      teachSubject: (state) => state.user.teachSubject,
    }),
  },
  methods: {
    change(item, index) {
      this.changeNum = index;
      this.recordFrom.subject = item.type;
      this.getClassWork(this.recordFrom);
    },
    toView(row) {
      sessionStorage.setItem("changeNum", this.changeNum);
      console.log(row);
      this.$router.push({
        name: "workDetail",
        query: {
          id: row.id,
          subject: this.recordFrom.subject,
          classId: row.classId,
          classNo: row.classNo,
          gradeName: row.gradeName,
          teacherName: row.teacherName,
          date: row.startDate,
          actualNum: row.actualNum,
          totalNum: row.totalNum,
          roomId: row.roomId,
        },
      });
    },
    getDate(val) {
      console.log(val);
      if (val) {
        this.recordFrom.time = formatDate(val).value;
      } else {
        this.recordFrom.time = null;
      }
      this.getClassWork(this.recordFrom);
    },
    getGradeAndClass(val) {
      console.log(val);
      this.recordFrom.classId = val;
      this.getClassWork(this.recordFrom);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.recordFrom.current = val;
      this.getClassWork(this.recordFrom);
    },
    async getClassList() {
      try {
        const { data } = await classList(this.user.data.uid);
        this.teaClassList = data;
      } catch (e) {
        console.log(e);
      }
    },
    async getClassWork(from) {
      this.recordFrom.teacherId = this.user.data.uid;
      try {
        const { data } = await classRecord(from);
        console.log("classRecord", data);
        this.tableData = data.records;
        this.total = data.total;
      } catch (e) {
        console.log(e);
      }
    },
  },
  async mounted() {
    this.changeNum = sessionStorage.getItem("changeNum") || 0;
    sessionStorage.removeItem("changeNum");
    const { data } = await teacherSubject();
    this.directory = data;
    this.recordFrom.subject = this.directory[this.changeNum].type;
    await this.getClassList();
    await this.getClassWork(this.recordFrom);
  },
};
</script>
<style lang="less" scoped>
.classWork_main {
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