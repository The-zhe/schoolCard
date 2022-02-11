<template>
  <div class="activity">
    <tool-bar title="教学活动"></tool-bar>
    <div class="activity_main">
      <!-- 目录 -->
      <div class="act_directory">
        <div class="dir_list">
          <div
            class="list"
            v-for="(item, index) in directory"
            :key="index"
            :class="{ act: changeNum == index }"
            @click="change(index)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="act_detail">
        <div class="detail_search">
          <div class="list_title">我的教学活动</div>
          <div class="list_search">
            <el-input v-model="pageFrom.teachActivityName" clearable></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              style="font-size: 14px"
              @click="searchActivity()"
            ></el-button>
            <el-button type="success" icon="el-icon-plus" @click="editHandle()"
              >新增活动</el-button
            >
          </div>
        </div>
        <div class="act_list" v-for="(act, index) in actList" :key="index">
          <div class="act_name">{{ act.activityName }}</div>
          <div class="act_opear">
            <div
              style="font-size: 16px; color: #2196f3; cursor: pointer"
              @click="editActive(act.uuid, act.activityType)"
            >
              编辑
            </div>

            <div
              style="
                font-size: 16px;
                color: #febd2b;
                margin-left: 20px;
                cursor: pointer;
              "
              @click="getTeachActivityRemove(act, index)"
            >
              删除
            </div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            :background="true"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="7"
            layout="prev, pager, next,jumper"
            :total="total"
          >
          </el-pagination>
          <el-button>确定</el-button>
        </div>
      </div>
    </div>
    <AddActive v-if="editVisible" ref="edit" @complete="getAdd"></AddActive>
    <Subject :uuid="uid" :activityType="type" v-model="show"></Subject>
  </div>
</template>
<script>
import ToolBar from "../../../components/navigation/toolBar.vue";
import AddActive from "@/components/teachActivity/addActive.vue";
import Subject from "@/components/subject";
import {
  teachActivityPage,
  teachActivity,
  teachActivityRemove,
} from "@/api/empcustomer";
import { mapState, mapActions } from "vuex";
import grid from "@/mixins/grid";
export default {
  inject:['reload'],
  name: "activity",
  mixins: [grid],
  components: { ToolBar, AddActive, Subject },
  data() {
    return {
      uid: "",
      type: "",
      show: false,
      changeNum: 0,
      search: "",
      total: 0,
      currentPage: 1,
      directory: [
        {
          title: "我的教学活动",
        },
      ],
      actList: [],
      pageFrom: {
        teachActivityName: "",
        createBy: "",
        current: "",
        size: "7",
      },
      total: 0,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    editActive(id, type) {
      console.log("id", id, "type", type);
      if (type == 4 || type == 5) {
        this.uid = id;
        this.type = type;
        this.show = true;
      } else {
        this.editHandle(id, type);
      }
    },
    getAdd(val){
      console.log('getAdd',val)
      this.reload()
    },
    searchActivity() {
      console.log("search");
      console.log(this.pageFrom)
      this.getTeachActivityPage(this.pageFrom);
    },
    change(index) {
      this.changeNum = index;
    },
    delHandle(act, index) {
      console.log("act", act);
      this.actList.splice(index, 1);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTeachActivityPage(this.pageFrom);
      console.log(`当前页: ${val}`);
    },
    async getTeachActivity(uid) {
      try {
        const { data } = await teachActivity(uid);
        console.log("getTeachActivity", data);
      } catch (e) {
        console.log("err", e);
      }
    },
    async getTeachActivityPage(from) {
      from.current = this.currentPage;
      from.createBy = this.user.data.uid;
      try {
        const { data } = await teachActivityPage(from);
        console.log("teachActivityPage", data);
        this.actList = data.records;
        this.total = data.total;
        console.log("total", this.total);
      } catch (e) {
        console.log("err", e);
      }
    },
    async getTeachActivityRemove(item, index) {
      try {
        const { data } = await teachActivityRemove([item.uuid]);
        console.log("getTeachActivityRemove", data);
        this.actList.splice(index,1)
        this.reload()
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.getTeachActivityPage(this.pageFrom);
  },
};
</script>
<style lang="less" scoped>
.activity_main {
  margin: 84px auto;
  height: 755px;
  width: 1200px;
  display: flex;
  flex-direction: row;
  .act_directory {
    display: flex;
    flex-direction: row;
    background-color: white;
    width: 174px;
    margin-right: 20px;
    .dir_list {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      .list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        color: #212121;
        cursor: pointer;
      }
    }
  }
  .act_detail {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 10px 30px 10px 10px;
    .detail_search {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .list_title {
        font-size: 22px;
      }
      .list_search {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
    .act_list {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 20px;
      border: 1px solid #eeeeee;
      margin: 10px 0px;
      .act_name {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #212121;
      }
      .act_opear {
        display: flex;
        flex-direction: row;
        align-self: center;
      }
    }
    .pagination {
      // margin-top: 20px;
      position: absolute;
      bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #85ba44; // 进行修改背景和字体
        color: #ffffff;
      }
    }
  }
  .act {
    background-color: #f5f5f5;
    border-left: 2px solid #2196f3;
  }
}
</style>