<template>
  <div>
    <div class="edit-label-title">教学目标</div>
    <quill-editor
      v-model="teachPlanAims"
      ref="myQuillEditor"
      :options="{}"
    ></quill-editor>
    <div class="edit-label-title">重难点</div>
    <quill-editor
      v-model="keyAndPoints"
      ref="myQuillEditor"
      :options="{}"
    ></quill-editor>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teachPlanAims: "",
      keyAndPoints: "",
    };
  },
  methods: {
    setData(data) {
      for (let key in data) {
        this[key] = data[key];
      }
    },
    validata() {
      return new Promise((resolve, reject) => {
        resolve({
          teachPlanAims: this.teachPlanAims,
          keyAndPoints: this.keyAndPoints,
        });
      });
    },
  },
};
</script>
