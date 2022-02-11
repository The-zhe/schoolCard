<template>
  <el-dialog
    title="请选择页码"
    :show-close="true"
    :visible.sync="visible"
    center
  >
    <div class="heng">
      <div class="tip">页码:</div>
      <el-input v-model="page" placeholder="请输入页码"></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="searchPage"
      ></el-button>
    </div>
    <div v-if="pageInfo">
      <img
        :src="imgPrefix + pageInfo.img"
        alt=""
        style="width: 100%; height: 100%"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="toAddCard">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getPage, getPageList } from "@/api/homework";
export default {
  data() {
    return {
      visible: false,
      page: null,
      pageFrom: {
        bookId: null,
        page: null,
      },
      pageListFrom: {
        bookId: null,
        pageId: null,
      },
      pageInfo: null,
      pageList: null,
    };
  },
  methods: {
    init(book) {
      this.visible = true;
      console.log('book',book)
      this.pageFrom.bookId = book.id;
      this.pageListFrom.bookId = book.id
    },
    searchPage() {
      if (!isNaN(this.page)) {
        this.pageFrom.page = this.page;
        this.pages(this.pageFrom);
      } else {
        this.$message({
          message: "请输入正确的页码",
          type: "warning",
        });
      }
    },
    async pages(from) {
      try {
        const { data } = await getPage(from);
        console.log("page", data);
        this.pageInfo = data;
        this.pageListFrom.pageId = this.pageInfo.id
        this.pageListGet(this.pageListFrom);
        //this.imgPrefix
      } catch (e) {
        console.log(e);
      }
    },
    async pageListGet(from) {
      try {
        const { data } = await getPageList(from);
        console.log("pageList", data);
        this.pageList = data
      } catch (e) {
        console.log(e);
      }
    },
    toAddCard() {
      if (this.page && this.pageList) {
        this.$emit("pageName", this.page);
        this.$emit("ListForPage", this.pageList);
        this.visible = false;
      } else {
        this.$message({
          message: "请先点击搜索按钮查看预览！",
          type: "warning",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.heng {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  .tip {
    width: 50px;
    margin-right: 5px;
  }
}
</style>