<template>
  <el-dialog title="教案点评" :show-close="true" :visible.sync="visible">
    <!-- <mainEditor v-model="dataFrom.review"></mainEditor> -->
    <el-input
      type="textarea"
      :rows="3"
      maxlength="144"
      placeholder="请输入内容"
      v-model="dataFrom.review"
      show-word-limit
    >
    </el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false;num == 0">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import mainEditor from "@/views/myMaterial/questionBank/editer2";
import { addReview } from "@/api/schoolaffair";
export default {
  components: { mainEditor },
  data() {
    return {
      id: null,
      num:0,
      visible: false,
      content: null,
      dataFrom: {
        review: null,
        roomId: null,
        uuid: null,
      },
    };
  },
  methods: {
    init(item) {
      this.visible = true;
      this.num = 0
      this.$nextTick(() => {
        this.dataFrom.roomId = item.roomId
        this.dataFrom.uuid = item.teachPlanUuid
      })
      console.log('详情',item)
    },
    submit() {
      if (this.dataFrom.review) {
        if(this.num == 0){
          this.num = 1
          this.subTeachReview(this.dataFrom);
        }else{
          this.$message({
            message: `请不要频繁点击!`,
            type: "info",
          })
        }
      }else{
        this.$message({
          message: `尚未点评`,
          type: "info",
        })
      }
    },
    async subTeachReview(from) {
      try {
        const { data } = await addReview(from);
        console.log(data);
        this.$message({
          message: `点评成功`,
          type: "success",
        })
        this.visible = false
        location.reload()
      } catch (e) {
        console.log(e);
        this.$message({
          message: `点评失败,请联系管理人员！`,
          type: "danger",
        })
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
  .tip {
    width: 50px;
    margin-right: 5px;
  }
}
</style>