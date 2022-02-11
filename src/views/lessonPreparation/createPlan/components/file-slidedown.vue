<template>
  <div class="file-slidedown-wrap" :class="{ active: this.active }">
    <div class="slidedown-title" @click="change">
      <div class="slide-title-name ell">{{ item.stepName }}</div>
      <el-upload
        v-loading="loading"
        class="avatar-uploader"
        :action="serverUrl"
        :headers="header"
        :before-upload="beforeUpload"
        :on-success="success"
        :show-file-list="false"
        :on-error="error"
        ref="upload"
      >
        <i class="icon iconfont slide-icon1" @click="upload">&#xe611;</i>
      </el-upload>

      <i class="icon iconfont slide-icon1" @click.stop="delectStep">&#xe63c;</i>
      <div class="slide-icon-box">
        <i class="icon iconfont slide-icon2">&#xe64d;</i>
      </div>
    </div>
    <div class="slidedown-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import {
  isAssetTypeAnImage,
  isAssetTypeAnVideo,
  isAssetTypeAnAudio,
  isAssetTypeAnWord,
  isAssetTypeAnPdf,
  isAssetTypeAnExcel,
  isAssetTypeAnPpt,
} from "@/utils";
import { baseUrl, uploadUrl } from "@/configs";
import {
  word,
  ppt,
  excel,
  pdf,
  image,
  audio,
  video,
  mould,
} from "@/configs/file";
import store from "@/store";
let clock = null;
export default {
  data() {
    return {
      loading: false,
      serverUrl: baseUrl + uploadUrl,
      header: {
        Authorization: `Bearer ${store.state.user.access_token}`,
      },
      active: false,
    };
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    index: {
      type: [Number, String],
      default: -1,
    },
    grade: {
      type: [Number, String],
      default: "",
    },
    chapterId: {
      type: [Number, String],
      default: "",
    },
    bookId: {
      type: [Number, String],
      default: "",
    },
    course: {
      type: [Number, String],
      default: "",
    },
  },
  methods: {
    upload() {},
    beforeUpload() {
      if (!this.grade) {
        this.$message({
          message: "请选择年级",
          type: "warning",
        });
        return false;
      }
      if (!this.course) {
        this.$message({
          message: "请选择科目",
          type: "warning",
        });
        return false;
      }
      if (!this.bookId) {
        this.$message({
          message: "请选择教材",
          type: "warning",
        });
        return false;
      }
      if (!this.chapterId) {
        this.$message({
          message: "请选择章节",
          type: "warning",
        });
        return false;
      }
      this.loading = true;
    },
    success({ data }, { raw: { name, type } }) {
      console.log(isAssetTypeAnPdf(type));
      let url = data;
      let fodderType = "";
      if (isAssetTypeAnImage(type || name)) {
        fodderType = image;
      } else if (isAssetTypeAnVideo(type)) {
        fodderType = video;
      } else if (isAssetTypeAnAudio(type)) {
        fodderType = audio;
      } else if (isAssetTypeAnWord(name)) {
        fodderType = word;
      } else if (isAssetTypeAnPdf(type)) {
        fodderType = pdf;
      } else if (isAssetTypeAnExcel(name)) {
        fodderType = excel;
      } else if (isAssetTypeAnPpt(name)) {
        fodderType = ppt;
      }
      this.loading = false;
      console.log(fodderType);
      if (fodderType) {
        this.output(data, name, fodderType);
      }
      this.$refs.upload.clearFiles();
    },
    output(data, name, fodderType) {
      this.$emit("addTeachFodder", {
        index: this.index,
        data,
        name,
        fodderType,
      });
    },
    error(e) {
      console.log("error", e);
      this.loading = false;
    },
    delectStep() {
      this.$emit("delectStep", this.index);
    },
    change() {
      this.active = !this.active;
    },
  },
  destroyed() {
    clearTimeout(clock);
  },
};
</script>

<style lang="less" scoped>
.file-slidedown-wrap.active {
  .slidedown-title {
    border-color: #85ba44;
    color: #85ba44;

    .slide-icon-box {
      color: #fff;
      background: #85ba44;
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }
  .slidedown-content {
    max-height: 99999px;
  }
}
.file-slidedown-wrap {
  margin: 20px 15px 20px 0;
  padding-left: 30px;

  .slidedown-content {
    padding-left: 40px;
    border-left: 2px dashed #b6b6b6;
    margin: 15px 0;
    overflow: hidden;
    max-height: 0;
  }

  .slidedown-title {
    height: 38px;
    border: 1px solid #e7eaec;
    border-radius: 6px;
    display: flex;
    padding: 0 13px 0 40px;
    color: #2196f3;
    align-items: center;
    position: relative;
    transition: all 0.3s;
    cursor: pointer;

    .slide-icon1 {
      margin-left: 15px;
      padding: 3px;
      color: #676a6c;
    }
    .slide-icon-box {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      color: #2196f3;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      border: 1px solid #e7eaec;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      background: #fff;
      transition: all 0.3s;
    }

    .slide-title-name {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>