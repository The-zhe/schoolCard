<template>
  <div>
    <div class="edit-label-title">
      课程名称
      <span class="require">*</span>
    </div>
    <input
      class="mould-input"
      type="text"
      v-model="teachPlanName"
      placeholder="请输入模板名称"
    />

    <div class="edit-label-title">课时介绍</div>

    <quill-editor
      v-model="remark"
      ref="myQuillEditor"
      :options="{}"
    ></quill-editor>
    <div class="edit-label-title">课时封面</div>
    <el-upload
      class="avatar-uploader"
      :action="serverUrl"
      :headers="header"
      :on-success="success"
      :show-file-list="false"
    >
      <img
        v-if="imgUrl"
        :src="imgUrl ? imgPrefix + imgUrl : ''"
        class="avatar"
      />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div class="el-upload__tip" slot="tip">
        建议单张图片不超过10M 课程封面图将按16:9显示，最佳分辨率：640*360
      </div>
    </el-upload>
  </div>
</template>

<script>
import store from "@/store";
import { baseUrl, uploadUrl } from "@/configs";
export default {
  data() {
    return {
      serverUrl: baseUrl + uploadUrl,
      header: {
        Authorization: `Bearer ${store.state.user.access_token}`,
      },
      teachPlanName: "",
      remark: "",
      imgUrl: "",
    };
  },
  methods: {
    validata() {
      return new Promise((resolve, reject) => {
        if (!this.teachPlanName) {
          return reject({ msg: `请输入 基本信息->课程名称` });
        }
        resolve({
          teachPlanName: this.teachPlanName,
          imgUrl: this.imgUrl,
          remark: this.remark,
        });
      });
    },
    setData(data) {
      for (let key in data) {
        this[key] = data[key];
      }
    },
    success({ data }) {
      this.imgUrl = data.url;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
/deep/.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 320px;
  height: 180px;
  line-height: 180px;
  text-align: center;
}
/deep/.avatar {
  width: 320px;
  height: 180px;
  display: block;
}

/deep/ .cp-upload .el-upload-dragger {
  width: 320px;
  height: 180px;
}
</style>