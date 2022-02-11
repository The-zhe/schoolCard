<template>
  <div>
    <div class="headTop">
      <router-link to="/home" class="logo">
        <img style="width: 20px" src="@/assets/logo-t.png" alt="" />
        <div style="margin-top: 5px; color: #85ba44; font-size: 12px">
          {{ environment == "测试" ? "云教研平台-备课端" : "夸哩教师备课平台" }}
        </div>
      </router-link>
      <div class="menu">
        <menu-top />
      </div>
      <div class="logo environment" style="cursor: pointer">
        <a
          :href="
            webUrl['event-ui'] + '/kuali/index.html?environment=' + args_type
          "
          >教务系统大数据</a
        >
      </div>
      <div class="logo environment" v-if="environment">
        {{ environment }}环境
      </div>
      <div class="top_user">
        <el-popover placement="bottom" v-model="visible" @show="hasNew = false">
          <Msg :visible="visible" @changeNew="changeNew" />

          <el-badge slot="reference" is-dot :hidden="!hasNew" class="bell">
            <i class="el-icon-bell"></i>
          </el-badge>
        </el-popover>

        <div class="head_img">
          <img
            :src="user.data.headImg || require('@/assets/defaultHeadImg.jpg')"
            alt="用户头像"
          />
        </div>
        <el-dropdown>
          <span class="fa user_name">{{ user.data.username || "未登录" }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="psd">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import MenuTop from "./menuTop.vue";
import Msg from "./msg.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      visible: false,
      hasNew: false,
      environment: "",
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  filters: {},
  mounted() {
    let name = "";
    switch (args_type) {
      case "test":
        name = "测试";
        break;
      case "pre":
        name = "演示";
        break;
    }
    this.environment = name;
  },
  methods: {
    changeNew(e) {
      this.hasNew = e;
    },
    async submit() {
      this.dialogVisible = false;
      Bus.$emit("updatePlan");
    },
    psd() {
      this.$router.push("/modifyPwd");
    },
    exit() {
      this.$store.commit("logout");
    },
  },
  components: { MenuTop, Msg },
};
</script>

<style lang="less" scoped>
.environment {
  float: left;
  margin-left: 10px;
}
.headTop {
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  top: 0;
  background-color: #ffffff;
  z-index: 999;
  .logo {
    height: 100%;
    // width: 100px;
    display: block;
    display: -webkit-flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    -webkit-align-items: center;
    float: left;
    margin: 0 20px;
  }
  .menu {
    height: 100%;
    overflow: hidden;
    // width: 720px;
    float: left;
  }
  .top_user {
    height: 100%;
    // width: 150px;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    float: right;

    .bell {
      margin-right: 20px;
      i {
        color: #757575;
        cursor: pointer;
        font-size: 23px;
      }
    }

    .head_img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
      overflow: hidden;
      img {
        width: 35px;
        height: 35px;
        border: 1px solid #f3f3f3;
        border-radius: 50%;
        cursor: pointer;
      }
    }
    .user_name {
      color: #757575;
      font-size: 14px;
      margin-right: 20px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .user_name:after {
      content: "\f0dd";
      position: relative;
      top: -2px;
      right: -6px;
    }
    .user_name:hover {
      text-decoration: underline;
    }
  }
}
</style>
