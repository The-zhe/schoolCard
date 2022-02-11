<template>
  <div class="mould-body">
    <m-header title="系统模板" type="system" @search="search"></m-header>
    <div>
      <m-list
        v-for="item in list"
        :key="item.id"
        :item="item"
        @add="add"
        type="system"
      ></m-list>
    </div>

    <div class="mould-bottom">
      <el-pagination
        background
        style="text-align: center"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next, jumper, total"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import mHeader from "./components/m-header";
import mList from "./components/m-list";
import {
  teachModelPage,
  teachModelInfo,
  teachModelAdd,
} from "@/api/teachMould";
import { mapState } from "vuex";
export default {
  data() {
    return {
      pageNum: 1,
      total: 0,
      pageSize: 9,
      text: "",
      list: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const params = {
        teachModelName: this.text,
        current: this.pageNum,
        size: this.pageSize,
        type: 2,
      };
      try {
        const { data } = await teachModelPage(params);
        this.total = data.total;
        this.list = data.records;
      } catch (e) {}
    },
    async add(uuid) {
      try {
        const { data } = await teachModelInfo(uuid);
        const params = {
          teachModelName: data.teachModelName,
          remark: data.remark,
          teachModelStepAddReqList: [...data.teachModelStep4InfoRes],
          createdBy: this.user.data.uid,
        };
        await teachModelAdd(params);
        this.$message({
          message: `收录成功`,
          type: "success",
        });
      } catch (e) {}
    },
    search(value) {
      this.text = value;
      this.pageNum = 1;
      this.total = 0;

      this.getList();
    },
    handleCurrentChange(val) {
      this.getList();
    },
  },
  components: {
    mHeader,
    mList,
  },
};
</script>

<style lang="less" scoped>
.mould-body {
  padding: 0 16px 50px 16px;
  position: relative;

  .mould-bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-bottom: 15px;
  }

  .m-item {
    margin: 20px 0;
  }
}
</style>