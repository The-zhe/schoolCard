<template>
  <div class="exam_detail">
    <div class="qb_upload">
      <el-select
        v-model="classId"
        clearable
        placeholder="请选择"
        @change="reset"
        style="margin-right: 50px"
      >
        <el-option
          v-for="item in classList2"
          :key="item.clazzId"
          :label="
            item.alias ? item.alias : `${item.grade}年级${item.classNo}班`
          "
          :value="item.clazzId"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="date"
        type="date"
        @change="reset"
        placeholder="选择日期"
      >
      </el-date-picker>
    </div>

    <div class="correct">
      <el-table :data="tableData" stripe>
        <el-table-column label="班级" align="center">
          <template slot-scope="scope">
            {{ scope.row.alias ? scope.row.alias : scope.row.className }}
          </template>
        </el-table-column>
        <el-table-column
          prop="testStartTime"
          label="开考时间"
          align="center"
          width="200px"
        >
        </el-table-column>
        <el-table-column prop="lengthTime" label="考试时间" align="center">
        </el-table-column>
        <el-table-column prop="testSumAnswer" label="答题人数" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <a
              class="cut"
              style="color: #2196f3"
              @click="
                go(
                  '/simpleTest?type=edit&id=' +
                    scope.row.id +
                    '&time=' +
                    scope.row.testStartTime +
                    '&roomId=' +
                    scope.row.roomId
                )
              "
              tag="span"
              v-if="scope.row.flag > 0"
              >修改答案</a
            >
            <a
              class="cut"
              style="color: #ec5656"
              @click="
                go(
                  '/simpleTest?type=add&id=' +
                    scope.row.id +
                    '&time=' +
                    scope.row.testStartTime +
                    '&roomId=' +
                    scope.row.roomId
                )
              "
              tag="span"
              v-else
              >添加答案</a
            >

            <el-button
              title="导出"
              type="text"
              style="color: #febd2b"
              @click="exportScore(scope.row)"
              >导出</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        :background="true"
        @current-change="getList"
        :current-page="currentPage"
        :page-size="size"
        layout="prev, pager, next,jumper"
        :total="total"
      >
      </el-pagination>
      <el-button>确定</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { simpleList } from "@/api/exam";
import { formatDate } from "@/utils/formatTime";
import { exportScore } from "@/axios/download";
export default {
  data() {
    return {
      classId: "",
      date: "",
      tableData: [],
      total: 0,
      currentPage: 1,
      size: 17,
      classList2: [],
    };
  },
  props: ["mlNum"],
  computed: {
    ...mapState({
      user: (state) => state.user,
      classList: (state) => state.user.classList,
    }),
  },
  mounted() {
    let list = {};
    this.classList.forEach((item) => {
      list[item.clazzId] = item;
    });
    list = Object.values(list);
    this.classList2 = list;
    this.getList();
  },
  methods: {
    go(e) {
      sessionStorage.setItem("mlNum", this.mlNum);
      this.$router.push(e);
    },
    exportScore(e) {
      const params = {
        flag: e.flag ? 1 : 0,
        classId: e.classId,
        templateId: e.id,
        time: e.testStartTime,
        roomId: e.roomId,
      };
      exportScore(params);
    },
    reset() {
      this.currentPage = 1;
      this.getList();
    },
    async getList() {
      this.tableData = [];
      const params = {
        current: this.currentPage,
        classId: this.classId,
        teacherId: this.user.teachInfo.userId,
        size: this.size,
      };
      if (this.date) {
        params.time = formatDate(this.date).value;
      }
      const { data } = await simpleList(params);
      this.total = data.total;
      this.tableData = data.records;
    },
  },
};
</script>

<style>
.cut {
  cursor: pointer;
  margin-right: 20px;
}
</style>