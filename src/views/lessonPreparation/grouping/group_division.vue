<template>
  <div class="group_division">
    <el-dialog
      :visible.sync="visible"
      width="80%"
      top="4vh"
      :show-close="false"
    >
      <div class="group">
        <div class="group_name">{{classDetail.name}}</div>
        <div class="group_class">{{classDetail.className}}</div>
      </div>
      <div class="group_detail">
        <!-- 未分组  -->
        <div class="group_people">
          <div class="title">
            未分组学生（{{studentList.length}}）
            <div class="check" style="border: 2px solid #ffffff"></div>
          </div>
          <div class="students" v-for="(student,index) in studentList" :key="index">
            <div class="img">
              <img :src="circleUrl" alt="" />
            </div>
            <div class="stu_name">{{student.studentName}}</div>
            <div class="check"></div>
          </div>
        </div>

        <!-- 分组 -->
        <div class="group_describe">
          <div class="group_describe_input">
            <el-input v-model="classDetail.remark" readonly></el-input>
          </div>

          <div class="des_title">
            <div class="des_text">选中学生平均分组</div>
            <el-button style="background: #febd2b; color: white"
              >新增分组</el-button
            >
          </div>
          <!-- 小组 -->
          <div style="background: white; height: 100%">
            <el-collapse class="collapses">
              <el-collapse-item title="小组1" name="1">
                <div class="des_group">
                  <div class="des_arrow">
                    <i class="el-icon-caret-left"></i>
                    <i class="el-icon-caret-right"></i>
                  </div>
                  <div class="des_stus">
                    <div class="des_peo">
                      <div class="peo_left">
                        <div class="img" style="margin-right: 10px">
                          <img :src="circleUrl" alt="" />
                        </div>
                        <div class="des_name" style="margin-right: 10px">
                          张三丰
                        </div>
                        <i
                          class="el-icon-s-flag"
                          style="
                            margin-right: 10px;
                            color: #85ba44;
                            font-size: 24px;
                          "
                        ></i>
                        <i
                          class="el-icon-s-marketing"
                          style="
                            margin-right: 10px;
                            color: #ff3366;
                            font-size: 24px;
                          "
                        ></i>
                      </div>
                      <div class="peo_right">
                        <el-button
                          icon="el-icon-s-flag"
                          size="medium"
                          style="background: #febd2b; color: white"
                          >组长</el-button
                        >
                        <el-button
                          icon="el-icon-s-marketing"
                          size="medium"
                          style="background: #febd2b; color: white"
                          >正方</el-button
                        >
                        <div class="check" style="margin: 0px 10px"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div class="des_btn">
              <el-button style="background: #2196f3; color: white"
                >确定</el-button
              >
              <el-button>取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listStudent } from "@/api/teachMould";
export default {
  name: "group_division", //人员划分
  data() {
    return {
      classId: null,
      visible: false,
      activeNames: [],
      studentList:'',
      classDetail:'',
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    };
  },
  methods: {
    init(msg) {
      this.classDetail = msg
      this.classId = msg.classId;
      this.visible = true;
      console.log('init',msg)
      this.getListStudent(this.classId)
    },
    async getListStudent(id){
      try {
        const { data } = await listStudent({classId:id});
        console.log("getListStudent", data);
        this.studentList = data
      } catch (e) {
        console.log(e);
      }
    }
  },
  mounted(){
  }
};
</script>
<style lang="less">
.group_division {
  background-color: #808080;
  .el-dialog {
    border-radius: 0px;
    -webkit-box-shadow: 0 0px 0px;
    box-shadow: 0 0px 0px;
    box-sizing: border-box;
    background-color: rgba(0,0,0,0);
    .el-dialog__header {
      background-color: #808080;
      padding: 0px;
    }
    .el-dialog__title {
      background-color: #808080;
    }
  }
  .group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    background-color: white;
    height: 40px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #757575;
    margin-bottom: 20px;
    box-sizing: content-box;
  }
  .group_detail {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .group_people {
      width: 210px;
      height: 800px;
      background-color: white;
      margin-right: 20px;
    }
    .title {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      background-color: #85ba44;
      height: 46px;
      text-align: center;
      line-height: 46px;
      color: white;
      padding: 0px 4px;
    }
    .students {
      height: 56px;
      line-height: 56px;
      padding: 0px 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .img {
        width: 32px;
        height: 32px;
        border-radius: 50% 50%;
        margin-right: 5px;
        img {
          widows: 100%;
          height: 100%;
        }
      }
      .stu_name {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #212121;
        margin-right: 5px;
      }
    }
    .students:hover {
      background-color: #f5f5f5;
    }
    .group_describe {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      /deep/ .collapses{
        /deep/ .el-collapse-item__wrap{
              /deep/ .el-collapse-item__content{
              padding-bottom:0px
            }
          }
  }

      .group_describe_input {
        padding: 10px;
        background: #fff;
        margin-bottom: 20px;
      }
      .des_title {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding: 15px;
        background-color: white;
        .des_text {
          color: #2196f3;
          margin-right: 15px;
          cursor: pointer;
        }
      }
      .des_group {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        .des_arrow {
          display: flex;
          flex-direction: column;
          //   width: 65px;
          background-color: #e8f4fe;
          .el-icon-caret-left {
            font-size: 36px;
            color: #2196f3;
          }
          .el-icon-caret-right {
            font-size: 36px;
            color: #2196f3;
          }
        }
        .des_stus {
          width: 100%;
          display: flex;
          flex-direction: column;
          .des_peo {
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 10px 15px;
            .peo_left {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              .img {
                width: 32px;
                height: 32px;
                border-radius: 50% 50%;
                margin-right: 5px;
                img {
                  widows: 100%;
                  height: 100%;
                }
              }
            }
            .peo_right {
              display: flex;
              flex-direction: row;
              align-items: center;
            }
          }
        }
      }
      .des_btn {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
  .check {
    width: 18px;
    height: 18px;
    border: 2px solid #85ba44;
  }
}
</style>