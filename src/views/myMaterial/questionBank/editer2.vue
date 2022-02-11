<template>
  <div class="hello">
    <quill-editor
      class="editor"
      v-model="content"
      ref="myQuillEditor0"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>

    <el-upload
      class="avatar-uploader1"
      :action="serverUrl"
      name="file"
      :headers="header"
      :show-file-list="false"
      list-type="picture"
      :multiple="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
    >
    </el-upload>
  </div>
</template>

<script>
import { getAuthorization } from "@/axios/encryption";
import { baseUrl } from "@/configs";
const toolbarOptions = [
  [
    "bold",
    "italic",
    "underline",
    "strike",
    // { header: 1 },
    // { header: 2 },
    { script: "sub" },
    { script: "super" },
    { list: "ordered" },
    { list: "bullet" },
    { indent: "-1" },
    { indent: "+1" },
    { color: [] },
    { background: [] },
    { align: [] },
    "image",
    "formula",
  ], // 加粗 斜体 下划线 删除线
];
export default {
  props: {
    /*编辑器的内容*/
    value: {
      type: [String, Number],
    },
    /*图片大小*/
    maxSize: {
      type: Number,
      default: 4000, //kb
    },
  },

  watch: {
    value: function (val) {
      this.content = val;
    },
  },
  data() {
    return {
      content: "",
      quillUpdateImg: true,
      editorOption: {
        theme: "snow", // or 'bubble'
        placeholder: "请输入题干",
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader1 input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
              formula: function (val) {
                this.$confirm(
                  '<iframe id="frame" name="aframe" width="800px" height="550px" src="/kf-editor-master/index.html" frameborder="0"></iframe>',
                  "公式编辑",
                  {
                    dangerouslyUseHTMLString: true,
                    center: true,
                    showConfirmButton: false,
                    closeOnClickModal: false,
                    showClose: true,
                    showCancelButton: false,
                    callback: () => {
                      return;
                    },
                  }
                ).catch();
              }.bind(this),
            },
          },
        },
      },
      serverUrl: baseUrl + "/admin/sys-file/otoUpload", // 这里写你要上传的图片服务器地址
      header: getAuthorization(), // 有的图片服务器要求请求头需要有token
    };
  },
  mounted() {
    this.content = this.value;
    window.addEventListener(
      "message",
      function (val) {
        //此处执行事件
        this.upLoadBase64(val.data);
      }.bind(this)
    );
    console.log("editer2", this.content);
  },
  methods: {
    upLoadBase64(val) {
      if (
        !this.$refs["myQuillEditor0"] ||
        !this.$refs.myQuillEditor0.quill.getSelection()
      ) {
        return;
      }
      // this.common
      //   .HTTP("/v1/common/oss/uploadBase64", "POST", {
      //     str: val,
      //   })
      //   .then((res) => {
      //     document.querySelector(".el-message-box__close").click();
      //     this.uploadSuccess(res.data, null);
      //   })
      //   .finally((res) => {});
      // console.log('upLoadBase64')
      // this.getBase64(val).then( res => {
      //   console.log('res',res)
      // }).catch(res => {})
      this.getBase64(val);
    },
    async getBase64(val) {
      try {
        // console.log(val)
        const a = {
          str: val,
        };
        // const { data } = await fxUploadBase64(a);
        // document.querySelector(".el-message-box__close").click();
        // console.log(data);
        // this.uploadSuccess(data, null);
      } catch (e) {
        console.log(e);
      }
    },
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
      this.$emit("input", this.content);
    },
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      // if (!this.$refs["myQuillEditor" + this.num]) {
      //   return;
      // }
      console.log(res, file)
      try {
        let quill = this.$refs.myQuillEditor0.quill;
        // 如果上传成功
        //  if (!quill || !quill.getSelection()) {
        //     return;
        //   }
        // 获取光标所在位置
        let length = quill.getSelection(true).index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.data.fullUrl);
        document.querySelectorAll(".editor2 img").forEach(function (x) {
          x.setAttribute("height", 10);
        });
        // 调整光标到最后
        quill.setSelection(length + 1);

        // loading动画消失
        this.quillUpdateImg = false;
      } catch (e) {
        console.log(e);
      }
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    },
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
  },
};
</script>

<style scoped>
.editor {
  line-height: normal !important;
  height: 120px;
}
.el-message-box {
  width: auto !important;
  padding: 0;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
