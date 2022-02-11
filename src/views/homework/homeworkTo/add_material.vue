<template>
  <el-dialog
    title="添加素材"
    class="editExam"
    width="60%"
    :show-close="true"
    :visible.sync="visible"
  >
    <el-input
      placeholder="请输入内容"
      v-model="dataFrom.fodderName"
      class="input-with-select"
      clearable
      @change="search"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="search"
      ></el-button>
    </el-input>
    <div class="table">
      <el-table
        ref="filterTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="fodderName" label="文件名称" width="260">
        </el-table-column>
        <el-table-column
          prop="fodderType"
          label="类型"
          width="100"
          :filters="[
            { text: 'word', value: 1 },
            { text: 'excel', value: 2 },
            { text: 'ppt', value: 3 },
            { text: '视频', value: 4 },
            { text: '音频', value: 5 },
            { text: '图片', value: 6 },
            { text: '活动', value: 7 },
            { text: '题库', value: 8 },
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              disable-transitions
              type="primary"
              v-if="scope.row.fodderType == 1"
              >word</el-tag
            >
            <el-tag
              disable-transitions
              type="info"
              v-else-if="scope.row.fodderType == 2"
              >excel</el-tag
            >
            <el-tag
              disable-transitions
              type="success"
              v-else-if="scope.row.fodderType == 3"
              >ppt</el-tag
            >
            <el-tag
              disable-transitions
              type="warning"
              v-else-if="scope.row.fodderType == 4"
              >视频</el-tag
            >
            <el-tag
              disable-transitions
              type="primary"
              effect="plain"
              v-else-if="scope.row.fodderType == 5"
              >音频</el-tag
            >
            <el-tag
              disable-transitions
              type="info"
              effect="plain"
              v-else-if="scope.row.fodderType == 6"
              >图片</el-tag
            >
            <el-tag
              disable-transitions
              type="success"
              effect="plain"
              v-else-if="scope.row.fodderType == 7"
              >活动</el-tag
            >
            <el-tag
              disable-transitions
              type="warning"
              effect="plain"
              v-else-if="scope.row.fodderType == 8"
              >题库</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="上传时间"
          sortable
          column-key="date"
        >
          <template slot-scope="scope">
            {{ scope.row.createdTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="fodderSize"
          label="文件大小"
        ></el-table-column>
      </el-table>
      <div class="pagination">
          <el-pagination
            :background="true"
            @current-change="handleCurrentChange"
            :current-page="dataFrom.current"
            :page-size="6"
            layout="prev, pager, next ,jumper"
            :total="total"
          >
          </el-pagination>
          <el-button @click="submit">确定</el-button>
        </div>
    </div>
  </el-dialog>
</template>
<script>
import { getTeachFodderList } from "@/api/empcustomer";
export default {
  data() {
    return {
      visible: false,
      tableData: [],
      multipleSelection:[],
      materUrlList:[],
      total:'',
      dataFrom: {
        fodderName: "",
        grade: "",
        course: "",
        chapter: "",
        createdBy: "",
        current: 1,
        size: "5",
      },
    };
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
  },
  methods: {
    init(course) {
      this.dataFrom.course = course;
      this.getTeachFodder(this.dataFrom);
      this.visible = true;
    },
    search() {
      this.dataFrom.current = 1;
      this.getTeachFodder(this.dataFrom);
    },
    filterTag(value, row) {
      return row.fodderType === value;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
     handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.dataFrom.current = val;
      this.getTeachFodder(this.dataFrom);
    },
    submit(){
      console.log(this.multipleSelection)
      // this.multipleSelection.forEach(item => {
      //   this.materUrlList.push(item.fodderUrl)
      // })
      this.$emit("getMaterUrl", this.multipleSelection);
      this.visible = false;
    },
    async getTeachFodder(from) {
      try {
        const { data } = await getTeachFodderList(from);
        console.log("getTeachFodder", data);
        this.tableData = data.records;
        this.total = data.total;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.pagination {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      width: 100%;
      .el-pagination.is-background .el-pager li:not(.disabled).mative {
        background-color: #85ba44; // 进行修改背景和字体
        color: #ffffff;
      }
    }
</style>