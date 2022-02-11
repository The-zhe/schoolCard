<template>
  <div class="newhomework">
    <tool-bar title="布置作业"></tool-bar>
    <div class="newhomework_main">
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
            <div style="margin: 0px 10px">班级:</div>
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
            <!-- <el-button
              type="primary"
              icon="el-icon-search"
              style="margin-left: 10px"
              >查询</el-button
            > -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              style="margin-left: 10px"
              @click="allDelete"
              >批量删除</el-button
            >
          </div>
          <el-button
            type="success"
            icon="el-icon-plus"
            @click="toNewWork()"
            style="margin: 10px"
            >新建作业</el-button
          >
        </div>

        <div class="table">
          <el-table
            ref="filterTable"
            :data="tableData"
            style="width: 100%"
            :default-sort="{ prop: 'date', order: 'descending' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="序号" align="center" width="50px">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="年级" align="center" width="100px">
              <template slot-scope="scope">{{ scope.row.grade }}年级</template>
            </el-table-column>
            <el-table-column
              prop="classNo"
              label="班级"
              align="center"
              width="100px"
            >
              <template slot-scope="scope">{{ scope.row.classNo }}班</template>
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
            <el-table-column label="文本附件" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.fileStatus == 1">有</div>
                <div v-if="scope.row.fileStatus == 2">无</div>
              </template>
            </el-table-column>
            <el-table-column
              label="在线题数"
              prop="quesNum"
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
                  type="text"
                  style="color: #2196f3; padding: 0px !important"
                  @click="editRow(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  style="color: #2196f3; padding: 0px !important"
                  @click="deleteRow(scope.row.id, scope.$index)"
                  >删除</el-button
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
import { classList, makeHomework, removeWork } from "@/api/schoolaffair";
import { mapState } from "vuex";
import ToolBar from "../../../components/navigation/toolBar.vue";
import { teacherSubject } from "@/api/teach";
export default {
  name: "classWork",
  components: { ToolBar },
  data() {
    return {
      changeNum: 0,
      total: 10,
      currentPage: 1,
      selectedData: [],
      workFrom: {
        classId: "",
        date: "",
        homeworkType: 1,
        teacherId: "",
        size: 15,
        current: 1,
      },
      teaClassList: [],
      date: [],
      value: [],
      options: [],
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
      this.workFrom.homeworkType = item.type;
      this.getHomework(this.workFrom);
    },
    toNewWork() {
      sessionStorage.setItem("changeNum", this.changeNum);
      this.$router.push({
        name: "newHomework",
        query: {
          id: this.id,
          homeworkType: this.workFrom.homeworkType,
        },
      });
    },
    editRow(row) {
      sessionStorage.setItem("changeNum", this.changeNum);
      this.$router.push({
        name: "newHomework",
        query: {
          id: row.id,
          homeworkType: this.workFrom.homeworkType,
          teacherName: row.teacherName,
        },
      });
    },
    deleteRow(id, index) {
      this.$confirm("此操作将会删除该作业，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.removeHomeWork(id);
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
      } else {
        this.$message({
          type: "info",
          message: "请选择要删除的题目",
        });
      }
    },
    handleSelectionChange(data) {
      this.selectedData = data;
    },
    handleCurrentChange(val) {
      this.workFrom.current = val;
      this.getHomework(this.workFrom);
    },
    getGradeAndClass(val) {
      if (val != "") {
        this.workFrom.classId = val;
      } else {
        this.workFrom.classId = null;
      }
      this.getHomework(this.workFrom);
    },
    async getHomework(from) {
      this.workFrom.teacherId = this.user.data.uid;
      try {
        const { data } = await makeHomework(from);
        console.log("makeHomework", data);
        this.tableData = data.records;
      } catch (e) {
        console.log(e);
      }
    },
    async getClassList() {
      try {
        const { data } = await classList(this.user.data.uid);
        this.teaClassList = data;
      } catch (e) {
        console.log(e);
      }
    },
    async removeHomeWork(id) {
      try {
        const { data } = await removeWork(id);
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
    this.workFrom.homeworkType = this.directory[this.changeNum].type;
    await this.getHomework(this.workFrom);
    await this.getClassList();
    localStorage.removeItem("ruleForm");
    localStorage.removeItem("questionList");
    localStorage.removeItem("cardList");
    localStorage.removeItem("cardDataFrom");
  },
};
</script>
<style lang="less" scoped>
.newhomework_main {
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
      flex-direction: row;
      justify-content: space-between;
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
      // position: absolute;
      // bottom: 20px;
      background-color: white;
      padding: 20px 0px 20px 0px;
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