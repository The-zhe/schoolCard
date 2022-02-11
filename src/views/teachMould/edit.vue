<template>
  <div class="mould-edit-page main-wrapper">
    <header class="edit-title">
      <div class="edit-title-t">{{ type == "add" ? "新增" : "编辑" }}模板</div>
      <div class="edit-submit" @click="submit">保存</div>
    </header>
    <div class="edit-label-title">
      模板名称
      <span class="require">*</span>
    </div>
    <input
      class="mould-input"
      type="text"
      v-model="teachModelName"
      placeholder="请输入模板名称"
    />

    <div class="edit-label-title">方法介绍</div>
    <quill-editor
      v-model="remark"
      ref="myQuillEditor"
      :options="{}"
    ></quill-editor>

    <el-tabs type="border-card" style="margin-top: 50px">
      <el-tab-pane label="前置学习">
        <edit-befor ref="step1" :array="list1" :stepType="1"></edit-befor>
      </el-tab-pane>
      <el-tab-pane label="课堂学习">
        <edit-befor ref="step2" :array="list2" :stepType="2"></edit-befor>
      </el-tab-pane>
      <el-tab-pane label="课后延伸">
        <edit-befor ref="step3" :array="list3" :stepType="3"></edit-befor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import editBefor from "./components/edit-befor";
import {
  teachModelUpdate,
  teachModelAdd,
  teachModelInfo,
} from "@/api/teachMould";
import { mapState } from "vuex";
export default {
  data() {
    return {
      from: "",
      type: "",
      teachModelName: "",
      remark: "",
      uuid: "",
      list1: [],
      list2: [],
      list3: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  mounted() {
    const { type = "add", uuid, from } = this.$route.query;
    this.from = from;
    this.uuid = uuid;
    this.type = type;
    if (this.uuid) {
      this.getInfo();
    }
  },
  methods: {
    async getInfo() {
      const { data } = await teachModelInfo(this.uuid);
      this.teachModelName = data.teachModelName;
      this.remark = data.remark;
      let list1 = [],
        list2 = [],
        list3 = [];
      data.teachModelStep4InfoRes.forEach((item) => {
        switch (item.stepType) {
          case 1:
            list1.push(item);
            break;
          case 2:
            list2.push(item);
            break;
          case 3:
            list3.push(item);
            break;
        }
      });
      list1.sort((a, b) => a.orderNum - b.orderNum);
      list2.sort((a, b) => a.orderNum - b.orderNum);
      list3.sort((a, b) => a.orderNum - b.orderNum);
      this.list1 = list1;
      this.list2 = list2;
      this.list3 = list3;
    },
    async submit() {
      if (!this.teachModelName) {
        return this.$message({
          message: "请输入模板名称",
          type: "warning",
        });
      }
      try {
        const list1 = await this.$refs.step1.validata();
        const list2 = await this.$refs.step2.validata();
        const list3 = await this.$refs.step3.validata();
        if (list1.length == 0 && list2.length == 0 && list3.length == 0) {
          return this.$message({
            message: "请新建模板步骤",
            type: "warning",
          });
        }
        const params = {
          teachModelName: this.teachModelName,
          remark: this.remark,
          teachModelStepAddReqList: [...list1, ...list2, ...list3],
        };
        if (this.from == "my" && this.type == "edit") {
          params.updatedBy = this.user.data.uid;
          params.uuid = this.uuid;
          await teachModelUpdate(params);
        } else {
          params.createdBy = this.user.data.uid;
          await teachModelAdd(params);
        }
        this.$message({
          message: `${this.type == "add" ? "新增" : "编辑"}成功`,
          type: "success",
        });
        setTimeout(() => {
          window.history.back();
        }, 1500);
      } catch (e) {
        if (e && e.msg) {
          this.$message({
            message: e.msg,
            type: "warning",
          });
        }
      }
    },
  },
  components: {
    editBefor,
  },
};
</script>

<style lang="less" scoped>
/deep/.ql-container {
  height: 200px;
}
.mould-edit-page.main-wrapper {
  background: #fff;
  margin-top: 94px !important;
  padding: 30px;
  /deep/.mould-input {
    display: block;
    width: 100%;
    line-height: 40px;
    padding: 0 20px;
    height: 40px;
    border: 1px solid #e0e0e0;
  }

  /deep/.edit-label-title {
    margin: 20px 0 15px 0;
    display: flex;
    align-items: center;
    height: 20px;

    .require {
      color: red;
      font-size: 18px;
      padding-top: 3px;
      margin-left: 5px;
    }
  }

  /deep/.edit-title {
    display: flex;
    align-items: center;
    .edit-submit {
      width: 58px;
      cursor: pointer;
      height: 40px;
      background: #2196f3;
      border-radius: 2px;
      color: #fff;
      line-height: 40px;
      text-align: center;
    }

    .edit-title-t {
      flex: 1;
      overflow: hidden;
      font-size: 18px;
    }
  }
}
</style>