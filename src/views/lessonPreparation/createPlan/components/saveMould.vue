<template>
  <div>
    <div class="edit-label-title" style="margin-top: 0">
      模板名称
      <span class="require">*</span>
    </div>
    <input
      class="mould-input"
      type="text"
      v-model="teachModelName"
      placeholder="请输入模板名称"
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
      teachModelName: "",
      remark: "",
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.teachModelName = "";
        this.remark = "";
      }
    },
  },
  methods: {
    output() {
      if (!this.teachModelName) {
        return this.$message({
          message: "请输入模板名称",
          type: "warning",
        });
      }
      const params = {
        teachModelName: this.teachModelName,
        remark: this.remark,
      };
      this.$emit("input", false);
      this.$emit("output", params);
    },
  },
};
</script>
