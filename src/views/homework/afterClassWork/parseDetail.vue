<template>
  <div>
    <el-dialog title="解题思路" :show-close="true" :visible.sync="visible">
      <div class="tip">
        <div>解题思路会在学生点击我不会按钮之后自动回复给学生</div>
        <div>web端暂不支持语音上传，请用文字或图片形式上传解题思路</div>
      </div>
      <div class="text">
        <span style="margin-right: 10px"
          >P{{ row.pageNum }} 第{{ row.num }}题</span
        ><span>{{ row.remake ? row.remake : "暂无备注" }}</span>
      </div>
      <div>文字</div>
      <el-input
        type="textarea"
        placeholder="请输入解题思路的文字内容"
        v-model="textarea"
        maxlength="144"
        show-word-limit
        style="margin-bottom: 15px"
      ></el-input>
      <div>上传图片{{ fileList.length }}/4</div>
      <el-upload
        :action="serverUrl"
        :headers="header"
        ref="upload"
        list-type="picture-card"
        :auto-upload="false"
        :limit="4"
        :file-list="fileList"
        :on-change="onchange"
        :on-success="success"
      >
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.url" />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { cardParse, editAnalysis } from "@/api/schoolaffair";
import { baseUrl, uploadUrl } from "@/configs";
import store from "@/store";
import fileType from "@/views/myMaterial/materialManage/isFiles";
export default {
  data() {
    return {
      id: null,
      visible: false,
      fileList: [],
      textarea: "",
      serverUrl: baseUrl + uploadUrl, //默认素材上传路径
      header: {
        Authorization: `Bearer ${store.state.user.access_token}`,
      },
      dialogVisible: false,
      dialogImageUrl: "",
      audio: {},
    };
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file) {
      this.$refs.upload.uploadFiles.splice(
        this.$refs.upload.uploadFiles.indexOf(file),
        1
      );
      this.fileList = this.$refs.upload.uploadFiles;
      if (this.fileList.length < 4) {
        let uploadDom = document.getElementsByClassName(
          "el-upload el-upload--picture-card"
        );
        uploadDom[0].style.display = "block";
      }
    },
    cancel() {
      this.textarea = "";
      this.audio = {};
      this.fileList = [];
      this.visible = false;
    },
    submit() {
      if (!this.textarea && this.fileList.length == 0) {
        return this.$message({
          message: "请输入文字或者上传图片",
          type: "warning",
        });
      }
      let params = { id: this.row.id, analysisList: [] };
      let obj = {
        createBy: this.$store.state.user.teachInfo.userId,
        homeworkId: this.row.homeworkId,
        templateId: this.row.homeworkTemplateId,
        templateQuestionId: this.row.id,
      };
      if (this.textarea) {
        params.analysisList.push({ ...obj, type: 1, cont: this.textarea });
      }
      if (this.fileList.length > 0) {
        let cont = this.fileList
          .map((item) => this.replaceImgPrefix(item.url))
          .join(",");
        params.analysisList.push({ ...obj, type: 2, cont });
      }
      if (this.audio.cont) {
        params.push(this.audio);
      }
      editAnalysis(params).then((res) => {
        this.cancel();
        this.$message.success("编辑成功");
      });
    },
    init(id) {
      this.visible = true;
      this.id = id;

      this.$nextTick(() => {
        this.getParse(id);
      });
    },
    async getParse(id) {
      try {
        const { data } = await cardParse(id);
        data.forEach((item) => {
          if (item.type == 1) {
            this.textarea = item.cont;
          } else if (item.type == 2 && item.cont) {
            this.fileList = item.cont
              .split(",")
              .filter((otem) => otem)
              .map((otem) => {
                return {
                  url: this.imgPrefix + otem,
                };
              });
          } else if (item.type == 3) {
            this.audio = item;
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    success({ data }) {
      let list = this.$refs.upload.uploadFiles;
      list[list.length - 1].url = this.imgPrefix + data.url;
      this.fileList = JSON.parse(JSON.stringify(list));
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
        if (this.fileList.length == 4) {
          let uploadDom = document.getElementsByClassName(
            "el-upload el-upload--picture-card"
          );
          uploadDom[0].style.display = "none";
        }
      }
      this.$refs.upload.submit();
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