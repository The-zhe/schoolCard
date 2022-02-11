<template>
  <div class="editer3" style="width: 100%">
    <quill-editor
      :class="indexClass + ' editor2'"
      v-model="content"
      :ref="'myQuillEditor' + num"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>
    <el-upload
      style="height: 0px"
      :class="['avatar-uploadera' + num]"
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
const toolbarOptions = [
  "bold",
  "italic",
  "underline",
  "strike",
  { script: "sub" },
  { script: "super" },
  "image",
  "formula",
];

export default {
  props: {
    /*编辑器的内容*/
    value: {
      type: [Number, String],
    },
    num: {
      type: [Number, String],
    },
    proIndex: {
      type: String,
    },
    /*图片大小*/
    maxSize: {
      type: Number,
      default: 4000, //kb
    },
  },
  watch: {
    value: function (val) {
      val ? this.content = val : ''
    },
  },
  data() {
    return {
      content: this.value,
      indexClass: this.proIndex,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        theme: "snow", // or 'bubble'
        placeholder: "",
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document
                    .querySelector(".avatar-uploadera" + this.num + " input")
                    .click();
                } else {
                  this.quill.format("image", false);
                }
              }.bind(this),
              formula: function () {
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
     serverUrl:"http://www.msmk.jsyxl360.com/admin/sys-file/otoUpload", // 这里写你要上传的图片服务器地址
      header: getAuthorization(), // 有的图片服务器要求请求头需要有token
    };
  },
  mounted() {
    // th = this;
    window.addEventListener(
      "message",
      function (val) {
        //此处执行事件
        this.upLoadBase64(val.data);
      }.bind(this)
    );
    // window.getFun = function(val){
    //     this.upLoadBase64(val);
    // }.bind(this)
  },
  methods: {
    upLoadBase64(val) {
      //  if (!this.$refs["myQuillEditor" + this.num] || !this.$refs["myQuillEditor" + this.num].quill.getSelection()) {
      //   return;
      // }
      // this.common
      //   .HTTP("/v1/common/oss/uploadBase64", "POST", {
      //     str: val,
      //   })
      //   .then((res) => {
      //     document.querySelector(".el-message-box__close").click();
      //     this.uploadSuccess(res.data, null);
      //     // this.toUpdateInput(res.data)
      //   })
      //   .finally((res) => {});
      this.getBase64(val);
    },
    // toUpdateInput(val){

    // },
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
      if (this.proIndex) {
        document
          .getElementsByClassName(this.proIndex)[0]
          .getElementsByClassName("ql-toolbar")[0].style.display = "none";
      } else {
        document.getElementsByClassName("ql-toolbar")[0].style.display = "none";
      }
    },
    onEditorFocus() {
      //获得焦点事件
      console.log("proindex", this.proIndex);
      console.log("e1", document.getElementsByClassName("e1editor2"));
      if (this.proIndex) {
        document
          .getElementsByClassName(this.proIndex)[0]
          .getElementsByClassName("ql-toolbar")[0].style.display = "block";
      } else {
        document.getElementsByClassName("ql-toolbar")[0].style.display =
          "block";
      }
    },
    onEditorChange() {
      //内容改变事件
      document
        .getElementsByClassName(this.proIndex)[0]
        .getElementsByClassName("ql-toolbar")[0].style.display = "block";
      this.$emit("input", this.content);
    },

    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      // if (!this.$refs["myQuillEditor" + this.num]) {
      //   return;
      // }
      try {
        // let quill = this.$refs.myQuillEditor0.quill;
        let quill = this.$refs["myQuillEditor" + this.num].quill;
        // 如果上传成功
        //  if (!quill || !quill.getSelection()) {
        //     return;
        //   }
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res);
        document.querySelectorAll(".editor2 img").forEach(function (x) {
          x.setAttribute("height", 30);
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
  },
};
</script>

<style lang='less' >
.editor2 {
  position: relative;
  .ql-toolbar {
    display: none;
    position: absolute;
    top: -31px;
    border-bottom: 0 !important;
    height: 31px;
    span {
      margin-top: -5px;
    }
  }
}
.editor2 {
  .ql-toolbar.ql-snow + .ql-container.ql-snow {
    border-top: 1px solid #ccc;
  }
}
.editor2 {
  .quill-editor {
    margin-top: 50px;
    position: relative;
  }
}
.ql-container {
  height: 100%;
}
</style>
