<template>
  <el-dialog
    title="请选择课本"
    :show-close="true"
    :visible.sync="visible"
    center
  >
    <div class="heng">
      <div class="tip">版本:</div>
      <el-select v-model="version" placeholder="请选择" @change="togetVersion">
        <el-option
          v-for="item in versionList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="heng">
      <div class="tip">年级:</div>
      <el-select v-model="grade" placeholder="请选择" @change="togetGrade" @focus="infoVersion">
        <el-option
          v-for="item in gradeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="heng">
      <div class="tip">学期:</div>
      <el-select v-model="semester" placeholder="请选择" @change="togetSemester" @focus="infoGrade">
        <el-option
          v-for="item in semesterList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="heng">
      <div class="tip">书名:</div>
      <el-select v-model="book" placeholder="请选择" value-key="id" @change="togetBook" @focus="infoSemester">
        <el-option
          v-for="item in booksList"
          :key="item.id"
          :label="item.exerciseBookName?item.exerciseBookName:item.teachBookName"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="toAddCard">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getVersion,getSemester,getGrades,getBooks } from '@/api/homework';
export default {
  data() {
    return {
      visible: false,
      version: "", //版本
      grade:"", //年级
      semester:"", //学期
      book:'', //书名
      versionList:[],
      gradeList:[],
      semesterList:[],
      booksList:[],
      bookFrom:{
        teachBookType:null,
        gradeType:null,
        termType:null,
      }
    };
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.versionGet()
        this.gradeGet()
        this.semesterGet()
      })
    },
    toAddCard(){
        if(this.book){
            this.$emit('bookName',this.book)
            this.visible = false
        }else{
            this.$message({
                message: "请选择书名",
                type: "warning",
            });
        }
    },
    togetVersion(val){
        this.grade = ''
        this.semester = '',
        this.book = ''
        this.bookFrom.teachBookType = val
    },
    togetGrade(val){
        this.semester = '',
        this.book = ''
        this.bookFrom.gradeType = val
    },
    togetSemester(val){
        this.book = ''
        this.bookFrom.termType = val
    },
    togetBook(val){
      console.log('togetBook',val)
    },
    infoVersion() {
      if (this.version == "") {
        this.$message({
          message: "请先选择版本",
          type: "warning",
        });
      }
    },
    infoGrade() {
      if (this.version == "" || this.grade == "") {
        this.$message({
          message: "请先选择版本，年级",
          type: "warning",
        });
      }
    },
    infoSemester() {
      if (this.version == "" || this.semester == "" || this.grade == "") {
        this.$message({
          message: "请先选择版本，年级，学期",
          type: "warning",
        });
      }else{
        this.booksGet(this.bookFrom)
      }
    },
    async versionGet(){
      try{
        const { data } = await getVersion()
        console.log('Version',data)
        this.versionList = data
      }catch(e){
        console.log(e)
      }
    },
    async gradeGet(){
      try{
        const { data } = await getGrades()
        console.log('Version',data)
        this.gradeList = data
      }catch(e){
        console.log(e)
      }
    },
    async semesterGet(){
      try{
        const { data } = await getSemester()
        console.log('Version',data)
        this.semesterList = data
      }catch(e){
        console.log(e)
      }
    },
    async booksGet(from){
      try{
        const { data } = await getBooks(from)
        console.log('Version',data)
        this.booksList = data
      }catch(e){
        console.log(e)
      }
    },
  },
};
</script>
<style lang="less" scoped>
.heng {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    .tip{
        margin-right: 5px;
    }
}
</style>
  