<template>
  <div class="teachPlan">
    <div :class="detail.reflection ? 'main1' : 'main'">
      <div class="plan">
        <div class="title">
          <i class="el-icon-back" style="cursor: pointer" @click="back"></i>
          <div class="text">教案及教学反思</div>
        </div>
        <div class="planMain">
          <div class="plan_title">{{ dataFrom.teachPlanName }}</div>
          <el-table style="margin-bottom: 20px" :data="tableFrom" border>
            <el-table-column label="教师" prop="teacherName" align="center">
              <template slot-scope="scope">{{
                scope.row.teacherName
              }}</template>
            </el-table-column>
            <el-table-column label="年级" prop="grade" align="center">
              <template slot-scope="scope">{{ scope.row.grade }}年级</template>
            </el-table-column>
            <el-table-column
              label="班级"
              prop="classNo"
              align="center"
              v-if="detail.reflection"
            >
              <template slot-scope="scope">
                {{ scope.row.classNo }}班
              </template>
            </el-table-column>
            <el-table-column label="科目" prop="course" align="center">
              <template slot-scope="scope">
                {{ scope.row.courseName }}
              </template>
            </el-table-column>
            <el-table-column
              label="上课时间"
              prop="createTime"
              align="center"
              v-if="detail.createTime"
            ></el-table-column>
          </el-table>
          <div class="reflect" v-if="detail.reflection">
            <el-tag effect="dark" type="success">教学反思</el-tag>
            <div class="reflect_text" v-html="dataFrom.reflection"></div>
            <div style="position: absolute; right: 5px; bottom: 5px">
              {{ dataFrom.reflectionTime }}
            </div>
          </div>
          <div class="content">
            <el-tag effect="dark" type="success">教案内容</el-tag>
            <div class="introduce">
              <div class="content_title">一、课时介绍</div>
              <div
                class="content_detail"
                v-if="dataFrom.remark"
                v-html="dataFrom.remark"
              ></div>
              <div v-else class="content_detail">无</div>
            </div>
            <div class="introduce">
              <div class="content_title">二、教学目标</div>
              <div
                class="content_detail"
                v-if="dataFrom.teachPlanAims"
                v-html="dataFrom.teachPlanAims"
              ></div>
              <div v-else class="content_detail">无</div>
            </div>
            <div class="introduce">
              <div class="content_title">三、重难点</div>
              <div
                class="content_detail"
                v-if="dataFrom.keyAndPoints"
                v-html="dataFrom.keyAndPoints"
              ></div>
              <div v-else class="content_detail">无</div>
            </div>
            <div class="introduce">
              <div class="content_title">四、教学流程</div>
              <div style="padding: 10px 20px">
                <div
                  class="content_title_four"
                  v-if="dataFrom.teachStepInfoBeforeClass"
                >
                  <span>一、前置学习</span>
                  <TeachProcess :stepList="dataFrom.teachStepInfoBeforeClass" />
                </div>
                <div
                  class="content_title_four"
                  v-if="dataFrom.teachStepInfoInClass"
                >
                  <span>二、课堂学习</span>
                  <TeachProcess :stepList="dataFrom.teachStepInfoInClass" />
                </div>
                <div
                  class="content_title_four"
                  v-if="dataFrom.teachStepInfoAfterClass"
                >
                  <span>三、课后延伸</span>
                  <TeachProcess :stepList="dataFrom.teachStepInfoAfterClass" />
                </div>
              </div>
            </div>
            <div class="introduce">
              <div class="content_title">五、板书</div>
              <div
                class="content_detail"
                v-if="dataFrom.blackboardWriting"
                v-html="dataFrom.blackboardWriting"
              ></div>
              <div v-else class="content_detail">无</div>
            </div>
            <div class="introduce">
              <div class="content_title">六、课后作业</div>
              <div
                class="content_detail"
                v-if="dataFrom.homeworkDescribe"
                v-html="dataFrom.homeworkDescribe"
              ></div>
              <div v-else class="content_detail">无</div>
            </div>
          </div>
        </div>
      </div>
      <div class="review" v-if="detail.reflection">
        <div class="toreview">
          <el-button style="color: #85ba44" @click="toReview"
            >我要点评</el-button
          >
        </div>
        <el-pagination
          style="
            text-align: center;
            padding: 10px 0px;
            border-bottom: 1px solid #eeeeee;
            background-color: white;
          "
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="reviewFrom.size"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <div class="list">
          <div class="review_item" v-for="(item, index) in list" :key="index">
            <div class="review_tip">
              <div class="tip">{{ item.name ? item.name : "无名氏" }}</div>
              <i class="el-icon-delete" @click="deleteReviewList(item)"></i>
            </div>
            <div class="review_content">{{ item.review }}</div>
            <div class="date">{{ item.reviewTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <Review v-if="isReview" ref="review" />
  </div>
</template>
<script>
import {
  reflectDeatil,
  haveReflectDeatil,
  reviewlist,
  deleteReview,
} from "@/api/schoolaffair";
import TeachProcess from "./teachProcess.vue";
import Review from "./Dialog/review.vue";
export default {
  name: "teachPlan",
  components: { TeachProcess, Review },
  data() {
    return {
      detail: JSON.parse(this.$route.query.detail),
      reflect: "",
      isReview: false,
      total: 0,
      tableFrom: [
        {
          teacherName: null,
          grade: null,
          clazz: null,
          course: null,
          date: null,
        },
      ],
      dataFrom: null,
      reviewFrom: {
        roomId: "",
        uuid: "",
        size: 3,
        current: 1,
      },
      list: [],
    };
  },
  methods: {
    toReview() {
      this.isReview = true;
      this.$nextTick(() => {
        this.$refs.review.init(this.detail);
      });
    },
    deleteReviewList(item) {
      this.$confirm("确定删除该点评?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.toDeteleReview(item.id);
          this.getReviewList(this.reviewFrom);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleCurrentChange(val) {
      this.reviewFrom.current = val;
      this.getReviewList(this.reviewFrom);
    },
    back() {
      this.$router.go(-1);
    },
    addHttp(val) {
      val.replace(
        new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi),
        (match, capture) => {
          // 如果不是http或https开头的
          if (!capture.startsWith("http")) {
            match = match.replace(
              new RegExp(capture, "g"),
              this.imgPrefix + capture
            );
          }
          console.log("addhttp", match);
          return match;
        }
      );
    },
    async getReviewList(from) {
      try {
        const { data } = await reviewlist(from);
        console.log(data);
        this.list = data.records;
        this.total = data.total;
      } catch (e) {
        console.log(e);
      }
    },
    async toDeteleReview(id) {
      try {
        const { data } = await deleteReview(id);
        console.log(data);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.getReviewList(this.reviewFrom);
      } catch (e) {
        console.log(e);
      }
    },
    async getDetail(uuid) {
      try {
        const { data } = await reflectDeatil(uuid);
        const {homeworkDescribe,blackboardWriting} = data;
        data.homeworkDescribe = this.getImgPrefix(homeworkDescribe)
        data.blackboardWriting = this.getImgPrefix(blackboardWriting)
        this.dataFrom = data;
        this.tableFrom[0].grade = data.grade;
        this.tableFrom[0].teacherName = data.teacherName;
        this.tableFrom[0].courseName = data.courseName;
      } catch (e) {
        console.log(e);
      }
    },
    getImgPrefix(html=''){
      return html.replace(
					new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi),
					(match, capture) => {
						// 如果不是http或https开头的
						if (!capture.startsWith('http')) {
							match = match.replace(
								new RegExp(capture, 'g'),
								this.imgPrefix + capture
							);
						}
						return match;
					}
				);
    },
    async getHaveReflectDetail(uuid, roomId) {
      //有反思获取详情
      try {
        const { data } = await haveReflectDeatil(uuid, roomId);
        const {homeworkDescribe,blackboardWriting} = data;
        data.homeworkDescribe = this.getImgPrefix(homeworkDescribe)
        data.blackboardWriting = this.getImgPrefix(blackboardWriting)
        console.log(data);
        this.dataFrom = data;
        this.tableFrom[0].grade = data.grade;
        this.tableFrom[0].teacherName = data.teacherName;
        this.tableFrom[0].courseName = data.courseName;
        this.tableFrom[0].classNo = data.classNo;
        this.reflect = data.reflectionTime;
        // this.dataFrom.homeworkDescribe = this.addHttp(this.dataFrom.homeworkDescribe)
        // this.dataFrom.blackboardWriting = this.addHttp(this.dataFrom.blackboardWriting)
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.reviewFrom.roomId = this.detail.roomId;
      this.reviewFrom.uuid = this.detail.teachPlanUuid;
      this.tableFrom[0].createTime = this.detail.createTime;
      if (this.detail.reflection) {
        //有无反思
        this.getHaveReflectDetail(
          this.detail.teachPlanUuid,
          this.detail.roomId
        );
        this.getReviewList(this.reviewFrom);
      } else {
        this.getDetail(this.detail.uuid);
      }
    });
  },
};
</script>
<style lang="less" scoped>
.main {
  margin: 40px auto;
  min-height: 1200px;
  width: 900px;
  display: flex;
  flex-direction: row;
}
.main1 {
  margin: 40px auto;
  min-height: 1200px;
  width: 1400px;
  display: flex;
  flex-direction: row;
}
.plan {
  width: 900px;
  background-color: white;
  .title {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #eeeeee;
    align-items: center;
    font-size: 24px;
    padding: 10px 20px;
    .text {
      margin-left: 10px;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .planMain {
    padding: 20px 40px;
    .plan_title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .reflect {
      position: relative;
      margin-bottom: 20px;
      .reflect_text {
        width: 100%;
        min-height: 150px;
        margin-top: 10px;
        background-color: #eeeeee;
        border-radius: 5px;
        padding: 10px 10px 30px 10px;
      }
    }
    .content {
      .introduce {
        padding: 5px 20px;
        margin-bottom: 10px;
        .content_title {
          font-size: 18px;
          font-weight: bold;
        }
        .content_detail {
          padding: 10px 20px;
        }
        .content_title_four {
          font-size: 18px;
          font-weight: bold;
          padding: 10px 20px;
        }
      }
    }
  }
}
.review {
  min-height: 600px;
  width: 400px;
  margin-left: 10px;
  .toreview {
    height: 47px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    background-color: #85ba44;
    padding: 0px 10px;
  }
  .list {
    display: flex;
    flex-direction: column;
    .review_item {
      display: flex;
      flex-direction: column;
      .review_tip {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: #e1f1ff;
        padding: 10px;
        font-size: 17px;
        font-weight: bold;
      }
      .review_content {
        word-break: break-word;
        min-height: 80px;
        padding: 10px 20px;
        background-color: white;
      }
      .date {
        display: flex;
        flex-direction: row;
        justify-content: end;
        padding: 0px 10px;
        background-color: white;
        padding-bottom: 10px;
      }
    }
  }
}
.pad {
  padding: 10px 20px;
}
.pad_s {
  padding: 5px 20px;
  font-size: 16px;
  font-weight: 100;
}
.des {
  color: #acacac;
}
/deep/.has-gutter {
  > tr {
    background-color: transparent;

    > th {
      background: #eeeeee;
    }
  }

  color: #333333;
}
/deep/ .el-table--border .el-table__cell {
  border-right: 1px solid #e8e7ea;
}
/deep/ .el-tag {
  font-size: 18px;
  font-weight: bold;
  height: auto !important;
  line-height: auto !important;
}
.el-pagination.is-background .el-pager li:not(.disabled).qbive {
  background-color: #85ba44; // 进行修改背景和字体
  color: #ffffff;
}
</style>