<template>
  <div>
    <dataHeader @change="checkChange" />
    <div class="planManagement_content">
      <div class="class_main">
        <div :key="index" v-for="(x, index) in cardData" class="box">
          <plan-card :cardData="x" @delect="delect" @send="send" />
        </div>
        <div class="no_lesson" v-if="!cardData.length">暂无课程</div>
      </div>
      <div class="bottom_page">
        <el-pagination
          background
          @current-change="getPlanListData"
          layout="prev, pager, next"
          :total="total"
          :page-size="size"
          :current-page.sync="currentPage"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog title="发送课件" :visible.sync="dialogTableVisible">
      <p>请选择您要发送的老师</p>
      <Send
        :item="sel"
        v-if="dialogTableVisible"
        v-model="dialogTableVisible"
      />
    </el-dialog>
  </div>
</template>

<script>
import SelectCourse from "../../../../components/common/selectCourse.vue";
import PlanCard from "./planCard.vue";
import Api from "@/api/lesson";
import dataHeader from "@/components/teachActivity/dataHeader";
import Send from "./send.vue";
export default {
  components: { PlanCard, SelectCourse, dataHeader, Send },
  data() {
    return {
      dialogTableVisible: false,
      currentPage: 1,
      size: 10,
      total: 0,
      params: {},
      cardData: [],
      show: false,
      sel: {},
    };
  },
  props: ["teachPlanName"],
  methods: {
    send(e) {
      this.sel = e;
      this.dialogTableVisible = true;
    },
    delect(id) {
      this.$confirm("是否删除此教学方案?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await Api.teachPlanRemove([id]);
          this.$message({
            message: `删除成功`,
            type: "success",
          });
          this.currentPage = 1;
          this.getPlanListData();
        })
        .catch(() => {});
    },
    //分类改变时
    checkChange(res) {
      this.currentPage = 1;
      this.params = res;
      this.getPlanListData();
    },
    //请求获取列表
    async getPlanListData() {
      const params = {
        ...this.params,
        size: this.size,
        teachPlanName: this.teachPlanName,
        current: this.currentPage,
        createdBy: this.$store.state.user.data.uid,
        teacherId: this.$store.state.user.teachInfo.userId,
      };
      try {
        const { data } = await Api.getPlanList(params);
        this.cardData = data.records;
        this.total = data.total;
      } catch (e) {}
    },
  },
  created() {
    this.getPlanListData();
  },
};
</script>

<style lang="less" scoped>
.planManagement_content {
  width: 100%;
  user-select: none;
  background: #fff;
  min-height: calc(100vh - 280px);
  padding-bottom: 60px;
  position: relative;

  .plan_check_class {
    width: 100%;
    height: 69px;
    border-bottom: 1px solid #f3f3f3;
  }
  .class_main {
    width: 100%;
    overflow: hidden;
    text-align: center;

    // display: flex;
    // justify-content: space-around;
    // flex-wrap: wrap;
    .no_lesson {
      height: 20%;
      margin: auto;
      margin-top: 155px;
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 2px dotted #8c8c8ca8;
      color: #666666;
    }
    .box {
      width: 20%;
      // background: red;
      height: 222px;
      float: left;
      box-sizing: border-box;
      padding: 15px;
      display: flex;
      justify-content: center;
    }
  }
  .bottom_page {
    box-sizing: border-box;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 19px 0 28px;
    position: absolute;
    z-index: 1;
    left: 0;
    bottom: 0;
    width: 100%;
    .page_info {
      font-size: 14px;
      color: #666666;
    }
  }
}
</style>
