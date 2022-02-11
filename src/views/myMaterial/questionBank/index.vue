<template>
  <div class="questionBank">
    <tool-bar title="题库管理"></tool-bar>
    <div class="questionBank_main">
      <!-- 活动列表 -->
      <div class="qb_detail">
        <div class="qb_title">
          <div style="font-weight:bold;font-size:24px">我的题库</div>
          <div class="btn">
            <el-button type="success" @click="addQuestion()">新增题目</el-button>
            <el-button type="success">导入题目</el-button>
          </div>
        </div>
        <div class="qb_search">
          <div class="search_top">
            <div style="width:70px">关键字</div>
            <el-input v-model="keyword" placeholder="请输入内容"></el-input>
            <div style="margin-left:5px;width:50px">学科</div>
            <el-select v-model="object" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search_bottom">
            <div style="margin-left:5px;width:50px">学段</div>
            <el-select v-model="gradeNum" placeholder="请选择学段">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div style="margin-left:10px;width:100px">难易程度</div>
            <el-select v-model="diff" placeholder="请选择难易程度">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div style="margin-left:10px;width:40px">题型</div>
            <el-select v-model="type" placeholder="请选择题型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button icon="el-icon-delete" style="margin-left:20px;background-color:#EFEEF1;color:#515053">清空</el-button>
            <el-button type="primary" icon="el-icon-search" style="width:190px">搜索</el-button>
          </div>
        </div>

        <div class="table">
          <el-table ref="filterTable" :data="tableData" style="width: 100%">
            <el-table-column label="序号" width="60" align="center">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="学科" width="60" align="center">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column
              prop="questionType"
              label="题型"
              width="100"
              align="center"
              :filters="[
                { text: '单选题', value: 1 },
                { text: '多选题', value: 2 },
                { text: '填空题', value: 3 },
                { text: '判断题', value: 4 },
                { text: '简答题', value: 5 },
                { text: '组合题', value: 6 },
              ]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  v-if="scope.row.questionType == 1"
                  disable-transitions
                  >单选题</el-tag
                >
                <el-tag
                  disable-transitions
                  type="info"
                  v-else-if="scope.row.questionType == 2"
                  >多选题</el-tag
                >
                <el-tag
                  disable-transitions
                  type="success"
                  v-else-if="scope.row.questionType == 3"
                  >填空题</el-tag
                >
                <el-tag
                  disable-transitions
                  type="warning"
                  v-else-if="scope.row.questionType == 4"
                  >判断题</el-tag
                >
                <el-tag
                  disable-transitions
                  type="primary"
                  effect="plain"
                  v-else-if="scope.row.questionType == 5"
                  >主观题</el-tag
                >
                <el-tag
                  disable-transitions
                  type="info"
                  effect="plain"
                  v-else-if="scope.row.questionType == 6"
                  >组合题</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="题目" width="460" align="center">
              <template slot-scope="scope">
                {{scope.row}}
              </template>
            </el-table-column>
            <el-table-column label="答案" align="center">
              <template slot-scope="scope">
                {{scope.row}}
              </template>
            </el-table-column>
            <el-table-column label="解析" align="center">
              <template slot-scope="scope">
                {{scope.row}}
              </template>
            </el-table-column>
            <el-table-column label="知识点" width="100" align="center">
              <template slot-scope="scope">
                {{
                  scope.row.kps.length == 0 || scope.row.kps[0] == null
                    ? ""
                    : scope.row.kps[0].name
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="difficulty"
              label="难度"
              width="100"
              align="center"
              :filters="[
                { text: '难', value: '1' },
                { text: '中等', value: '2' },
                { text: '简单', value: '3' },
              ]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  v-if="scope.row.difficulty == 1"
                  disable-transitions
                  >难</el-tag
                >
                <el-tag
                  disable-transitions
                  type="info"
                  v-else-if="scope.row.difficulty == 2"
                  >中等</el-tag
                >
                <el-tag
                  disable-transitions
                  type="success"
                  v-else-if="scope.row.difficulty == 3"
                  >简单</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="operation">
              <template slot-scope="scope">
                <el-button
                  title="编辑"
                  type="text"
                  style="color: #2196f3"
                  @click="editHandle(scope.row.id, scope.row.questionType)"
                  >编辑</el-button
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
            :current-page="currentPage"
            :page-size="10"
            layout="prev, pager, next,jumper"
            :total="total"
          >
          </el-pagination>
          <el-button>确定</el-button>
        </div>
      </div>
    </div>
    <question
      v-if="editVisible"
      ref="edit"
      :gradeName="gradeType"
      :semesterName="semesterType"
      :subjectName="subjectsType"
      :chapterName="chapter"
    ></question>
    <QuestionBank
      v-if="bankVisible"
      ref="bank"
    ></QuestionBank>
  </div>
</template>
<script>
import question from "./edit_question";
import ToolBar from "../../../components/navigation/toolBar.vue";
// import SearchHeader from "../../../components/teachActivity/dataHeader.vue";
import QuestionBank from "./add_question.vue";
import grid from "@/mixins/grid";
import { mapState } from "vuex";
import { questionPage, questionDelete } from "@/api/empcustomer";
export default {
  name: "questionBank",
  components: { question, ToolBar, QuestionBank },
  mixins: [grid],
  data() {
    return {
      keyword:null,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      object: '',
      diff:null,
      type:null,
      bankVisible:false,
      chapter: null, //章节
      subjectsNum: null,
      gradeNum: null,
      semesterNum: null,
      subjectsType: null,
      gradeType: null,
      semesterType: null,
      changeNum: null,
      search: "",
      currentPage: 1,
      upload: "",
      total: null,
      directory: [],
      grade: [],
      semester: [],
      subjects: [],
      allDate: null,
      tableData: null,
      dataFrom: {
        grade: "",
        schoolTerm: "",
        course: "",
        chapter: "",
        smallChapter: "",
        createdBy: "",
        current: "1",
        size: "10",
        searchContent: "",
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    changeParams(e) {
      this.grade = e.grade;
      this.subjects = e.course;
      this.chapter = e.chapter;
      this.dataFrom = { ...this.dataFrom, ...e };
      this.getQuestion(this.dataFrom);
    },
    delHandle(qb, index) {
      console.log("qb", qb.id);
      this.deleteQuestion(qb.id);
      this.tableData.splice(index, 1);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.dataFrom.current = val;
      this.getQuestion(this.dataFrom);
    },
    forqbter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      // let filterList = []
      //  filterList = this.allDate.fillter((row)=>{
      //   return row.questionType === value
      // })
      // this.tableData = filterList
      return row.questionType === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    addQuestion() {
        this.editHandle();
    },
    async getQuestion(from) {
      try {
        const { data } = await questionPage(from);
        console.log("getQuestion", data);
        this.tableData = data.records;
        this.total = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async deleteQuestion(id) {
      try {
        const { data } = await questionDelete(id);
        console.log("getQuestion", data);
      } catch (e) {
        console.log(e);
      }
    },
    // async getAllQuestion(){
    //   try{
    //     const {data} = await questionPage()
    //     console.log('getQuestion',data)
    //     this.allDate = data.list
    //     this.total = data.total
    //   }catch(e){
    //     console.log(e)
    //   }
    // },
  },
  mounted() {
  },
};
</script>
<style lang="less" scoped>
.questionBank_main {
  margin: 84px auto;
  // height: 1200px;
  width: 1200px;
  display: flex;
  flex-direction: row;
  .qb_directory {
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
  .qb_detail {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .qb_type {
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
    .qb_title{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 10px 30px 10px 10px;
      background-color: white;
      font-size: 14px;
      font-family: Microsoft YaHei;
      margin-bottom: 20px;
      .btn{
        display: flex;
        flex-direction: row;
      }
    }
    .qb_search {
      // width: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px 30px 10px 10px;
      background-color: #fafbfc;
      font-size: 14px;
      font-family: Microsoft YaHei;
      .qb_input {
        width: 326px;
        padding: 5px 10px;
        border: 1px solid #e0e0e0;
        opacity: 1;
        border-radius: 0px 2px 2px 0px;
        outline: none;
        margin-right: 20px;
      }
      .qb_text {
        display: flex;
        align-items: center;
        margin: 0px 10px;
        cursor: pointer;
      }
      .search_top{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
      }
      .search_bottom{
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
    .table {
      background-color: #ffffff;
      margin-top: 20px;
      height: 800px;
      .option {
        display: flex;
      }
    }
    .pagination {
      // position: absolute;
      // bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      background-color: white;
      padding: 20px 0px 20px 0px;
      .el-pagination.is-background .el-pager li:not(.disabled).qbive {
        background-color: #85ba44; // 进行修改背景和字体
        color: #ffffff;
      }
    }
  }
  .qb {
    background-color: #f5f5f5;
    border-left: 2px solid #2196f3;
  }
  .el-collapse /deep/ .el-collapse-item__header {
    line-height: 18px;
  }
}
</style>