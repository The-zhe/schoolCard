<template>
  <div class="planManagement">
    <tool-bar title="课堂教学方案管理">
      <div style="margin-right: 20px">
        <el-input
          placeholder="请输入内容"
          v-model="searchValue"
          class="input-with-select"
        >
          <el-button
            type="primary"
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
        </el-input>
      </div>
      <router-link
        to="/lessonPreparation/createPlan"
        class="planManagement_top_button"
      >
        <el-button type="success"
          ><i class="el-icon-plus"></i>创建课程</el-button
        >
      </router-link>
    </tool-bar>
    <div :style="{ minHeight: clintHeight + 'px' }" class="main">
      <!-- <plan-management-content/> -->
      <PlanManagementContent ref="plan" :teachPlanName="searchValue" />
    </div>
  </div>
</template>

<script>
import ToolBar from "../../../components/navigation/toolBar.vue";
import PlanManagementContent from "./components/planManagementContent.vue";
import Bus from "@/utils/bus";
export default {
  components: {
    ToolBar,
    PlanManagementContent,
  },
  data() {
    return {
      searchValue: "",
      clintHeight: window.innerHeight - 180,
    };
  },
  mounted() {
    Bus.$on("updatePlan", () => {
      this.search();
    });
  },
  methods: {
    search() {
      this.$refs.plan.currentPage = 1;
      this.$refs.plan.getPlanListData();
    },
  },
  beforeDestroy() {
    Bus.$off("updatePlan");
  },
};
</script>

<style lang="less" scoped>
.planManagement {
  .main {
    width: 95%;
    margin: auto;
    // min-height: 770px;
    margin-top: 85px;
    min-width: 1200px;

    // margin-bottom: 40px;
  }
  i {
    position: relative;
    right: 5px;
  }
}
</style>

