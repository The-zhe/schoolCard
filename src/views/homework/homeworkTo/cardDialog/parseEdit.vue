<template>
  <el-dialog title="解题思路" :show-close="true" :visible.sync="visible" center>
    <div class="tip">
      <div>解题思路会在学生点击我不会按钮之后自动回复给学生</div>
      <div>web端暂不支持语音上传，请用文字或图片形式上传解题思路</div>
    </div>
    <div class="text" v-if="detail">
      <div class="book">{{ book }}</div>
      <span style="margin-right: 10px"
        >P{{ detail.page }} 第{{ detail.num }}题</span
      ><span>{{ detail.remake ? detail.remake : "暂无备注" }}</span>
    </div>
    <div>文字</div>
    <el-input
      type="textarea"
      placeholder="请输入解题思路的文字内容"
      v-model="textarea"
      maxlength="144"
      show-word-limit
      style="margin-bottom: 15px"
    >
    </el-input>
    <div>上传图片{{ fileList.length }}/4</div>
    <el-upload
      :action="serverUrl"
      :headers="header"
      ref="upload"
      list-type="picture-card"
      :auto-upload="false"
      :limit="limitNum"
      :file-list="fileList"
      :on-change="onchange"
      :on-success="success"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="toAddCard">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { baseUrl, uploadUrl } from "@/configs";
import fileType from "@/views/myMaterial/materialManage/isFiles";
// import { mapState } from "vuex";
import store from "@/store";
import { cardParse } from "@/api/schoolaffair";
export default {
  data() {
    return {
      id: null,
      serverUrl: baseUrl + uploadUrl, //默认素材上传路径
      header: {
        Authorization: `Bearer ${store.state.user.access_token}`,
      },
      visible: false,
      textarea: "",
      fileList: [],
      limitNum: 4,
      lastUpImgFiles: "",
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      book: null,
      page: null,
      detail: null,
      num: 0,
      imgNum: 0,
      analysisList: [
        {
          type: "1", //文本-1，图片-2
          cont: "",
        },
        {
          type: "2", //文本-1，图片-2
          cont: "",
        },
      ],
    };
  },
  // computed: {
  //   ...mapState({
  //     user: (state) => state.user,
  //   }),
  // },
  methods: {
    init(book, page, item) {
      this.visible = true;
      this.textarea = "";
      this.$nextTick(() => {
        this.book = book;
        this.page = page;
        this.detail = item;
        console.log("this.detail", this.detail);
        if (this.detail.analysisList) {
          console.log("有analysisList");
          this.textarea = this.detail.analysisList[0].cont;
          if(this.detail.upImgFile){
            this.$refs.upload.uploadFiles = this.detail.upImgFile;
          }else{
            this.detail.upImgFile = []
          }
          this.lastUpImgFiles = this.detail.upImgFile;
          this.fileList = this.detail.upImgFile;
          
        } else {
          console.log("无analysisList");
          this.textarea = "";
          this.$refs.upload.uploadFiles = [];
          this.fileList = [];
          this.num = 0;
          if (this.detail.templateQuestionId) {
            console.log("有templateQuestionId");
            this.getParse(this.detail.templateQuestionId);
          }
        }
        if (this.fileList.length < 4) {
          let uploadDom = document.getElementsByClassName(
            "el-upload el-upload--picture-card"
          );
          uploadDom[0].style.display = "inline-block";
        } else {
          let uploadDom = document.getElementsByClassName(
            "el-upload el-upload--picture-card"
          );
          uploadDom[0].style.display = "none";
        }
      });
    },
    async getParse(id) {
      try {
        const { data } = await cardParse(id);
        console.log(data);
        if (data.length == 2) {
          this.textarea = data[0].cont;
          if (data[1].cont) {
            let imgList = data[1].cont
              .slice(0, data[1].cont.length - 1)
              .split(",");
            console.log(imgList);
            this.$refs.upload.uploadFiles = [];
            let imglength = imgList.length
            imgList.forEach((item) => {
              setTimeout(() => {
                this.$refs.upload.uploadFiles.push({
                  uid: `${new Date().getTime()}`,
                  url: this.imgPrefix + item,
                });
              }, 1);
            });
            setTimeout(() => {
              this.fileList = this.$refs.upload.uploadFiles;
              this.detail.upImgFile = this.$refs.upload.uploadFiles;
            },imglength + 1)
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    toAddCard() {
      this.analysisList[1].cont = "";
      this.analysisList[0].cont = this.textarea;
      if (this.detail.upImgFile) {
        this.detail.upImgFile.forEach((item, index) => {
          this.analysisList[1].cont =
            this.analysisList[1].cont +
            item.url.split("/")[3] +
            "/" +
            item.url.split("/")[4] +
            ",";
        });
      }
      this.detail.analysisList = JSON.parse(JSON.stringify(this.analysisList));
      console.log("this.detail.analysisList", this.detail.analysisList);
      this.$emit("analysis", this.detail);
      this.textarea = "";
      this.$refs.upload.uploadFiles = [];
      this.fileList = [];
      this.visible = false;
    },
    cancel() {
      if (this.detail.analysisList) {
        console.log("取消----有analysisList");
        this.textarea = this.detail.analysisList[0].cont;
        this.detail.upImgFile = this.lastUpImgFiles;
        this.$refs.upload.uploadFiles = this.detail.upImgFile;
        this.fileList = this.detail.upImgFile;
      } else {
        console.log("取消----无analysisList");
        this.textarea = "";
        this.$refs.upload.uploadFiles = [];
        this.fileList = [];
      }
      this.visible = false;
    },
    onchange(file) {
      if (fileType.matchType(file.name).fooderType !== "6") {
        this.$refs.upload.uploadFiles.pop();
        this.$message({
          message: "暂不支持除图片外的文件上传！",
          type: "info",
        });
      } else {
        this.fileList = this.$refs.upload.uploadFiles;
        console.log("fileList", this.fileList);
        if (this.fileList.length == 4) {
          let uploadDom = document.getElementsByClassName(
            "el-upload el-upload--picture-card"
          );
          uploadDom[0].style.display = "none";
        }
      }
      console.log(this.$refs.upload);
      this.$refs.upload.submit();
    },
    success({ data }) {
      console.log(data);
      this.detail.upImgFile = this.$refs.upload.uploadFiles;
      this.detail.upImgFile[this.fileList.length - 1].url =
        this.imgPrefix + data.fileName;
      this.detail.analysisList = this.analysisList;
      console.log("upImgFile", this.detail.upImgFile);
    },
    handleRemove(file) {
      this.$refs.upload.uploadFiles.splice(
        this.$refs.upload.uploadFiles.indexOf(file),
        1
      );
      this.detail.upImgFile = this.$refs.upload.uploadFiles;
      this.fileList = this.$refs.upload.uploadFiles;
      if (this.fileList.length < 4) {
        let uploadDom = document.getElementsByClassName(
          "el-upload el-upload--picture-card"
        );
        uploadDom[0].style.display = "block";
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="less" scoped>
.tip {
  color: #bbbbbb;
  margin-bottom: 15px;
}
.text {
  font-size: 16px;
  margin-bottom: 15px;
  .book {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }
}
</style>