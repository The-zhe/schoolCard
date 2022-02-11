<template>
  <div class="mould-body">
    <m-header title="我的模板" type="my" @search="search"></m-header>
    <div>
      <m-list
        v-for="item in list"
        :key="item.id"
        :item="item"
        type="my"
        @remove="remove"
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
import { teachModelPage, teachModelRemove } from "@/api/teachMould";
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
    remove(id) {
      this.$confirm("是否删除此模板?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await teachModelRemove([id]);
          this.search(this.text);
          this.$message({
            message: `删除成功`,
            type: "success",
          });
        })
        .catch(() => {});
    },
    async getList() {
      const params = {
        teachModelName: this.text,
        current: this.pageNum,
        size: this.pageSize,
        createdBy: this.user.data.uid,
        type: 1,
      };
      try {
        const { data } = await teachModelPage(params);
        this.total = data.total;
        this.list = data.records;
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