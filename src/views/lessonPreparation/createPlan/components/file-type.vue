<template>
  <div class="fx-type-list">
    <i
      class="icon iconfont"
      :class="{ active: fileType == word }"
      @click="change(word)"
      >&#xe678;</i
    >
    <i
      class="icon iconfont"
      :class="{ active: fileType == ppt }"
      @click="change(ppt)"
      >&#xe671;</i
    >
    <i
      class="icon iconfont"
      :class="{ active: fileType == excel }"
      @click="change(excel)"
      >&#xe66c;</i
    >
    <i
      class="icon iconfont"
      :class="{ active: fileType == pdf }"
      @click="change(pdf)"
      >&#xe677;</i
    >
    <i
      class="icon iconfont"
      :class="{ active: fileType == image }"
      @click="change(image)"
      >&#xe65e;</i
    >
    <i
      class="icon iconfont"
      :class="{ active: fileType == audio }"
      @click="change(audio)"
      >&#xe65f;</i
    >
    <i
      class="icon iconfont"
      :class="{ active: fileType == video }"
      @click="change(video)"
      >&#xe663;</i
    >
    <i
      class="icon iconfont"
      :class="{ active: fileType == mould }"
      v-if="!hide"
      @click="change(mould)"
      >&#xe65c;</i
    >
  </div>
</template>

<script>
import {
  files,
  word,
  ppt,
  excel,
  pdf,
  image,
  audio,
  video,
  mould,
} from "@/configs/file";
export default {
  data() {
    return {
      word,
      ppt,
      excel,
      pdf,
      image,
      audio,
      video,
      mould,
      files,
    };
  },
  props: {
    hide: {
      type: Boolean,
      default: false,
    },
    fileType: {
      type: [String, Number],
      defult: files[0],
    },
  },
  methods: {
    change(e) {
      this.$emit("changeFile", e);
    },
  },
};
</script>

<style lang="less" scoped>
.fx-type-list {
  display: flex;

  .icon {
    font-size: 22px;
    margin-right: 30px;
    padding: 3px;
    cursor: pointer;
    color: #409eff;
  }
  .icon.active {
    color: #85ba44;
  }
}
</style>