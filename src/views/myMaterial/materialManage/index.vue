<template>
  <div class="materialManage">
    <tool-bar title="素材管理"></tool-bar>
    <div class="materialManage_main">
      <div class="mat_directory">
        <div class="list_name">素材管理</div>
        <div class="dir_list">
          <div
            class="list"
            v-for="(item, index) in directory"
            :key="index"
            :class="{ mat: changeNum == index }"
            @click="change(index, item)"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="mat_detail">
        <SearchHeader @change="changeParams"></SearchHeader>
        <div class="mat_upload">
          <div style="background: #febd2b; color: white; padding: 10px">
            选择文件
          </div>
          <el-upload
              v-loading="loading"
              :element-loading-text="loadingText"
              class="avatar-uploader"
              ref="upload"
              :action="serverUrl"
              :headers="header"
              :on-change="handlePreview"
              :on-success="success"
              :on-error="error"
              :auto-upload="false"
              :file-list="fileList"
              :show-file-list="false"
              style="margin-right: 100px"
          >
            <input
              class="mat_input"
              type="text"
              :value="upload"
              readonly
              style="height: 39px"
            />
          </el-upload>
          <el-button type="primary" size="medium" @click="submitUpload()"
            >上传素材</el-button
          >
        </div>

        <div class="table">
          <el-table ref="filterTable" :data="tableData" style="width: 100%">
            <el-table-column prop="fodderName" label="文件名称" width="260">
            </el-table-column>
            <el-table-column prop="type" label="所属" width="160">
              <template slot-scope="scope">
                <el-tag
                  disable-transitions
                  type="plain"
                  v-if="scope.row.type == 1"
                  >教师</el-tag
                >
                <el-tag
                  disable-transitions
                  type="primary"
                  v-if="scope.row.type == 2"
                  >平台</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="fodderType"
              label="类型"
              width="100"
              :filters="[
                { text: 'word', value: 1 },
                { text: 'excel', value: 2 },
                { text: 'ppt', value: 3 },
                { text: '视频', value: 4 },
                { text: '音频', value: 5 },
                { text: '图片', value: 6 },
                { text: '活动', value: 7 },
                { text: '题库', value: 8 },
              ]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                <el-tag
                  disable-transitions
                  type="primary"
                  v-if="scope.row.fodderType == 1"
                  >word</el-tag
                >
                <el-tag
                  disable-transitions
                  type="info"
                  v-else-if="scope.row.fodderType == 2"
                  >excel</el-tag
                >
                <el-tag
                  disable-transitions
                  type="success"
                  v-else-if="scope.row.fodderType == 3"
                  >ppt</el-tag
                >
                <el-tag
                  disable-transitions
                  type="warning"
                  v-else-if="scope.row.fodderType == 4"
                  >视频</el-tag
                >
                <el-tag
                  disable-transitions
                  type="primary"
                  effect="plain"
                  v-else-if="scope.row.fodderType == 5"
                  >音频</el-tag
                >
                <el-tag
                  disable-transitions
                  type="info"
                  effect="plain"
                  v-else-if="scope.row.fodderType == 6"
                  >图片</el-tag
                >
                <el-tag
                  disable-transitions
                  type="success"
                  effect="plain"
                  v-else-if="scope.row.fodderType == 7"
                  >活动</el-tag
                >
                <el-tag
                  disable-transitions
                  type="warning"
                  effect="plain"
                  v-else-if="scope.row.fodderType == 8"
                  >题库</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="createdTime"
              label="上传时间"
              sortable
              width="220"
              column-key="date"
            >
              <template slot-scope="scope">
                {{ scope.row.createdTime | formatDate }}
              </template>
            </el-table-column>
            <el-table-column
              prop="fodderSize"
              label="文件大小"
              width="120px"
            ></el-table-column>
            <el-table-column prop="operation">
              <template slot-scope="scope">
                <el-button
                  title="预览"
                  type="text"
                  style="color: #2196f3"
                  @click="toPreview(scope.row, scope.$index)"
                  >预览</el-button
                >
                <el-button
                  title="删除"
                  type="text"
                  style="color: #febd2b"
                  @click="delHandle(scope.row, scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="pagination">
          <el-pagination
            :background="true"
            @current-change="handleCurrentChange"
            :current-page="dataFrom.current"
            :page-size="7"
            layout="prev, pager, next ,jumper"
            :total="total"
          >
          </el-pagination>
          <el-button>确定</el-button>
        </div>
      </div>
    </div>
    <!-- 目录 -->
    <Preview v-if="preView" ref="preview"></Preview>
  </div>
