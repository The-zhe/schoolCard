<template>
  <div>
    <div class="et1">
      <div class="f1">
        <div class="et-icon"><i class="el-icon-search"></i></div>
        <input
          type="text"
          v-model="condition"
          placeholder="输入手机号/姓名进行搜索"
        />
      </div>
      <el-button type="primary" @click="search">搜索</el-button>
    </div>

    <el-table
      :data="tableData"
      @current-change="handleCurrentChange"
      class="et-table"
      height="529"
      border
      style="width: 100%"
    >
      <el-table-column label="" width="35">
        <template slot-scope="scope">
          <el-radio v-model="receiveId" :label="scope.row.userId"> 1</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="schoolName" label="学校">
      </el-table-column>
      <el-table-column align="center" prop="name" label="姓名">
      </el-table-column>
      <el-table-column align="center" prop="phone" label="手机号">
      </el-table-column>
    </el-table>

    <el-pagination
      background
      small
      style="text-align: center"
      @current-change="getList"
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page.sync="current"
    >
    </el-pagination>
    <div style="text-align: right">
      <el-button type="primary" @click="submit">发送</el-button>
    </div>
  </div>
</template>

<script>
import Api from "@/api/lesson";
export default {
  data() {
    return {
      tableData: [],
      size: 10,
      total: 0,
      current: 1,
      condition: "",
      receiveId: 0,
    };
  },
  props: {
    value: {
      type: Boolean,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleCurrentChange(e) {
      this.receiveId = e ? e.userId : 0;
    },
    search() {
      this.current = 1;
      this.tableData = [];
      this.getList();
    },
    async getList() {
      const { data } = await Api.getSendTeacher({
        size: this.size,
        current: this.current,
        condition: this.condition,
        deptId: this.$store.state.user.data.deptId,
        teacherId: this.$store.state.user.teachInfo.userId,
      });
      this.total = data.total;
      this.tableData = data.records;
    },
    async submit() {
      if (!this.receiveId) {
        return this.$message({
          message: "请选择您要发送的老师",
          type: "warning",
        });
      }
      await Api.saveRecord({
        receiveId: this.receiveId * 1,
        sendId: this.$store.state.user.teachInfo.userId,
        teachPlanId: this.item.uuid,
      });
      this.$message({
        message: "发送成功",
        type: "success",
      });
      this.$emit("input", false);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-table__row {
  cursor: pointer;
}
/deep/.el-radio__label {
  display: none;
}
.et-table {
  text-align: center;
  margin: 20px 0;
}
.et1 {
  height: 36px;
  display: flex;
  margin-top: 20px;
  .f1 {
    flex: 1;
    margin-right: 20px;
    display: flex;
    .et-icon {
      width: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #febd2b;
      height: 100%;
      i {
        font-size: 20px;
        color: #fff;
      }
    }
    input {
      display: block;
      flex: 1;
      border: 1px solid #e0e0e0;
      padding: 0 12px;
      line-height: 34px;
    }
  }
}
</style>