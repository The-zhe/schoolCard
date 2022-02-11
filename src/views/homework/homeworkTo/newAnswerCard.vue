<template>
  <div>
    <tool-bar :title="id ? '编辑答题卡' : '新建答题卡'"></tool-bar>
    <div class="newAnswerCard">
      <div class="card">
        <div class="card_title">
          <div class="card_top">
            <div class="heng" style="font-size: 18px">
              <i class="el-icon-back" style="cursor: pointer" @click="back"></i>
              <div style="margin-left: 10px; font-weight: bold">新建答题卡</div>
            </div>
            <el-button type="success" @click="save">保存</el-button>
          </div>
          <div class="card_bottom">
            <div style="font-size: 16px">课本：{{ book ? book : "无" }}</div>
            <div>
              <el-button type="primary" @click="addBook">选择课本</el-button>
              <el-button type="primary" @click="addPage">添加页码</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="card_content">
        <div v-for="(item, index) in cardList" :key="index">
          <div class="heng_bet">
            <div class="title">P{{ item.page }}</div>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="detelePage(index)"
            >
              <el-button type="danger" slot="reference">删除本页</el-button>
            </el-popconfirm>
          </div>
          <el-table
            :data="item.topicList"
            @selection-change="handleSelectionChange($event, item)"
            :ref="`multipleTable${index}`"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">题号{{ scope.row.num }}</template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">{{
                scope.row.remake ? scope.row.remake : "暂无备注"
              }}</template>
            </el-table-column>
            <el-table-column label="" align="center">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    scope.row.kpIdNames ? scope.row.kpIdNames : '暂无知识点'
                  "
                  placement="top"
                >
                  <div><i class="el-icon-s-opportunity"></i>本题知识点</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="" align="center">
              <template slot-scope="scope">
                <div
                  style="cursor: pointer; color: #409eff"
                  @click="toparse(book, page, scope.row)"
                >
                  编辑解题思路
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <chooseBook
      ref="chooseBook"
      v-if="isBook"
      @bookName="nameBook"
    ></chooseBook>
    <choosePage
      ref="choosePage"
      v-if="isPage"
      @pageName="namePage"
      @ListForPage="listPage"
    ></choosePage>
    <parseEdit
      ref="parseEdit"
      v-if="isparse"
      @analysis="getAnalysis"
    ></parseEdit>
  </div>
