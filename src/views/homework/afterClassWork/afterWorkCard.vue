<template>
  <div class="afterWorkCard">
    <tool-bar title="查看作业"></tool-bar>
    <div class="card">
      <div class="card_detail">
        <div class="card_header">
          <div class="heng" style="font-size: 18px">
            <i class="el-icon-back" style="cursor: pointer" @click="back"></i>
            <div style="margin-left: 10px; font-weight: bold">答题卡</div>
            <div style="padding: 0px 10px; font-size: 16px; margin-left: 50px">
              当前题数:{{ totalNum }}
            </div>
            <div style="padding: 0px 10px; font-size: 16px">
              当前总分:{{ totalScore }}
            </div>
          </div>
          <!-- <el-button type="primary">保存</el-button> -->
        </div>
        <el-table :data="tableFrom">
          <el-table-column label="序号" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="页码" align="center">
            <template slot-scope="scope">P{{ scope.row.pageNum }}</template>
          </el-table-column>
          <el-table-column label="题号" align="center">
            <template slot-scope="scope">{{
              scope.row.num ? scope.row.num : "无"
            }}</template>
          </el-table-column>
          <el-table-column label="分值" align="center">
            <template slot-scope="scope">{{
              scope.row.questionScore
            }}</template>
          </el-table-column>
          <el-table-column label="题目类型" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.questionType == 1">单选题</div>
              <div v-if="scope.row.questionType == 2">多选题</div>
              <div v-if="scope.row.questionType == 4">判断题</div>
              <div v-if="scope.row.questionType == 5">拍照题</div>
            </template>
          </el-table-column>
          <el-table-column label="正确答案" align="center" width="300px">
            <template slot-scope="scope">
              <!-- <el-radio-group
                v-if="
                  scope.row.questionType == 1 || scope.row.questionType == 4
                "
                v-model="scope.row.rightAnswer"
                disabled
              >
                <el-radio-button
                  v-for="(item, index) in scope.row.questionOptionsNum"
                  :key="index"
                  :label="String.fromCharCode(index + 65)"
                ></el-radio-button>
              </el-radio-group>
              <el-checkbox-group
                v-if="scope.row.questionType == 2"
                v-model="scope.row.rightAnswer"
              >
                <el-checkbox-button
                  v-for="(item, index) in scope.row.questionOptionsNum"
                  :label="String.fromCharCode(index + 65)"
                  :key="index"
                  disabled
                ></el-checkbox-button>
              </el-checkbox-group> -->
              <div
                v-if="scope.row.questionType == 5"
                style="display: inline-flex; width: auto; height: 50px"
              >
                <img
                  v-for="(img, index) in scope.row.rightAnswer"
                  :key="index"
                  :src="imgPrefix + img"
                  alt=""
                  @click="preview(img)"
                  style="
                    width: 100%;
                    height: 100%;
                    margin: 0px 10px;
                    cursor: pointer;
                  "
                />
              </div>
              <div v-else>{{ scope.row.rightAnswer }}</div>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">{{
              scope.row.remake ? scope.row.remake : "暂无备注"
            }}</template>
          </el-table-column>
          <el-table-column label="知识点" align="center">
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.kpIdNames"
                class="item"
                effect="dark"
                :content="scope.row.kpIdNames"
                placement="top-start"
              >
                <div>查看</div>
              </el-tooltip>
              <div v-else>暂无知识点</div>
            </template>
          </el-table-column>
          <el-table-column label="解题思路" align="center">
            <template slot-scope="scope">
              <div
                style="color: #409eff; cursor: pointer"
                @click="toParse(scope.row)"
              >
                编辑解题思路
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center">
            <i class="el-icon-delete"></i>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <Parse v-if="isparse" ref="parseRef" :row="row"></Parse>
    <Preview v-if="preView" ref="preview"></Preview>
  </div>
</template>
<script>
import { cardList } from "@/api/schoolaffair";
import ToolBar from "../../../components/navigation/toolBar.vue";
import Parse from "./parseDetail.vue";
import Preview from "./preview.vue";
export default {
  components: { ToolBar, Parse, Preview },
  data() {
    return {
      preView: false,
      isparse: false,
      totalNum: 0,
      totalScore: 0,
      infoFrom: {
        homeworkId: this.$route.query.id,
      },
      tableFrom: [],
      row: {},
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    preview(img) {
      console.log(img);
      if (img) {
        this.preView = true;
        this.$nextTick(() => {
          this.$refs.preview.init(img);
        });
      }
    },
    toParse(row) {
      this.isparse = true;
      this.row = row;
      this.$nextTick(() => {
        this.$refs.parseRef.init(row.id);
      });
    },
    async getList() {
      try {
        const { data } = await cardList(this.infoFrom);
        console.log(data);
        if (data.question.length > 0) {
          data.question.forEach((item) => {
            if (item.questionType == 5) {
              if (item.rightAnswer.length - 1 == ",") {
                item.rightAnswer = item.rightAnswer.slice(
                  0,
                  item.rightAnswer.length - 1
                );
                item.rightAnswer = item.rightAnswer.split(",");
              } else {
                item.rightAnswer = item.rightAnswer.split(",");
              }
            }
          });
        }
        this.tableFrom = data.question;
        this.totalNum = data.totalNum;
        this.totalScore = data.totalScore;
        console.log("tableFrom", this.tableFrom);
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
    });
  },
};
</script>
<style lang="less" scoped>
.card {
  margin: 84px auto;
  height: 1200px;
  width: 1400px;
  display: flex;
  flex-direction: column;
  .card_detail {
    margin-top: 24px;
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 10px;
    .card_header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px;
      margin-bottom: 20px;
    }
  }
}
.heng {
  display: flex;
  flex-direction: row;
  align-items: center;
}
/deep/.has-gutter {
  > tr {
    background-color: transparent;

    > th {
      background: #e1f1ff;
    }
  }

  color: #333333;
}
</style>
<style>
.el-tooltip__popper {
  max-width: 400px;
}
</style>