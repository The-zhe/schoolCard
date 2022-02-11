<template>
  <div>
    <div class="edit-label-title" style="margin-top: 0">
      步骤名称
      <span class="require">*</span>
    </div>
    <input
      class="mould-input"
      type="text"
      v-model="stepName"
      placeholder="请输入步骤名称"
    />
    <div class="edit-label-title">方法描述</div>
    <quill-editor
      v-model="remark"
      ref="myQuillEditor"
      :options="{}"
    ></quill-editor>
    <div style="text-align: right; margin-top: 20px">
      <el-button type="primary" @click="output">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stepName: "",
      remark: "",
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    stepType: {
      type: [String, Number],
      default: 0,
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.stepName = "";
        this.remark = "";
      }
    },
  },
  methods: {
    output() {
      if (!this.stepName) {
        return this.$message({
          message: "请输入步骤名称",
          type: "warning",
        });
      }
      const params = {
        stepName: this.stepName,
        stepType: this.stepType,
        remark: this.remark,
        teach2FodderAddReqs: [],
      };
      this.$emit("input", false);
      this.$emit("output", params);
    },
  },
};
</script>
