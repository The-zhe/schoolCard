<template>
  <div class="group main-wrapper">
    <div class="classChoose">
      <el-select
        v-model="classValue"
        placeholder="班级"
        clearable
        @change="selectClass"
      >
        <el-option
          v-for="item in classLists"
          :key="item.id"
          :label="`${item.grade}年级${item.classNo}班`"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button type="success" icon="el-icon-plus" @click="editHandle()"
        >新增分组</el-button
      >
    </div>
    <el-table
      class="homeTable"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 1300px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">{{
          scope.$index + 1 > 10 ? scope.$index : `0${scope.$index + 1}`
        }}</template>
      </el-table-column>
      <el-table-column prop="className" label="班级" width="120" align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="分组方案名"
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column prop="group" label="分组情况" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.remainEmptyNum == 0">已分组</div>
          <div v-else>还有{{ scope.row.remainEmptyNum }}人未分组</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="描述"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            title="人员划分"
            type="text"
            style="color: #85ba44"
            @click="peopleDivision(scope.row)"
            >人员划分</el-button
          >
          <el-button
            title="编辑"
            type="text"
            style="color: #2196f3"
            @click="editHandle(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            title="删除"
            type="text"
            style="color: #febd2b"
            @click="delHandle(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="prev, pager, next,jumper"
        :page-size="10"
        :total="total"
      >
      </el-pagination>
    </div>
    <edit
      v-if="editVisible"
      ref="edit"
      :classList="classLists"
      @refresh="refresh"
    ></edit>
    <division v-if="divVisible" ref="division"></division>
  </div>
</template>

<script>
import edit from "./group_edit";
import division from "./group_division";
import grid from "@/mixins/grid";
import { getTeachGroupPlan, getTeachGroupDel } from "@/api/empcustomer";
import { classList,getClassGroupList } from "@/api/teachMould";
export default {
  name: "group",
  components: { edit, division },
  mixins: [grid],
  data() {
    return {
      tableData1: [
        {
          class: "一年四班",
          groupName: "A组",
          group: "分组情况",
          describe: "一年4班A组",
        },
      ],
      tableData: null,
      classLists: null,
      classValue: "",
      currentPage: 1,
      pageSize: 10,
      divVisible: false,
      total: 1,
      dataFrom: {
        classUuid: "",
        teachPlanUuid: "",
        pageNum: "1",
        pageSize: "10",
      },
      listFrom: {
        grade: "",
        classNo: "",
        classTeacher: "",
        teacherName: "",
        className: "",
        courseList: "",
        pageNum: "1",
        pageSize: 10,
      },
      user: null,
    };
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      const params = {
        classId: this.classValue,
        current: this.pageNum,
        size: 10,
      };
      this.getTeachGroup(params);
    },

    peopleDivision(id) {
      //人员划分
      this.divVisible = true;
      this.$nextTick(() => {
        if (!id) {
          id = null;
        }
        this.$refs.division.init(id);
        // console.log(row)
      });
    },
    delHandle(id) {
      this.$confirm("是否删除此分组方案?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getTeachGroupDel(id);
          this.refresh();
          this.$message({
            message: `删除成功`,
            type: "success",
          });
        })
        .catch(() => {});
    },
    getUserInfo() {
      this.user = localStorage.getItem("user");
      this.getClassList(this.user.schoolId);
    },
    refresh() {
      const params = {
        classId: this.classValue,
        pageNum: 1,
        pageSize: 10,
      };
      this.getTeachGroup(params);
    },
    async getTeachGroup(from) {
      try {
        console.log("from", from);
        const { data } = await getTeachGroupPlan(from);
        console.log("getTeachGroupList", data);
        this.tableData = data.records;
        this.total = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async getClassList(id) {
      try {
        const { data } = await classList(id);
        this.classLists = data.records;
        console.log("schoolId", data);
      } catch (e) {
        console.log(e);
      }
    },

    async ClassGroupList(id) {
      console.log('ClassGroupList',id)
      try {
        const { data } = await getClassGroupList(id);
        this.tableData = data;
        console.log("ClassGroupList", data);
      } catch (e) {
        console.log(e);
      }
    },
    // selectClass(value) {
    //   // 根据班级获取分组列表
    //   const from = {
    //     classId: value,
    //     pageNum: 1,
    //     pageSize: 10,
    //   };
    //   this.pageNum = 1;
    //   this.total = 0;
    //   this.getTeachGroup(from);
    // },
    selectClass(value) {
      // 根据班级获取分组列表
      console.log('selectClass',value)
      // const from = {
      //   id: value,
      //   teachPlanUuid: "",
      //   pageNum: "1",
      //   pageSize: "10",
      // };
      if(value){
        this.ClassGroupList(value);
      }else{
        this.getTeachGroup(this.dataFrom);
      }
      
    },
  },
  mounted() {
    this.getTeachGroup(this.dataFrom);
    this.getUserInfo();
  },
};
</script>

<style lang="less" scoped>
.group {
  background: #fff;
  padding: 20px 20px 80px 20px;
  margin-top: 94px !important;
  min-height: 85vh;
  position: relative;
  width: 80%;
  .homeTable {
    margin: 0px auto;
  }
  .classChoose {
    // width: 1300px;
    margin: 0px auto;
    margin-top: 90px;
    display: flex;
    flex-direction: row;
    padding: 5px;
    justify-content: space-between;
    background-color: white;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #85ba44; // 进行修改背景和字体
    color: #ffffff;
  }
  .pagination {
    text-align: center;
    margin-top: 30px;
    position: absolute;
    left: 0;
    bottom: 20px;
    z-index: 1;
    width: 100%;
  }
}
</style>