</template>
<script>
import ToolBar from "../../../components/navigation/toolBar.vue";
import SearchHeader from "../../../components/teachActivity/dataHeader.vue";
import Preview from "./preview.vue";
import {
  getTeachFodderList,
  removeTeachFodderList,
  addTeachFodderList,
  videoUploadStatus,
  listSmallChapter,
} from "@/api/empcustomer";
import fileType from "./isFiles";
import { baseUrl, uploadUrl } from "@/configs";
import { mapState } from "vuex";
import store from "@/store";
export default {
  inject: ["reload"],
  name: "materialManage",
  components: { ToolBar, SearchHeader, Preview },
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  data() {
    return {
      loading: false,
      loadingText: "",
      serverUrl: baseUrl + uploadUrl, //默认素材上传路径
      header: {
        Authorization: `Bearer ${store.state.user.access_token}`,
      },
      isSuccess: false,
      preView: false, // 预览开关
      subjectsNum: null,
      gradeNum: null,
      semesterNum: null,
      changeNum: null,
      search: "",
      currentPage: 1,
      upload: "",
      total: null,
      loadDuration:0,
      fileList: [],
      imgUrl: "",
      clock: "", // 定时器
      option:"",
      fodderFrom: {
        course: "1", //科目
        createdBy: "",
        fodderName: "",
        fodderSize: "",
        fodderType: "",
        fodderUrl: "",
        grade: "1",
      },
      directory: [],
      grade: "",
      semester: "",
      subjects: "",
      tableData: [],
      dataFrom: {
        fodderName: "",
        fodderSize: "",
        grade: "",
        course: "",
        chapter: "",
        createdBy: "",
        current: 1,
        size: "7",
      },
    };
  },
  methods: {
    changeParams(params) {
      this.dataFrom = { ...this.dataFrom, ...params };
      this.getTeachFodder(this.dataFrom);
    },
    OnOfflineStatus() {
      this.option = this.$message({
        showClose: true,
        message: '正在上传，请稍等...',
        type: 'warning',
        duration:0,
      });
    },
    OnOnlineStatus(){
      this.option ? this.option.close():'';
    },
    toPreview(item, index) {
      // 预览
      this.preView = true;
      console.log("预览", this.preView);
      this.$nextTick(() => {
        this.$refs.preview.init(item, index);
      });
    },
    getUploadStatus(id) {
      //获取视频上传状态
      console.log("id", id);
      var _that = this;
      this.clock = setTimeout(async () => {
        try {
          const { data } = await videoUploadStatus({ upload_id: id.upload_id });
          if (data.upload_stutas) {
            _that.fodderFrom.fodderType = "4";
            _that.fodderFrom.fodderUrl = data.video_url;
            _that.addTeachFodder(_that.fodderFrom);
          } else {
            this.getUploadStatus(id);
          }
          console.log("getUploadStatus", data);
        } catch (e) {
          console.log(e);
        }
      }, 3000);
    },
    success({ data }) {
      // this.loadDuration = 100
      this.imgUrl = data;
      console.log("success", data);
      this.fodderFrom.fodderUrl = data.url;
      this.fodderFrom.fodderSize = data.fileSize;
      this.fodderFrom.createdBy = this.$store.state.user.data.id;
      console.log("fodderFrom", this.fodderFrom);
      if(data.previewUrl){
        this.fodderFrom.fodderPreviewUrl = data.previewUrl
      }
      this.addTeachFodder(this.fodderFrom);
      this.loading = false;
      this.loadingText = "";
      console.log("上传成功");
      this.isSuccess = true;
    },
    error(e) {
      console.log("error", e);
      this.loading = false;
    },
    handlePreview(file) {
      if (this.isSuccess) {
        this.upload = "";
        this.isSuccess = false;
        //this.OnOfflineStatus()
      } else {
        //文件上传
        try{
          if(fileType.matchType(file.name)){
            this.upload = file.name;
            this.fodderFrom.fodderName = file.name;
            this.fodderFrom.fodderType = fileType.matchType(this.upload).fooderType;
            if(this.fodderFrom.fodderType == undefined){
              this.upload = "";
              this.isSuccess = false;
              this.$refs.upload.clearFiles();
              return this.$message({
                message: "暂不支持该类型的文件",
                type: "warning",
              });
            }
            if(file.size > 1024 * 1024 *10){
              this.loadingText = "您上传的文件大于10M，上传较慢，请耐心等待...";
            }
            console.log("fodderType", this.fodderFrom.fodderType);
            console.log("文件上传");
          }
        }catch (e){
          this.$refs.upload.clearFiles()
          return
        }
      }
      this.isSuccess = false;
    },
    submitUpload(file) {
      if (!this.dataFrom.grade) {
        return this.$message({
          message: "请选择年级",
          type: "warning",
        });
      }
      if (!this.dataFrom.course) {
        return this.$message({
          message: "请选择科目",
          type: "warning",
        });
      }
      if (!this.dataFrom.bookId) {
        return this.$message({
          message: "请选择教材",
          type: "warning",
        });
      }
      if (!this.dataFrom.chapter) {
        return this.$message({
          message: "请选择章节",
          type: "warning",
        });
      }

      if (this.upload) {
        this.$refs.upload.submit();
        this.loading = true;
        // this.$message({
        //   type:'info',
        //   message:'正在上传',
        //   duration:this.loadDuration
        // })
      } else {
        this.$message({
          message: "请选择上传文件",
          type: "info",
        });
      }
      console.log("点击上传");
    },
    change(index, item) {
      if (this.changeNum == index) {
        this.changeNum = null;
        this.dataFrom.chapter = null;
        this.getTeachFodder(this.dataFrom);
      } else {
        this.changeNum = index;
        this.dataFrom.chapter = item;
        console.log("chapter", this.dataFrom.chapter);
        this.getTeachFodder(this.dataFrom);
      }
    },
    delHandle(mat, index) {
      this.removeTeachFodder(mat.uuid);
      this.tableData.splice(index, 1);
      setTimeout(() => {
        this.getTeachFodder(this.dataFrom);
      },200)
      if(this.tableData.length == 0 && this.dataFrom.current != 1){
        this.dataFrom.current = this.dataFrom.current - 1;
        this.getTeachFodder(this.dataFrom);
      }else if(this.tableData.length == 0 && this.dataFrom.current == 1){
        this.dataFrom.current = 1;
        this.getTeachFodder(this.dataFrom);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.dataFrom.current = val;
      this.getTeachFodder(this.dataFrom);
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.fodderType === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    async getTeachFodder(from) {
      try {
        const params = { ...from };
        params.grade = this.dataFrom.grade;
        params.course = this.dataFrom.course;
        params.bookId = this.dataFrom.bookId;
        params.chapter = this.dataFrom.chapter;
        params.createdBy = this.user.data.uid;
        const { data } = await getTeachFodderList(params);
        console.log("getTeachFodderList", data);
        this.tableData = data.records;
        this.directory = data.chapters;
        this.total = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async removeTeachFodder(id) {
      try {
        const { data } = await removeTeachFodderList([id]);
        // console.log("removeTeachFodderList", data);
      } catch (e) {
        console.log(e);
      }
    },
    async addTeachFodder(from) {
      try {
        const params = { ...from };
        params.grade = this.dataFrom.grade;
        params.course = this.dataFrom.course;
        params.bookId = this.dataFrom.bookId;
        params.chapterId = this.dataFrom.chapter;
        const { data } = await addTeachFodderList(params);
        // console.log("addTeachFodderList", data);
        this.OnOnlineStatus()
        this.$message({
          message: "上传成功",
          type: "success",
        });
        this.getTeachFodder(this.dataFrom);
      } catch (e) {
        this.$message({
          message: "上传失败",
          type: "warning",
        });
      }
    },
    async getSmallChapter() {
      //获取小章节
      try {
        const { data } = await listSmallChapter();
        console.log("small", data);
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    console.log("user", this.user);
    this.fodderFrom.createdBy = this.user.data.uid;
    this.getTeachFodder(this.dataFrom);
  },
  destroyed() {
    clearInterval(this.clock);
  },
};
</script>
<style lang="less" scoped>
.materialManage_main {
  margin: 84px auto;
  height: 755px;
  width: 1200px;
  display: flex;
  flex-direction: row;
  .mat_directory {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 174px;
    margin-right: 20px;
    .list_name {
      background-color: #85ba44;
      color: #ffffff;
      padding: 10px;
      text-align: center;
    }
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
  .mat_detail {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .mat_type {
      display: flex;
      flex-direction: column;
      background-color: white;
      padding: 10px 30px 10px 10px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      color: #666666;
      margin-bottom: 20px;
      .type {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        .green {
          color: #85ba44;
        }
        .pad {
          padding: 10px;
        }
      }
      // .type_grade{
      //     display: flex;
      //     flex-direction: row;
      // }
    }
    .mat_upload {
      // width: 100%;
      display: flex;
      flex-direction: row;
      padding: 10px 30px 10px 10px;
      background-color: #fafbfc;
      font-size: 14px;
      font-family: Microsoft YaHei;
      .mat_input {
        width: 326px;
        padding: 5px 10px;
        border: 1px solid #e0e0e0;
        opacity: 1;
        border-radius: 0px 2px 2px 0px;
        outline: none;
        cursor: pointer;
      }
    }
    .table {
      background-color: #ffffff;
      margin-top: 20px;
      height: 100%;
    }
    .pagination {
      position: absolute;
      bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      .el-pagination.is-background .el-pager li:not(.disabled).mative {
        background-color: #85ba44; // 进行修改背景和字体
        color: #ffffff;
      }
    }
  }
  .mat {
    background-color: #f5f5f5;
    border-left: 2px solid #2196f3;
  }
}
</style>