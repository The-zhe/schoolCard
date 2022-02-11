<template>
  <el-dialog :title="title" :visible.sync="show" width="70%">
    <el-scrollbar class="activelist">
      <div class="edit-label-title" style="margin-top: 0">
        活动名称
        <span class="require">*</span>
      </div>
      <input
        class="mould-input"
        type="text"
        v-model="activityName"
        placeholder="请输入活动名称"
      />
      <div class="edit-label-title">备注</div>
      <textarea class="mould-text" v-model="remark"></textarea>
      <div class="edit-label-title">
        添加试题
        <span class="require">*</span>
      </div>
      <div class="resolve-box">
        <el-upload
          class="avatar-uploader"
          ref="upload"
          :data="data"
          :action="serverUrl"
          :headers="header"
          :on-change="handlePreview"
          :on-success="success"
          :on-error="error"
          :auto-upload="false"
          :file-list="fileList"
          :show-file-list="false"
        >
          <div class="up-row">
            <div class="up">
              <span>选择文件</span>
            </div>
            <div class="filenm ell">{{ fileName }}</div>
          </div>
        </el-upload>
        <div class="upload" @click="submitUpload" v-loading="loading">
          开始上传并解析试题
        </div>
        <a class="down" :href="pub + 'question-temp.xlsx'" download>模板下载</a>
        <div class="line"></div>
        <div class="btn2" @click="select('system')">系统题库</div>
        <!-- <div class="btn2" @click="select('my')">我的题库</div> -->
      </div>

      <div class="subject-list">
        <div v-for="(item, index) in list" :key="index">
          <div class="number mt15">
            试题{{ index + 1 }}【{{ questionType[item.questionType] }}】
          </div>
          <div class="title">
            <div class="input-sub" v-html="item.questionContent"></div>
            <input
              type="text"
              class="total"
              v-model="item.total"
              placeholder="分值"
            />
            <div class="del" @click="delect(index)">删除</div>
          </div>
          <textarea
            class="mould-text mt15"
            v-if="item.questionType == 3"
            v-model="item.optionContent"
          ></textarea>
          <template
            v-if="
              item.questionType == 1 ||
              item.questionType == 2 ||
              item.questionType == 4
            "
          >
            <div
              class="subject-item"
              v-for="(res, j) in item.options"
              :key="res.id"
              @click="check(item, res)"
            >
              <div class="input-sub">
                <span>{{ asc[j] }}</span>
                <div v-html="res.optionContent"></div>
              </div>
              <div class="check">
                <span class="icon iconfont" v-if="res.rightAnswer"
                  >&#xe61e;</span
                >
              </div>
            </div>
          </template>
          <!-- <template v-if="item.questionType == 4">
            <div
              class="subject-item"
              v-for="d1 in array"
              :key="d1.value"
              @click="check2(item, d1.value)"
            >
              <div class="input-sub">
                <div>{{ d1.label }}</div>
              </div>
              <div class="check">
                <span class="icon iconfont" v-if="item.rightAnswers == d1.value"
                  >&#xe61e;</span
                >
              </div>
            </div>
          </template> -->
        </div>
      </div>
    </el-scrollbar>
    <div class="cp-submit" style="margin-top: 15px">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { questionType, asc } from "@/configs";
