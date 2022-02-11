<template>
  <div>
    <div class="common-msg">
      <div class="cm-hd">
        <div class="cm-hd-t1">我的消息</div>
        <div class="cm-hd-t2" @click="readAll">全部标记已读</div>
      </div>
      <div class="cm-bd">
        <div
          class="item"
          :class="{ new: !item.readStatus }"
          v-for="item in list"
          :key="item.id"
          @click="collect(item)"
        >
          <div class="content1">
            {{ item.teacherName }} 给你发送了{{ item.courseName }}课件<span
              class="book"
              >《{{ item.teachPlanName }}》</span
            >
          </div>
          <div class="time">{{ item.time }}</div>
        </div>
      </div>
    </div>

    <el-pagination
      background
      small
      style="text-align: center"
      @current-change="getList"
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page.sync="current"
    >
    </el-pagination>

    <el-dialog
      title="提示"
      :close-on-click-modal="false"
      :show-close="false"
      :modal="false"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span v-if="sel && sel.processStatus"
        >《{{ sel && sel.teachPlanName }}》已保存至我的课件</span
      >
      <span v-else
        >是否将《{{ sel && sel.teachPlanName }}》保存至我的课件？</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="submit"
          v-if="!(sel && sel.processStatus)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRecord, cancelSave, allRead, saveTeachPlan } from "@/api/admin";
import { formatDate } from "@/utils/formatTime";
import Bus from "@/utils/bus";
export default {
  data() {
    return {
      size: 8,
      total: 0,
      current: 1,
      list: [],
      dialogVisible: false,
      sel: null,
    };
  },
  props: ["visible"],
  watch: {
    visible(val) {
      if (!val) {
        this.sel = null;
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const { data } = await getRecord({
        teacherId: this.$store.state.user.teachInfo.userId,
        size: this.size,
        current: this.current,
      });
      if (this.current == 1) {
        let num = 0;
        for (let i = 0; i < data.records.length; i++) {
          if (!data.records[i].readStatus) {
            num++;
          }
          data.records[i].time = formatDate(data.records[i].createTime).value;
        }
        this.$emit("changeNew", num > 0);
      }
      this.list = data.records;
      this.total = data.total;
    },
    async submit() {
      await saveTeachPlan({
        teacherId: this.$store.state.user.teachInfo.userId,
        teachPlanId: this.sel.teachPlanId,
      });
      this.$message({
        message: "课件添加成功",
        type: "success",
      });
      Bus.$emit("updatePlan");
      this.sel.processStatus = 1;
      this.dialogVisible = false;
    },
    async cancel() {
      if (!this.sel.processStatus) {
        await cancelSave({
          teacherId: this.$store.state.user.teachInfo.userId,
          teachPlanId: this.sel.teachPlanId,
        });
      }
      this.dialogVisible = false;
    },
    async readAll() {
      await allRead({ teacherId: this.$store.state.user.teachInfo.userId });
      this.$message({
        message: "操作成功",
        type: "success",
      });
      this.getList();
    },
    collect(e) {
      this.sel = e;
      e.readStatus = 1;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.common-msg {
  width: 350px;

  .cm-bd {
    min-height: 300px;
    .item {
      min-height: 50px;
      display: flex;
      align-items: center;
      padding: 10px 15px 10px 30px;
      position: relative;
      cursor: pointer;
      color: #999999;

      .content1 {
        margin-right: 20px;
        flex: 1;
        overflow: hidden;
      }
      .time {
        color: #999999;
      }
    }

    .item.new {
      color: #212121;
      &::before {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: red;
        content: "";
      }

      .book {
        color: #409eff;
      }
    }
  }

  .cm-hd {
    display: flex;
    align-items: center;
    padding: 10px 5px 15px 5px;
    border-bottom: 1px solid #eeeeee;
    &-t1 {
      flex: 1;
      font-size: 18px;
      color: #212121;
    }
    &-t2 {
      cursor: pointer;
      margin-left: 10px;
      color: #999999;
    }
  }
}
</style>