<template>
  <div class="cp-header">
    <div class="select-wrap">
      <div>年级</div>
      <el-select
        clearable
        v-model="grade"
        placeholder="请选择"
        @change="getCourses"
      >
        <el-option
          v-for="item in gradeData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="select-wrap">
      <div>科目</div>
      <el-select
        clearable
        v-model="course"
        placeholder="请选择"
        @change="getTeachbook"
        @focus="infoGrade"
      >
        <el-option
          v-for="item in courseData"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="select-wrap">
      <div>教材</div>
      <el-select
        clearable
        v-model="bookId"
        placeholder="请选择"
        @change="getTeachbookchapter"
        @focus="infoMaterial"
      >
        <el-option
          v-for="item in books"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="select-wrap">
      <div style="margin-right: 10px">章节</div>
      <el-cascader
        v-model="chapterId"
        clearable
        placeholder="请选择"
        :props="{
          multiple: false,
          checkStrictly: true,
          label: 'name',
          value: 'id',
        }"
        :options="chapter"
        @focus="infoChapter"
        @change="changeParams"
      >
      </el-cascader>
    </div>
  </div>
</template>
<script>
import {
  getGrades,
  getCourses,
  getTeachbook,
  getChapterTree,
} from "@/api/teach";

export default {
  data() {
    return {
      grade: "",
      gradeData: [],
      course: "",
      courseData: [],
      bookId: "",
      books: [],
      chapterId: [],
      chapter: [],
    };
  },
  props: {
    gradeValue: { type: [Number, String] },
    courseValue: { type: [Number, String] },
    bookIdValue: { type: [Number, String] },
    chapterIdValue: { type: [Array], default: () => [] },
  },
  mounted() {
    this.getGrades();
    if (this.gradeValue) {
      this.grade = this.gradeValue;
      this.getCourses("init");
    }
    if (this.courseValue) {
      this.course = this.courseValue;
      this.getTeachbook("init");
    }
    if (this.bookIdValue) {
      this.bookId = this.bookIdValue;
      this.getTeachbookchapter("init");
    }
    this.chapterId = this.chapterIdValue || [];
  },
  methods: {
    async getGrades() {
      const { data } = await getGrades();
      const gradeData = [];
      Object.keys(data).forEach((label) => {
        gradeData.push({ label, value: data[label] });
      });
      this.gradeData = gradeData;
    },
    //获取科目
    async getCourses(e) {
      if (e != "init") {
        this.course = "";
        this.courseData = [];
        this.bookId = "";
        this.books = [];
        this.chapterId = [];
        this.$nextTick(() => {
          this.chapter = [];
        });
      }

      if (this.grade) {
        const { data } = await getCourses(this.grade);
        const courseData = [];
        Object.keys(data).forEach((label) => {
          courseData.push({ label, value: data[label] });
        });
        this.courseData = courseData;
      }
      this.changeParams(e);
    },
    async getTeachbook(e) {
      if (e != "init") {
        this.bookId = "";
        this.books = [];
        this.chapterId = [];
        this.$nextTick(() => {
          this.chapter = [];
        });
      }

      if (this.course && this.grade) {
        const { data } = await getTeachbook({
          course: this.course,
          grade: this.grade,
        });
        data.forEach((item) => {
          item.label = item.name;
          item.value = item.id;
        });
        this.books = data;
      }

      this.changeParams(e);
    },
    async getTeachbookchapter(e) {
      if (e != "init") {
        this.chapterId = [];
        this.$nextTick(() => {
          this.chapter = [];
        });
      }

      if (this.bookId) {
        const { data } = await getChapterTree(this.bookId);
        data.data = this.reduce(data.data);
        this.chapter = data.data;
      }
      this.changeParams(e);
    },
    reduce(array) {
      array.forEach((item) => {
        if (item.children.length == 0) {
          delete item.children;
        } else {
          this.reduce(item.children);
        }
      });
      return array;
    },
    changeParams(e) {
      if (e != "init") {
        this.$emit("change", {
          grade: this.grade,
          course: this.course,
          bookId: this.bookId,
          chapter: this.chapterId[this.chapterId.length - 1] || "",
          chapterAll: this.chapterId,
        });
      }
    },
    infoGrade() {
      if (this.grade == "") {
        this.$message({
          message: "请先选择年级",
          type: "warning",
        });
      }
    },
    infoMaterial() {
      if (this.grade == "" || this.course == "") {
        this.$message({
          message: "请先选择年级和科目",
          type: "warning",
        });
      }
    },
    infoChapter() {
      if (this.course == "" || this.bookId == "" || this.grade == "") {
        this.$message({
          message: "请先选择年级，科目，教材",
          type: "warning",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.cp-header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  align-items: center;
  padding: 0 20px;
  position: relative;
  margin-bottom: 20px;

  .cp-save {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }

  .select-wrap {
    display: flex;
    align-items: center;
    margin-left: 10px;
    &:first-child {
      margin-left: 0;
    }

    .el-select {
      width: 145px;
      margin-left: 10px;
    }
  }
}
</style>