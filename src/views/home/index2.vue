<template>
  <div class="home">
    <div class="classChoose">
      <el-select v-model="value" placeholder="班级">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
      style="width: 80%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="序号" width="60">
        <!-- <template slot-scope="scope" >{{ scope.$index + 1 > 10 ? scope.$index + 1 : '0' + scope.$index + 1 }}</template> -->
        <template slot-scope="scope">{{
          scope.$index + 1 > 10 ? scope.$index : `0${scope.$index + 1}`
        }}</template>
      </el-table-column>
      <el-table-column prop="class" label="班级" width="120"> </el-table-column>
      <el-table-column prop="groupName" label="分组方案名"></el-table-column>
      <el-table-column prop="group" label="分组1情况"></el-table-column>
      <el-table-column prop="describe" label="描述"></el-table-column>
      <el-table-column prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button title="人员划分" type="text" style="color: #85ba44"
            >人员划分</el-button
          >
          <el-button title="编辑" type="text" style="color: #2196f3"
            >编辑</el-button
          >
          <el-button
            title="删除"
            type="text"
            style="color: #febd2b"
            @click="delHandle(scope.row, scope.$index)"
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
        :total="1000"
      >
      </el-pagination>
      <el-button>确定</el-button>
    </div>
    <edit v-if="editVisible" ref="edit"></edit>
  </div>
</template>

<script>
import edit from "./home_edit";
import grid from "@/mixins/grid";
export default {
  name: "home2",
  components: { edit },
  mixins: [grid],
  data() {
    return {
      input: "德克士",
      tableData: [
        {
          class: "2016-05-03",
          groupName: "王小虎",
          group: "上海市普陀区",
          describe: "11111111",
        },
        {
          class: "2016-05-02",
          groupName: "王小虎",
          group: "上海市普陀区",
          describe: "11111111",
        },
        {
          class: "2016-05-04",
          groupName: "王小虎",
          group: "上海市普陀区",
          describe: "11111111",
        },
        {
          class: "2016-05-01",
          groupName: "王小虎",
          group: "上海市普陀区",
          describe: "11111111",
        },
        {
          class: "2016-05-08",
          groupName: "王小虎",
          group: "上海市普陀区",
          describe: "11111111",
        },
        {
          class: "2016-05-06",
          groupName: "王小虎",
          group: "上海市普陀区",
          describe: "11111111",
        },
        {
          class: "2016-05-07",
          groupName: "王小虎",
          group: "上海市普陀",
          describe: "11111111",
        },
      ],
      options: [
        {
          value: "选项1",
          label: "1班",
        },
        {
          value: "选项2",
          label: "2班",
        },
        {
          value: "选项3",
          label: "3班",
        },
        {
          value: "选项4",
          label: "4班",
        },
        {
          value: "选项5",
          label: "5班",
        },
      ],
      value: "",
      currentPage: 1,
    };
  },
  mounted() {
    //console.log(process.env.BASE_URL);
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    delHandle(detail, num) {
      console.log("delete", detail, num);
      this.tableData.splice(num, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  .homeTable {
    margin: 0px auto;
  }
  .classChoose {
    width: 80%;
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