</template>
<script>
import ToolBar from "../../../components/navigation/toolBar";
import chooseBook from "./cardDialog/chooseBook.vue";
import choosePage from "./cardDialog/choosePage.vue";
import parseEdit from "./cardDialog/parseEdit.vue";
import { homeWorkCardDeatil } from "@/api/schoolaffair";
export default {
  components: { ToolBar, chooseBook, choosePage, parseEdit },
  data() {
    return {
      id: this.$route.query.id,
      type:this.$route.query.type,
      book: null,
      page: null,
      isBook: false,
      isPage: false,
      isparse: false,
      hadPage: false,
      bookItem: null,
      pageList: null,
      cardList: [],
      questionList: [],
      checkedList: [],
      cardDataFrom: {
        type:this.$route.query.type,
        book: "",
        page: "",
        list: [],
      },
    };
  },
  methods: {
    init() {
      (this.book = null),
        (this.page = null),
        (this.isBook = false),
        (this.isPage = false),
        (this.isparse = false),
        (this.hadPage = false),
        (this.bookItem = null),
        (this.pageList = null),
        (this.cardList = []);
    },
    back() {
      this.$router.go(-1);
    },
    toparse(book, page, item) {
      // console.log(item);
      this.isparse = true;
      this.$nextTick(() => {
        this.$refs.parseEdit.init(book, page, item);
      });
    },
    nameBook(val) {
      console.log(val);
      if (this.bookItem) {
        //课本已存在
        this.$confirm("此操作将删除为保存的题目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.init();
            if (val.exerciseBookName) {
              this.book = val.exerciseBookName;
            } else {
              this.book = val.teachBookName;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        if (val.exerciseBookName) {
          this.book = val.exerciseBookName;
        } else {
          this.book = val.teachBookName;
        }
      }
      this.bookItem = val
    },
    namePage(val) {
      this.page = val;
    },
    getAnalysis(val) {
      console.log('getAnalysis',val);
      this.cardList.forEach((card) => {
        card.topicList.forEach((item) => {
          if (item.id == val.id) {
            item = val;
            console.log('topicList',item.id)
          }
        });
      });
      console.log('cardList',this.cardList)
    },
    listPage(val) {
      this.hadPage = false;
      this.pageList = val;
      if (this.cardList.length == 0) {
        this.pageList.topicList.forEach((item) => {
          this.$set(item, "isCheck", false);
          this.$set(item, "page", val.page);
        });
        this.cardList.push(this.pageList);
        console.log("listPage", val);
      } else {
        this.cardList.forEach((item) => {
          if (item.id == val.id) {
            this.hadPage = true;
          }
        });
        if (this.hadPage) {
          this.$message({
            type: "warning",
            message: "该页面已存在，无法重复添加！",
          });
        } else {
          this.pageList.topicList.forEach((item) => {
            this.$set(item, "isCheck", false);
            this.$set(item, "page", val.page);
          });
          this.cardList.push(this.pageList);
        }
      }
      console.log("cardList", this.cardList);
    },
    addBook() {
      this.isBook = true;
      this.$nextTick(() => {
        this.$refs.chooseBook.init();
      });
    },
    addPage() {
      if (this.book) {
        this.isPage = true;
        this.$nextTick(() => {
          this.$refs.choosePage.init(this.bookItem);
        });
      } else {
        this.$message({
          type: "warning",
          message: "请先选择课本！",
        });
      }
    },
    detelePage(index) {
      console.log("detele", index);
      this.cardList.splice(index, 1);
    },
    handleSelectionChange(val, page) {
      setTimeout(() => {
        if (val == "") {
          //如果val为空数组，则该类型的题目全没选，从全选里删除该题目
          // console.log(this.checkedList);
          this.cardList.forEach((item) => {
            item.topicList.forEach((topic) => {
              if (item.exerciseBookPageId == page.id) {
                topic.isCheck = false;
              }
            });
          });
          this.checkedList.forEach((item, index) => {
            this.checkedList = this.checkedList.filter((item) => {
              return item.exerciseBookPageId != page.id;
            });
          });
          console.log(this.checkedList);
        } else {
          page.topicList.forEach((item) => {
            item.isCheck = false;
          });
          val.forEach((item) => {
            item.isCheck = true;
          });
          //如果val不为空数组，则该类型的题目还有，从全选里删除该类型题目并重新添加
          // console.log("val不为空数组");
          if (this.checkedList.length == 0) {
            //空数组
            // console.log("checkedList为空数组");
            this.checkedList = [...this.checkedList, ...val];
          } else {
            //不为空数组
            // console.log("checkedList不为空数组");
            this.checkedList.forEach((item, index) => {
              //先删除，后添加
              this.checkedList = this.checkedList.filter((item) => {
                return item.exerciseBookPageId != page.id;
              });
            });
            this.checkedList = [...this.checkedList, ...val];
          }
        }
      });
      console.log(val, page);
    },
    toggleSelection(row, selected) {
      console.log("row", row);
      this.$nextTick(() => {
        this.cardList.forEach((card, cardIndex) => {
          card.topicList.forEach((item, index) => {
            if (item.isCheck) {
              this.$refs[`multipleTable${cardIndex}`][0].toggleRowSelection(
                item
              );
            }
          });
        });

        console.log(this.$refs.multipleTable);
      });
    },
    async cardDetail() {
      try {
        const { data } = await homeWorkCardDeatil(this.id);
        console.log(data);
        if (data) {
          data.forEach((item) => {
            item.topicList.forEach((topic) => {
              if (topic.questionStatus == 1) {
                //被选中的题目
                this.$set(topic, "isCheck", true);
              } else {
                this.$set(topic, "isCheck", false);
              }
            });
          });
        }
        this.cardList = data;
        this.book = data[0].bookName;
        this.toggleSelection();
      } catch (e) {
        console.log(e);
      }
    },
    save() {
      console.log(this.cardDataFrom);
      localStorage.setItem("questionList", JSON.stringify(this.checkedList));
      this.cardDataFrom.book = this.book;
      this.cardDataFrom.page = this.page;
      this.cardDataFrom.list = this.cardList;
      localStorage.setItem("cardDataFrom", JSON.stringify(this.cardDataFrom));
      this.back();
    },
  },
  mounted() {
    this.cardDataFrom = JSON.parse(localStorage.getItem("cardDataFrom"));
    console.log("cardDataFrom", this.cardDataFrom);
    if (this.cardDataFrom) {
      this.cardList = this.cardDataFrom.list;
      this.book = this.cardDataFrom.book;
      this.page = this.cardDataFrom.page;
      this.toggleSelection();
    } else if (this.id) {
      this.cardDetail();
      this.cardDataFrom = {
        book: "",
        page: "",
        type:this.$route.query.type,
        list: [],
      };
    } else {
      this.init();
      this.cardDataFrom = {
        book: "",
        page: "",
        type:this.$route.query.type,
        list: [],
      };
    }
  },
};
</script>
<style lang="less" scoped>
.newAnswerCard {
  margin: 84px auto;
  height: 1200px;
  width: 1000px;
  display: flex;
  flex-direction: column;
  .card {
    margin-top: 24px;
    background-color: white;
    margin-bottom: 10px;
    .card_title {
      display: flex;
      flex-direction: column;
      padding: 10px;
      .card_top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .card_bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .card_content {
    background-color: white;
    height: 100%;
    overflow-y: auto;
    .heng_bet {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background-color: #d7edff;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
.heng {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>