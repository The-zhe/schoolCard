<template>
  <div class="lg_main">
    <div class="lg">
      <div class="lg_right">
        <div class="load_text"></div>
        <el-input
          placeholder="请输入手机号"
          prefix-icon="el-icon-phone-outline"
          v-model="mobile"
          class="input-with-select"
        ></el-input>

        <div class="load_yz">
          <el-input
            placeholder="请输入验证码"
            prefix-icon="el-icon-key"
            v-model="verification"
            class="input-with-select"
          ></el-input>
          <el-button round :class="isYz ? 'cf_yz' : 'yz'" @click="getYz()">{{
            code
          }}</el-button>
        </div>
        <el-input
          type="password"
          placeholder="请输入新密码（支持6-12位数字、字母大小写）"
          prefix-icon="el-icon-lock"
          :maxlength="12"
          :show-password="false"
          v-model="password"
          class="input-with-select"
        ></el-input>
        <el-input
          style="margin-top: 20px"
          type="password"
          placeholder="请再次输入新密码"
          :maxlength="12"
          prefix-icon="el-icon-lock"
          :show-password="false"
          v-model="password2"
          class="input-with-select"
        ></el-input>
        <el-button class="load" @click="load">确定修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { passwordCode, teacherLogin, modifyPassword } from "@/api/login";
export default {
  components: {},
  data() {
    return {
      mobile: "",
      password: "",
      password2: "",
      verification: "",
      seconds: 30,
      isYz: false,
      yz_code: "验证码",
      cf_code: "重发",
      code: "验证码",
    };
  },
  mounted() {},
  methods: {
    getYz() {
      const arg1 =
        /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|17[0-9]{1}|(18[0-9]{1})|(19[0-9 {4}]{1}))+\d{8})$/;
      if (this.mobile === "" || !arg1.test(this.mobile)) {
        return this.$message({
          message: "请输入正确的手机号码",
          type: "info",
        });
      }
      this.seconds = 30;
      this.isYz = true;
      this.code = `${this.cf_code}(${this.seconds})`;
      const time = setInterval(() => {
        this.seconds--;
        this.code = `${this.cf_code}(${this.seconds})`;
        if (this.seconds <= 0) {
          clearInterval(time);
          this.code = `${this.cf_code}`;
          this.isYz = false;
        }
      }, 1000);
      passwordCode({ mobile: this.mobile })
        .then((res) => {
          this.$message({
            message: "发送成功",
            type: "success",
          });
        })
        .catch((res) => {
          clearInterval(time);
          this.code = `${this.cf_code}`;
          this.isYz = false;
        });
    },
    load() {
      const arg1 =
        /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|17[0-9]{1}|(18[0-9]{1})|(19[0-9 {4}]{1}))+\d{8})$/;
      if (this.mobile === "" || !arg1.test(this.mobile)) {
        return this.$message({
          message: "请输入正确的手机号码",
          type: "info",
        });
      }

      if (!this.verification) {
        return this.$message({
          message: "请输入验证码",
          type: "info",
        });
      }

      var zg = /^[0-9a-zA-z]*$/;

      if (!this.password) {
        return this.$message({
          message: "请输入密码",
          type: "info",
        });
      }
      if (this.password.length < 6) {
        return this.$message({
          message: "密码不能小于6位",
          type: "info",
        });
      }
      if (!zg.test(this.password)) {
        return this.$message({
          message: "请输入字母或数字组合的密码",
          type: "info",
        });
      }

      if (this.password2 != this.password) {
        return this.$message({
          message: "两次密码输入不一致",
          type: "info",
        });
      }

      let data = {
        mobile: this.mobile,
        code: this.verification,
        newPassword: this.password,
      };

      modifyPassword(data).then((res) => {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        setTimeout(() => {
          this.$router.push({ path: "/home" });
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.lg-tp {
  width: 0;
  height: 0;
  border-top: 80px solid #febd2b;
  border-left: 80px solid transparent;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  .lg-sp {
    position: absolute;
    top: -58px;
    left: -43px;
    z-index: 10;
    transform: rotate(45deg);
    font-size: 18px;
    width: 60px;
    color: #644601;
  }
}
.pwd-tip {
  display: flex;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  .cof {
    color: #ccc;
    margin-left: 5px;
  }

  .f1 {
    flex: 1;
    overflow: hidden;
  }
  .forget {
    cursor: pointer;
  }
}

.lg_main {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 350px;
  margin: 200px auto 0 auto !important;

  .lg-t0 {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    color: #fff;
    margin-bottom: 25px;

    img {
      width: 45px;
      height: 45px;
      margin-right: 10px;
    }
  }

  .lg-t1 {
    margin-bottom: 40px;
    font-size: 20px;
    text-align: center;
    color: #fff;
  }

  .lg_name {
    color: #fff;
    text-align: center;
    font-size: 24px;
    margin-bottom: 32px;
    height: 1px;
    margin-top: 50px;
    position: relative;

    .lg-n2 {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &::before,
    &::after {
      content: "";
      width: 40%;
      position: absolute;
      height: 1px;
      background: #fff;
      top: 0;
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }
  .lg {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    .lg_left {
      position: relative;
      display: flex;
      flex-direction: column;
      padding-right: 40px;
      border-right: 1px dashed #707070;
      .code {
        height: 220px;
        width: 220px;
        margin-top: 40px;
        margin-left: 30px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .invalid_code {
        position: absolute;
        display: flex;
        flex-direction: column;
        height: 220px;
        width: 220px;
        top: 40px;
        left: 30px;
        background-color: rgba(255, 255, 255, 0.9);
        .invalid {
          color: #000;
          font-size: 24px;
          text-align: center;
          margin-top: 60px;
        }
        .refresh {
          margin: 30px auto 0px;
          font-size: 12px;
          color: #fff;
          background-image: linear-gradient(to right, #7cd9c0, #03ab8a);
          width: 160px;
        }
      }
      .code_text {
        color: #707070;
        text-align: center;
        font-size: 18px;
        margin-left: 30px;
        margin-top: 10px;
      }
    }
    .lg_right {
      display: flex;
      width: 100%;
      flex-direction: column;
      padding: 0 40px;
      .load_text {
        color: #1d1d1d;
        margin-bottom: 20px;
        font-size: 22px;
      }
      .load_yz {
        display: flex;
        flex-direction: row;
        margin: 20px 0px;
        .yz {
          background: #00b584;
          color: #fff;
          margin-left: 20px;
          cursor: pointer;
        }
        .cf_yz {
          background: #707070;
          color: #fff;
          margin-left: 20px;
          pointer-events: none;
        }
      }
      .load {
        margin-top: 30px;
        font-size: 18px;
        color: #fff;
        background-image: linear-gradient(#ff6f36, #df3a0f);
      }
    }
  }
}
</style>
