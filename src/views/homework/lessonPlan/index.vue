<template>
  <div class="lenssonPlan">
    <tool-bar title="教师教案管理"></tool-bar>
    <div class="lenssonPlan_main">
      <div class="screen">
        <el-form
          ref="form"
          :model="dataFrom"
          label-width="100px"
          class="screen_from"
        >
          <el-form-item label="科目">
            <el-select v-model="dataFrom.course" placeholder="请选择科目">
              <el-option
                v-for="item in courseList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级">
            <el-select v-model="dataFrom.grade" placeholder="请选择年级">
              <el-option
                v-for="item in classList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教案最后编辑时间" label-width="150px">
            <el-date-picker
              v-model="dataFrom.date"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="教师名字">
            <el-input
              style="width: 217px"
              v-model="dataFrom.teacherName"
            ></el-input>
          </el-form-item>
          <el-form-item label="教案名称">
            <el-input
              style="width: 460px"
              v-model="dataFrom.planName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-delete" @click="empty">清空</el-button>
            <el-button type="primary" icon="el-icon-search" @click="search"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="planTable">
        <el-table :data="tableFrom">
          <el-table-column label="序号" align="center" width="100px">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="教师" align="center">
            <template slot-scope="scope">{{ scope.row.teacherName }}</template>
          </el-table-column>
          <el-table-column label="教案名称" align="center">
            <template slot-scope="scope">{{
              scope.row.teachPlanName
            }}</template>
          </el-table-column>
          <el-table-column label="科目" align="center">
            <template slot-scope="scope">
              {{ scope.row.courseName }}
            </template>
          </el-table-column>
          <el-table-column label="年级" align="center">
            <template slot-scope="scope">{{ scope.row.grade }}年级</template>
          </el-table-column>
          <el-table-column
            label="教学方案最后编辑时间"
            align="center"
            width="200px"
          >
            <template slot-scope="scope">{{ scope.row.updatedTime }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230px">
            <template slot-scope="scope">
              <el-button
                title="教学方案"
                type="text"
                style="color: #2196f3; padding: 0px"
                @click="toPlan(scope.row)"
                >教学方案</el-button
              >
              <el-button
                v-if="scope.row.reflectionType"
                title="教学反思"
                type="text"
                style="color: #2196f3"
                @click="toReflect(scope.row)"
                >教学反思</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
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
        </div>
      </div>
    </div>
    <Reflect ref="reflect" v-if="isShow"></Reflect>
  </div>
</template>
<script>
import ToolBar from "../../../components/navigation/toolBar.vue";
import Reflect from "./Dialog/reflect.vue";
import { mapState } from "vuex";
import { dictType } from "@/api/admin";
import {
  clazzListReflect,
  courseListReflect,
  reflectList,
} from "@/api/schoolaffair";
export default {
  name: "lenssonPlan",
  components: { ToolBar, Reflect },
  computed: {
    ...mapState({
      user: (state) => state.user,
      teachSubject: (state) => state.user.teachSubject,
    }),
  },
  data() {
    return {
      teacherId: "361",
      isShow: false,
      total: 0,
      currentPage: 1,
      pagesize: 18,
      classList: null,
      courseList: null,
      dataFrom: {
        course: null,
        grade: null,
        date: null,
        teacherName: null,
        planName: null,
        teacherId: null,
        size:17,
        current: 1,
      },
      tableFrom: [],
    };
  },
  methods: {
    toReflect(row) {
      this.isShow = true;
      this.$nextTick(() => {
        this.$refs.reflect.init(row);
      });
    },
    handleCurrentChange(val) {
      this.dataFrom.current = val
      this.getList(this.dataFrom);
    },
    search() {
      this.getList(this.dataFrom);
    },
    empty() {
      this.dataFrom.course = null;
      this.dataFrom.grade = null;
      this.dataFrom.date = null;
      this.dataFrom.teacherName = null;
      this.dataFrom.planName = null;
    },
    toPlan(row) {
      this.$router.push({
        name: "teachPlan",
        query: {
          detail: JSON.stringify(row),
        },
      });
    },
    async getClass() {
      try {
        const { data } = await clazzListReflect(this.user.data.uid); //this.user.data.uid
        this.classList = data;
      } catch (e) {
        console.log(e);
      }
    },
    async getCourse() {
      try {
        const { data } = await courseListReflect(this.user.data.uid); //this.user.data.uid
        this.courseList = data;
      } catch (e) {
        console.log(e);
      }
    },
    async getList(from) {
      from.teacherId = this.user.data.uid
      try {
        const { data } = await reflectList(from); //this.user.data.uid
        this.tableFrom = data.records;
        this.total = data.total;
        this.getSubjects();
      } catch (e) {
        console.log(e);
      }
    },
    async getSubjects() {
      try {
        const subjectData = await dictType("course_type"); //获取科目
        console.log(this.tableFrom);
        console.log(subjectData);
        if (this.tableFrom.length > 0) {
          this.tableFrom.forEach(item=> {
            subjectData.data.forEach(sub => {
              if (item.course == sub.value) {
                this.$set(item, "courseName", sub.label);
              }
            });
          });
        }
        console.log(this.tableFrom)
      } catch (e) {
        console.log(e);
        this.$message({
          message: "信息错误",
          type: "warning",
        });
      }
    },
  },
  mounted() {
    this.getClass();
    this.getCourse();
    this.getList(this.dataFrom);
  },
};
</script>
<style lang="less" scoped>
.lenssonPlan_main {
  margin: 84px auto;
  height: 1200px;
  width: 1200px;
  .screen {
    margin-bottom: 10px;
    background-color: #fff;
  }
  .screen_from {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
  }
  .planTable {
    position: relative;
    height: 100%;
    background-color: #fff;
    /deep/.pagination {
      position: absolute;
      bottom: 80px;
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
}
/deep/.has-gutter {
  > tr {
    background-color: transparent;

    > th {
      background: #e1f1ff;
    }
  }

  color: #333333;
}
</style>