import { baseUrl, uploadUrl } from "@/configs";
import store from "@/store";
export default {
  data() {
    return {
      data: { teacherId: this.$store.state.user.teachInfo.userId },
      fileName: "",
      pub: process.env.BASE_URL + "assets/",
      serverUrl: baseUrl + "/oto/myQuestion/import/excel", //默认素材上传路径
      header: {
        Authorization: `Bearer ${store.state.user.access_token}`,
      },
      fileList: [],
      asc,
      questionType,
      show: false,
      activityName: "",
      remark: "",
      list: [],
      loading: false,
      array: [
        { label: "正确", value: "T" },
        { label: "错误", value: "F" },
      ],
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.list = [];
        this.activityName = "";
        this.remark = "";
        this.fileName = "";
        this.$nextTick(() => {
          this.$refs.upload.clearFiles();
        });
        this.show = val;
      }
    },
    show(val) {
      if (!val) {
        this.$emit("input", val);
      }
    },
  },
  mounted() {
    this.show = this.value;
  },
  methods: {
    submitUpload() {
      if (this.fileName) {
        this.loading = true;
        this.$refs.upload.submit();
      } else {
        this.$message({
          message: "请选择上传文件",
          type: "info",
        });
      }
    },
    error() {
      this.loading = false;
    },
    success({ data }) {
      this.loading = false;
      if (data) {
        this.$message({
          message: "解析成功",
          type: "success",
        });
        this.setList(data);
      } else {
        this.$message.error("解析失败");
      }
    },
    handlePreview(file) {
      this.fileName = file.name;
    },
    save() {
      if (!this.activityName) {
        return this.$message({
          message: "请输入活动名称",
          type: "warning",
        });
      }
      if (!this.list.length) {
        return this.$message({
          message: "请选择试题",
          type: "warning",
        });
      }
      const params = {
        activityName: this.activityName,
        activityType: 5,
        remark: this.remark,
        activityContent: this.list,
      };
      this.$emit("submit", params);
      this.show = false;
    },
    setList(subs) {
      subs.forEach((item) => {
        item.total = 0;
        item.optionContent = item.optionContent || "";
      });
      this.list.push(...subs);
    },
    select(type) {
      this.$emit("selectSub", type);
    },
    check(item, res) {
      if (
        item.questionType == 1 ||
        item.questionType == 3 ||
        item.questionType == 4
      ) {
        item.options.forEach((data) => {
          data.rightAnswer = data.id == res.id ? 1 : 0;
        });
      } else if (item.questionType == 2) {
        res.rightAnswer = res.rightAnswer == 1 ? 0 : 1;
      }
    },
    check2(item, value) {
      item.rightAnswers = value;
    },
    delect(index) {
      this.list.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.up-row {
  display: flex;
}
/deep/.el-scrollbar {
  .el-scrollbar__wrap {
    padding-right: 20px;
  }
}
.avatar-uploader {
  flex: 1;
  /deep/.el-upload {
    width: 100%;
  }
}
.subject-list {
  margin: 10px 0;

  .mt15 {
    margin-top: 15px;
  }
  .number {
    color: #febd2b;
  }
  .mould-text,
  .mould-input {
    padding-left: 10px;
    padding-right: 10px;
  }
  .title {
    display: flex;
    margin-top: 15px;
    .total {
      width: 80px;
      line-height: 38px;
      border: 1px solid #e0e0e0;
      text-align: center;
      margin: 0 10px;
      display: block;
      height: 40px;
    }
    .del {
      color: #2196f3;
      line-height: 36px;
      padding: 0 3px;
      cursor: pointer;
    }
  }

  .subject-item {
    display: flex;
    align-items: center;
    margin-top: 15px;
    cursor: pointer;
    .check {
      width: 80px;
      text-align: center;

      > span {
        font-size: 25px;
        color: #85ba44;
      }
    }
  }

  .input-sub {
    flex: 1;
    overflow: hidden;
    padding: 10px;
    display: flex;
    align-items: center;
    min-height: 40px;
    border: 1px solid #e0e0e0;
  }
}
.resolve-box {
  display: flex;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 60px;

  .btn2 {
    color: #2196f3;
    line-height: 36px;
    padding: 0 3px;
    margin: 0 3px;
    cursor: pointer;
  }

  .upload {
    margin-left: 15px;
    line-height: 36px;
    padding: 0 12px;
    color: #fff;
    height: 36px;
    background: #2196f3;
    border-radius: 2px;
    cursor: pointer;
  }
  .down {
    padding: 0 10px;
    line-height: 36px;
    cursor: pointer;
    color: #757575;
  }
  .line {
    margin: 0 10px;
    background-color: #eee;
    width: 1px;
    height: 36px;
  }

  .up {
    width: 85px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    color: #fff;
    position: relative;

    background: #febd2b;
    border-radius: 2px 0px 0px 2px;
  }
  .filenm {
    flex: 1;
    height: 36px;
    box-sizing: border-box;
    line-height: 34px;
    border: 1px solid #e0e0e0;
    padding: 0 20px;
    cursor: pointer;

    input[type="file"] {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      opacity: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>