<template>
  <div class="examItem">
    <tool-bar title="试卷管理"></tool-bar>
    <div class="examItem_main">
      <!-- 目录 -->
      <div class="qb_directory">
        <div class="list_name">试卷管理</div>
        <div class="dir_list">
          <div
            v-for="(item, index) in directory"
            :key="index"
            :class="index == mlNum ? 'check_list' : 'list'"
            @click="checkMl(index)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>

      <!-- 试卷 -->
      <div class="exam_detail" v-if="[0, 1].includes(mlNum)">
        <div class="qb_type" v-if="mlNum == 0">
          <div class="type_grade type">
            <div style="padding: 10px">年级:</div>
            <div
              class="grade_list pad"
              v-for="(grade, index) in grade"
              :key="index"
              :class="{ green: gradeNum == index }"
              @click="changeGrade(index, grade)"
            >
              {{ grade.description }}
            </div>
          </div>
          <div class="type_subjects type">
            <div style="padding: 10px">科目:</div>
            <div
              class="subjects_list pad"
              v-for="(subjects, index) in subjects"
              :key="index"
              :class="{ green: subjectsNum == index }"
              @click="changeSubjects(index, subjects)"
            >
              {{ subjects.label }}
            </div>
          </div>
          <div class="type_semester type">
            <div style="padding: 10px">年份:</div>
            <div
              class="semester_list pad"
              v-for="(year, index) in year"
              :key="index"
              :class="{ green: semesterNum == index }"
              @click="changeSemester(index, year)"
            >
              {{ year.label }}
            </div>
          </div>
          <div class="type_area areatype">
            <div style="padding: 10px">地区:</div>
            <div
              class="area_list pad area"
              v-for="(area, index) in area"
              :key="index"
              :class="{ green: areaNum == index }"
              @click="changeArea(index, area)"
            >
              {{ area.label }}
            </div>
          </div>
          <div class="more_screen">
            <div style="padding: 10px">更多筛选:</div>
            <el-dropdown @command="type">
              <span class="el-dropdown-link">
                试卷类型<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in testTypeData"
                  :key="index"
                  :command="item.value"
                  >{{ item.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="version">
              <span class="el-dropdown-link">
                版本<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in bookData"
                  :key="index"
                  :command="item.value"
                  >{{ item.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown @command="answer">
              <span class="el-dropdown-link">
                答案<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in answerData"
                  :key="index"
                  :command="item.value"
                  >{{ item.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown @command="analysis">
              <span class="el-dropdown-link">
                解析<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in analysisData"
                  :key="index"
                  :command="item.value"
                  >{{ item.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="file">
              <span class="el-dropdown-link">
                文件类型<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in fileData"
                  :key="index"
                  :command="item.value"
                  >{{ item.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <div class="el-dropdown-link kps">
              <div @click="isKps = !isKps">
                知识点<i class="el-icon-arrow-down el-icon--right"></i>
              </div>
              <div class="kps_main" v-if="isKps">
                <el-select
                  v-model="kpsSub"
                  placeholder="科目"
                  @change="getKps()"
                  style="margin: 10px 0px"
                >
                  <el-option
                    v-for="item in subjects"
                    :key="item.value"
                    :label="item.description"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-cascader
                  :options="kpsList"
                  :props="kpsProps"
                  :show-all-levels="false"
                >
                  <template slot-scope="{ data }">
                    <span>{{ data.name }}</span>
                  </template>
                </el-cascader>
                <div class="btn">
                  <el-button type="primary" @click="isKps = false"
                    >确定</el-button
                  >
                  <el-button @click="isKps = false">取消</el-button>
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <div class="qb_upload">
          <div
            :class="index == changeNum ? 'qb_check' : 'qb_text'"
            v-for="(item, index) in searchList"
            :key="index"
            @click="check(index)"
          >
            {{ item.name }}
          </div>
          <input class="qb_input" type="text" v-model="searchValue" />
          <el-button type="primary" size="medium" @click="search()"
            >搜索</el-button
          >
          <el-button class="qb_btn" v-if="mlNum == 1" @click="toAdd()"
            >添加</el-button
          >
        </div>
        <!-- 列表  系统试卷 -->
        <div class="exam_list" v-if="mlNum == 0 && tableData.data">
          <div
            class="exam_item"
            v-for="(item, index) in tableData.data.records"
            :key="index"
          >
            <div class="examList_detail">
              <div class="img"><img :src="item.assetType" alt="" /></div>
              <div class="list">
                <div class="title">{{ item.testPaperName }}</div>
                <div class="tipList">
                  <div class="tip" v-if="item.year">{{ item.year }}</div>
                  <div class="tip" v-if="item.teachBookType">
                    {{ item.teachBookType }}
                  </div>
                  <div class="tip" v-if="item.testPaperType">
                    {{ item.testPaperType }}
                  </div>

                  <div class="tip" v-if="item.regionCode">
                    {{ item.regionCode }}
                  </div>
                  <div class="tip" v-if="item.grade">
                    {{ item.grade }}
                  </div>
                  <div class="tip" v-if="item.courseType">
                    {{ item.courseType }}
                  </div>
                </div>
              </div>
            </div>
            <div class="exam_btn">
              <a
                :href="imgPrefix + item.fileUrl"
                class="btn"
                :download="item.testPaperName"
                style="color: #58b0f6"
              >
                下载
              </a>
              <!-- <div class="btn" @click="systemTest(item)" style="color: #fec850">
                添加
              </div> -->
            </div>
          </div>
          <div class="nomsg" v-if="tableData.data.records.length == 0">
            暂无数据
          </div>
          <div class="pagination">
            <el-pagination
              :background="true"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="6"
              layout="prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
            <el-button>确定</el-button>
          </div>
        </div>
        <!-- 列表  我的试卷 -->
        <div class="exam_list" v-if="mlNum == 1 && myExamData.data">
          <div
            class="exam_item"
            v-for="(item, index) in myExamData.data.records"
            :key="index"
          >
            <div class="examList_detail">
              <div class="img"><img :src="imgUrl" alt="" /></div>
              <div class="list">
                <div class="title">{{ item.testPaperName }}</div>
                <div class="tipList">
                  <div class="tip" v-if="item.regionCode">
                    {{ item.regionCode }}
                  </div>
                  <div class="tip" v-if="item.year">{{ item.year }}</div>
                  <div class="tip" v-if="item.testPaperType">
                    {{ item.testPaperType }}
                  </div>
                </div>
              </div>
            </div>
            <div class="exam_btn">
              <div
                class="btn"
                @click="download(item.id, item.testPaperName)"
                style="color: #58b0f6"
              >
                下载
              </div>
              <div class="btn" @click="testDetail(item)" style="color: #fec850">
                编辑
              </div>
              <div
                class="btn"
                @click="deleteTest(item, index)"
                style="color: #ec5656"
              >
                删除
              </div>
            </div>
          </div>
          <div class="nomsg" v-if="myExamData.data.records.length == 0">
            暂无数据
          </div>
          <div class="pagination">
            <el-pagination
              :background="true"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="9"
              layout="prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
            <el-button>确定</el-button>
          </div>
        </div>
        <EditExam ref="addExam" v-if="addVisible"></EditExam>
      </div>

      <!-- 在线批改 -->
      <div class="exam_detail" v-if="mlNum == 3">
        <div class="qb_upload">
          <el-select
            v-model="classRoom"
            clearable
            placeholder="请选择"
            @change="getGrade"
            style="margin-right: 50px"
          >
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="
                item.alias ? item.alias : `${item.grade}年级${item.classNo}班`
              "
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="date"
            type="date"
            @change="getDate"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
        <!-- 列表  在线批改 -->
        <div class="correct">
          <el-table :data="correctData" stripe>
            <el-table-column label="班级" align="center">
              <template slot-scope="scope">
                {{ scope.row.alias ? scope.row.alias : scope.row.className }}
              </template>
            </el-table-column>
            <el-table-column
              prop="testTime"
              label="开考时间"
              align="center"
              width="200px"
            >
            </el-table-column>
            <el-table-column label="试卷类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.testType == 1">系统试卷</span>
                <span v-else-if="scope.row.testType == 2">我的试卷</span>
                <span v-else-if="scope.row.testType == 3">答题卡</span>
                <span v-else-if="scope.row.testType == 4">纸质试卷</span>
                <!-- <span v-else>未知试卷</span> -->
              </template>
            </el-table-column>
            <el-table-column prop="lengthTime" label="考试时间" align="center">
            </el-table-column>
            <el-table-column prop="answerNum" label="答题人数" align="center">
              <template slot-scope="scope">
                {{ scope.row.answerNum }}人
              </template>
            </el-table-column>
            <!-- <el-table-column prop="remake" label="备注" align="center">
            </el-table-column> -->
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  title="导出"
                  type="text"
                  style="color: #2196f3"
                  @click="excelExport(scope.row)"
                  >导出</el-button
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

      <!-- 答题卡 -->
      <div class="exam_detail" v-if="mlNum == 2">
        <div
          style="
            width: 100%;
            background-color: white;
            padding: 10px 0px;
            margin-bottom: 10px;
          "
        >
          <el-button class="qb_btn1" @click="toCardDetail">添加</el-button>
        </div>
        <!-- 列表  答题卡 -->
        <div class="correct">
          <el-table :data="cardDate" stripe>
            <el-table-column prop="templateName" label="答题卡" align="center">
            </el-table-column>
            <el-table-column prop="updateTime" label="时间" align="center">
            </el-table-column>
            <el-table-column label="总题数" align="center" width="80px">
              <template slot-scope="scope">
                {{ scope.row.totalNum }}
              </template>
            </el-table-column>
            <el-table-column
              prop="single"
              label="单选题"
              align="center"
              width="80px"
            >
            </el-table-column>
            <el-table-column
              prop="multiple"
              label="多选题"
              align="center"
              width="80px"
            >
            </el-table-column>
            <el-table-column
              prop="judge"
              label="判断题"
              align="center"
              width="80px"
            >
            </el-table-column>
            <el-table-column label="总分" align="center" width="100px">
              <template slot-scope="scope">
                {{ scope.row.totalScore }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
              <template slot-scope="scope">
                <div class="btn_div">
                  <div
                    style="color: #2196f3; cursor: pointer"
                    @click="toCard(scope.row.id)"
                  >
                    查看
                  </div>
                  <div
                    style="color: #febd2b; cursor: pointer"
                    @click="toCardDetail(scope.row)"
                  >
                    编辑
                  </div>
                  <div
                    style="color: #ec5656; cursor: pointer"
                    @click="cardDelete(scope.row.id, scope.$index)"
                  >
                    删除
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="pagination">
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
        </div> -->
      </div>
      <EasyTest :mlNum="mlNum" v-if="mlNum == 4" />
    </div>
  </div>
</template>
<script>
import ToolBar from "../../../components/navigation/toolBar.vue";
import SearchHeader from "../../../components/teachActivity/dataHeader.vue";
import EditExam from "../examItem/edit_addExam.vue";
import EasyTest from "./easyTest.vue";
import i1 from "@/assets/i1.png";
import i2 from "@/assets/i2.png";
import i3 from "@/assets/i3.png";
import i4 from "@/assets/i4.png";
import i5 from "@/assets/i5.png";
import i6 from "@/assets/i6.png";
import {
  isAssetTypeAnWord,
  isAssetTypeAnPdf,
  isAssetTypeAnExcel,
  isAssetTypeAnPpt,
  isAssetTypeAnRar,
  isAssetTypeAnZip,
} from "@/utils";
import { dictType } from "@/api/admin";
import {
  testPaper,
  includeMyPaper,
  myPaper,
  answerCard,
  removeTest,
  deleteAnswerCard,
  classListByTeacher,
  onlineMark,
  classDetail,
} from "@/api/exam";
import { mapState } from "vuex";
import { testPaperDownload, excelDownload } from "@/axios/download";
import { formatDate } from "../../../utils/formatTime";
const option = [
  /* { label: "全部", value: "" }, */
  { label: "有", value: 1 },
  { label: "无", value: 2 },
];
export default {
  name: "examItem",
  components: { ToolBar, SearchHeader, EditExam, EasyTest },
  data() {
    return {
      i1,
      i2,
      i3,
      i4,
      i5,
      i6,
      addVisible: false,
      classRoom: "",
      date: "",
      changeNum: "",
      chapter: null, //章节
      subjectsNum: 0,
      gradeNum: 0,
      semesterNum: 0,
      areaNum: 0,
      mlNum: 0,
      searchValue: "",
      total: null,
      currentPage: 1,
      imgUrl: require("@/assets/test.png"),
      kpsSub: "",
      isKps: false,
      gradeData: [],
      testTypeData: [],
      bookData: [],
      courseData: [],
      classList: [],
      schoolType: [],
      kpsList: [],
      kpsProps: {
        value: "id",
        label: "name",
        children: "children",
      },
      grade: [
        {
          description: "不限",
          label: "不限",
          value: null,
        },
      ],
      year: [
        {
          label: "不限",
          remarks: "不限",
          sort: 0,
          type: "year_type",
          value: null,
        },
      ],
      subjects: [
        {
          description: "不限",
          label: "不限",
          value: null,
        },
      ],
      area: [
        {
          id: "",
          description: "不限",
          label: "不限",
          remarks: null,
          sort: 1,
          type: "area_type",
          value: null,
        },
      ],
      searchList: [
        {
          name: "最新",
        },
      ],
      directory: [
        {
          title: "系统试卷",
        },
        {
          title: "我的试卷",
        },
        {
          title: "答题卡",
        },
        {
          title: "在线批改",
        },
        {
          title: "简易测试",
        },
      ],
      tableData: [],
      myExamData: [],
      correctData: [],
      cardDate: [],
      analysisData: [...option],
      answerData: [...option],
      fileData: [],
      testData: {
        createBy: null,
        size: "6",
        courseType: null, //科目
        current: "1",
        grade: null,
        teachBookType: null,
        testPaperName: null,
        testPaperSource: "1",
        testPaperType: null,
        year: null,
        regionCode: null,
        analysisType: "",
        answerType: "",
        fileUrl: "",
      },
      myTestData: {
        createBy: null,
        size: "9",
        courseType: null, //科目
        current: "1",
        grade: null,
        teachBookType: null,
        testPaperName: null,
        testPaperSource: "3",
        testPaperType: null,
        year: null,
        order: 0,
        regionCode: null,
      },
      kpsData: {
        userId: "",
        grade: "",
        subject: "",
      },
      correctFrom: {
        classId: "",
        classNo: "",
        grade: "",
        time: "",
        size: "10",
        current: "1",
        schoolId: "",
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  watch: {
    mlNum() {
      if (this.mlNum == 0 || this.mlNum == 1) {
        this.getTestPaper();
      } else if (this.mlNum == 2) {
        this.getAnswerCard();
      } else if (this.mlNum == 3) {
        this.getClassList();
        this.getOnlineMark(this.correctFrom);
      }
    },
  },
  methods: {
    search() {
      if (this.mlNum == 0) {
        this.testData.testPaperName = this.searchValue;
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        this.myTestData.testPaperName = this.searchValue;
        this.getTestPaper();
      }
    },
    changeGrade(index, grade) {
      this.gradeNum = index;
      console.log("grade", grade);
      if (this.mlNum == 0) {
        this.testData.grade = grade.value;
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        this.myTestData.grade = grade.value;
        this.getTestPaper();
      }
    },
    changeSemester(index, year) {
      this.semesterNum = index;
      if (this.mlNum == 0) {
        this.testData.year = year.value;
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        this.myTestData.year = year.value;
        this.getTestPaper();
      }
    },
    changeSubjects(index, subjects) {
      this.subjectsNum = index;
      if (this.mlNum == 0) {
        this.testData.courseType = subjects.value;
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        this.myTestData.courseType = subjects.value;
        this.getTestPaper();
      }
    },
    changeArea(index, area) {
      this.areaNum = index;
      if (this.mlNum == 0) {
        if (area.value == null) {
          this.testData.regionCode = null;
        } else {
          this.testData.regionCode = Number(area.value);
        }
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        if (area.value == null) {
          this.myTestData.regionCode = null;
        } else {
          this.myTestData.regionCode = Number(area.value);
        }
        this.getTestPaper();
      }
    },
    testDetail(item) {
      sessionStorage.setItem("mlNum", this.mlNum);
      if (item.testPaperSource == 2) {
        console.log(item);
        this.$router.push({
          name: "testDetail",
          query: {
            id: item.id,
            type: item.testPaperSource,
            subject: item.courseType,
            mlNum: this.mlNum,
          },
        });
      } else if (item.testPaperSource == 3) {
        this.$router.push({
          name: "answerCard",
          query: {
            id: item.id,
            type: item.testPaperSource,
            subject: item.courseType,
          },
        });
      }
    },
    systemTest(item) {
      this.$confirm("此操作将会把该试卷到我的试卷，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.addToMyTest(item);
          this.$message({
            type: "success",
            message: "添加成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消添加",
          });
        });
    },
    type(command) {
      //试卷类型
      if (this.mlNum == 0) {
        this.testData.testPaperType = command;
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        this.myTestData.testPaperType = command;
        this.getTestPaper();
      }
    },
    version(command) {
      //版本
      if (this.mlNum == 0) {
        this.testData.teachBookType = command;
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        this.myTestData.teachBookType = command;
        this.getTestPaper();
      }
    },
    analysis(command) {
      //解析
      if (this.mlNum == 0) {
        this.testData.analysisType = command;
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        this.myTestData.analysisType = command;
        this.getTestPaper();
      }
    },
    file(command) {
      //文件类型
      if (this.mlNum == 0) {
        this.testData.fileUrl = command;
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        this.myTestData.fileUrl = command;
        this.getTestPaper();
      }
    },
    answer(command) {
      //答案
      if (this.mlNum == 0) {
        this.testData.answerType = command;
        this.getTestPaper();
      } else if (this.mlNum == 1) {
        this.myTestData.answerType = command;
        this.getTestPaper();
      }
    },
    toCard(id) {
      sessionStorage.setItem("mlNum", this.mlNum);
      this.$router.push({
        name: "answerCard",
        query: {
          id: id,
        },
      });
    },
    toCardDetail(item) {
      sessionStorage.setItem("mlNum", this.mlNum);
      this.$router.push({
        name: "cardEdit",
        query: {
          id: item.id,
          name: item.templateName,
        },
      });
    },
    toAdd() {
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs.addExam.init();
      });
    },
    getGrade(val) {
      this.getClassDetail(val);
    },
    getDate(val) {
      console.log("getDate", val);
      if (val) {
        this.correctFrom.time = formatDate(val).value;
        this.getOnlineMark();
      } else {
        this.correctFrom.time = "";
        this.getOnlineMark();
      }
    },
    checkMl(index) {
      this.mlNum = index;
    },
    check(index) {
      this.changeNum = index;
    },
    async addToMyTest(item) {
      let dataFrom = {
        id: item.id,
        teacherId: this.user.data.uid,
      };
      try {
        const { data } = await includeMyPaper(dataFrom);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    },
    async getAnswerCard() {
      try {
        const { data } = await answerCard(this.user.data.uid);
        console.log("getAnswerCard", data);
        this.cardDate = data;
      } catch (e) {
        console.log(e);
      }
    },
    async getTestPaper() {
      let result = null;
      if (this.mlNum == 0) {
        result = await testPaper(this.testData);
        result.data.records.forEach((item) => {
          let assetType = "";
          if (item.fileUrl) {
            if (isAssetTypeAnPdf(item.fileUrl)) {
              assetType = this.i1;
            } else if (isAssetTypeAnWord(item.fileUrl)) {
              assetType = this.i2;
            } else if (isAssetTypeAnExcel(item.fileUrl)) {
              assetType = this.i3;
            } else if (isAssetTypeAnPpt(item.fileUrl)) {
              assetType = this.i4;
            } else if (isAssetTypeAnZip(item.fileUrl)) {
              assetType = this.i5;
            } else if (isAssetTypeAnRar(item.fileUrl)) {
              assetType = this.i6;
            }
          }

          item.assetType = assetType || this.imgUrl;

          this.testTypeData.forEach((otem) => {
            if (otem.value == item.testPaperType) {
              item.testPaperType = otem.label;
            }
          });

          this.bookData.forEach((otem) => {
            if (otem.value == item.teachBookType) {
              item.teachBookType = otem.label;
            }
          });

          this.area.forEach((otem) => {
            if (otem.value == item.regionCode) {
              item.regionCode = otem.label;
            }
          });
          this.gradeData.forEach((otem) => {
            if (otem.value == item.grade) {
              item.grade = otem.label;
            }
          });
          this.courseData.forEach((otem) => {
            if (otem.value == item.courseType) {
              item.courseType = otem.label;
            }
          });
        });
      } else if (this.mlNum == 1) {
        this.myTestData.createdBy = this.user.data.uid;
        result = await myPaper(this.myTestData);
      }

      this.total = result.data.total;
      if (this.mlNum == 0) {
        this.tableData = result;
      } else if (this.mlNum == 1) {
        this.myExamData = result;
      }
    },
    async getTeacherByUser() {
      let _that = this;
      this.$store.state.user.classList.filter((item, index) => {
        _that.schoolType.push(item.schoolType);
      });
      this.schoolType = this.schoolType.filter((item, index) => {
        return this.schoolType.indexOf(item, 0) === index;
      });
      this.schoolType.sort();

      try {
        const gradeData = await dictType("grade_type");
        this.grade.push(...gradeData.data);
        /* this.schoolType.forEach((item, index) => {
          //获取年级
          if (item == 1) {
            this.grade.push(...gradeData.data.slice(0, 6));
          } else if (item == 2) {
            this.grade.push(gradeData.data.slice(0, 4));
          } else if (item == 3) {
            this.grade.push(gradeData.data.slice(0, 4));
          } else {
            this.$message({
              message: "信息错误",
              type: "warning",
            });
          }
        }); */
        this.getSubjects();
      } catch (e) {
        console.log(e);
      }
    },
    async getSubjects() {
      try {
        if (this.schoolType) {
          const subjectData = await dictType("course_type"); //获取科目
          this.subjects.push(...subjectData.data);
        } else {
          this.$message({
            message: "信息错误",
            type: "warning",
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    async deleteTestById(id) {
      try {
        const { data } = await removeTest(id);
      } catch (e) {
        console.log(e);
      }
    },
    async deleteCardById(id, index) {
      try {
        const { data } = await deleteAnswerCard(id);
        this.cardDate.splice(index, 1);
      } catch (e) {
        console.log(e);
      }
    },
    async getClassList() {
      try {
        const { data } = await classListByTeacher(this.user.data.uid);
        this.classList = data;
      } catch (e) {
        console.log(e);
      }
    },
    async download(id, testPaperName) {
      testPaperDownload(id, testPaperName);
    },
    async getOnlineMark() {
      try {
        const {
          data: { records },
        } = await onlineMark(this.correctFrom);
        this.correctData = records;
      } catch (e) {
        console.log(e);
      }
    },
    async getClassDetail(id) {
      if (id) {
        try {
          const { data } = await classDetail(id);
          console.log("ClassDetail", data);
          this.correctFrom.grade = data.grade;
          this.correctFrom.classNo = data.classNo;
          this.correctFrom.classId = data.id;
          this.correctFrom.schoolId = data.schoolId;
          this.getOnlineMark();
        } catch (e) {
          console.log(e);
        }
      } else {
        this.correctFrom.grade = "";
        this.getOnlineMark();
      }
    },
    excelExport(item) {
      const dataFrom = {
        classNo: this.correctFrom.classNo,
        grade: this.correctFrom.grade,
        time: this.correctFrom.time,
        id: item.id,
        name: item.className,
        roomId: item.roomId,
      };
      console.log("excelExport");
      excelDownload(dataFrom);
    },
    cardDelete(id, index) {
      this.$confirm("此操作将会删除该试卷，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.deleteCardById(id, index);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteTest(item, index) {
      this.$confirm("确定删除该试卷吗？?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.deleteTestById(item.id);
          this.myExamData.data.records.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // this.dataFrom.pageNum = val;
      // this.getQuestion(this.dataFrom);
      if (this.mlNum == 0) {
        console.log(`当前页: ${val}`);
        this.testData.current = val;
        this.getTestPaper(this.testData);
      } else if (this.mlNum == 1) {
        console.log(`当前页: ${val}`);
        this.myTestData.current = val;
        this.getTestPaper(this.myTestData);
      }
    },
  },
  async mounted() {
    this.mlNum = Number(sessionStorage.getItem("mlNum")) || 0;
    sessionStorage.removeItem("mlNum");
    this.getTeacherByUser();
    const yearData = await dictType("year_type");
    const gradeData = await dictType("grade_type");
    const areaData = await dictType("area_type");
    const bookData = await dictType("teach_book_type");
    const courseData = await dictType("course_type");
    const testTypeData = await dictType("test_paper_type");
    this.year.push(...yearData.data);
    this.area.push(...areaData.data);
    this.gradeData = gradeData.data;
    this.courseData = courseData.data;
    this.bookData = bookData.data;
    this.testTypeData = testTypeData.data;
    this.getTestPaper();
    dictType("file_type").then((res) => {
      this.fileData = res.data;
    });
  },
};
</script>
<style lang="less" scoped>
.nomsg {
  text-align: center;
  margin: 100px;
  font-size: 18px;
}
.examItem_main {
  margin: 84px auto;
  height: 1200px;
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
        border-left: 2px solid white;
      }
      .check_list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        color: #212121;
        cursor: pointer;
        background-color: #cee9ff;
        border-left: 2px solid #2196f3;
      }
    }
  }
  .exam_detail {
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
      .areatype {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        .green {
          color: #85ba44;
        }
        .pad {
          padding: 10px;
        }
      }
      .more_screen {
        display: flex;
        flex-direction: row;
        align-items: center;
        .el-dropdown-link {
          cursor: pointer;
          // color: #409eff;
          margin: 0px 20px;
        }
        .kps {
          position: relative;
          .kps_main {
            position: absolute;
            top: 25px;
            display: flex;
            flex-direction: column;
            width: 400px;
            background: #ffffff;
            border: 1px solid #cccccc;
            box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
            opacity: 1;
            border-radius: 2px;
            padding: 20px;
            .btn {
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              cursor: pointer;
            }
          }
        }
        .el-icon-arrow-down {
          font-size: 12px;
        }
      }
      // .type_grade{
      //     display: flex;
      //     flex-direction: row;
      // }
    }
    .exam_header {
      height: 80px;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      align-items: center;
      padding: 0 20px;
      position: relative;
      margin-bottom: 20px;
    }
    .qb_btn1 {
      display: flex;
      align-items: center;
      margin: 0px 10px;
      cursor: pointer;
      color: white;
      background-color: rgba(254, 189, 43, 1);
      padding: 0px 8px;
      float: right;
    }
    /deep/.qb_upload {
      // width: 100%;
      display: flex;
      flex-direction: row;
      padding: 10px 10px 10px 10px;
      background-color: white;
      font-size: 14px;
      font-family: Microsoft YaHei;
      border-bottom: 1px dashed #dcdfe6;
      .qb_input {
        width: 326px;
        padding: 5px 10px;
        border: 1px solid #e0e0e0;
        opacity: 1;
        border-radius: 0px 2px 2px 0px;
        outline: none;
        margin-right: 20px;
        margin-left: 50px;
      }
      .qb_text {
        display: flex;
        align-items: center;
        margin: 0px 10px;
        cursor: pointer;
        color: rgba(117, 117, 117, 1);
        padding: 0px 8px;
      }
      .qb_btn {
        display: flex;
        align-items: center;
        margin: 0px 10px;
        cursor: pointer;
        color: white;
        background-color: rgba(254, 189, 43, 1);
        padding: 0px 8px;
      }
      .qb_check {
        display: flex;
        align-items: center;
        margin: 0px 10px;
        cursor: pointer;
        color: #2196f3;
        padding: 0px 8px;
      }
    }
    /deep/.correct {
      height: 100%;
      background-color: white;
      padding: 20px;
      overflow: auto;
      .btn_div {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
    }
  }
  .exam_list {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: white;
    padding: 10px 20px 10px 20px;
    .exam_item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-top: 10px;
      padding-bottom: 20px;
      border-bottom: 1px dashed #dcdfe6;
      .examList_detail {
        display: flex;
        .img {
          width: 70px;
          height: 83px;
          margin-right: 30px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .list {
          display: flex;
          flex-direction: column;
          .title {
            font-size: 18px;
            font-weight: bold;
            color: #333333;
            max-width: 700px;
          }
          .tipList {
            display: flex;
            flex-direction: row;
            margin-top: 10px;
            .tip {
              background-color: #efefef;
              font-size: 12px;
              padding: 3px 10px;
              color: #939393;
              margin-right: 20px;
            }
          }
        }
      }
      .exam_btn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .btn {
          font-family: Microsoft YaHei;
          line-height: 21px;
          font-size: 16px;
          margin: 0px 10px;
          cursor: pointer;
        }
      }
    }
  }
  /deep/.pagination {
    position: absolute;
    bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    .el-pagination.is-background .el-pager li:not(.disabled).qbive {
      background-color: #85ba44; // 进行修改背景和字体
      color: #ffffff;
    }
  }
}
</style>
