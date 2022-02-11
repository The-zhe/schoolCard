<template>
  <el-dialog class="preview" :title="title" :visible.sync="preView" width="70%">
    <div class="pre_main">
      <img
        class="material-img"
        :src="imgPrefix + material.fodderUrl"
        alt=""
        v-if="material.fodderType == 6"
      />
      <!--  图片 -->
      <video
        class="material"
        controls
        :src="imgPrefix + material.fodderUrl"
        v-if="material.fodderType == 4"
      ></video>
      <!--  视频 -->
      <audio
        controls
        :src="imgPrefix + material.fodderUrl"
        v-if="material.fodderType == 5"
      ></audio>
      <!--  音频 -->
      <template
        v-if="
          material.fodderType == 1 ||
          material.fodderType == 2 ||
          material.fodderType == 3 ||
          material.fodderType == 7
        "
      >
        <iframe :src="PreviewUrl"></iframe>
      </template>
    </div>
  </el-dialog>
</template>
<script>
import { getPreviewUrl } from "@/api/admin";
export default {
  data() {
    return {
      preView: false,
      imgUrl: "",
      title: "预览素材",
      material: "",
      parmasUrl:'',
      PreviewUrl:'',
    };
  },
  methods: {
    init(item, index) {
      this.preView = true;
      this.title = item.fodderName;
      this.material = item;
      this.parmasUrl = this.imgPrefix + item.fodderUrl
      this.getUrl(this.parmasUrl)
    },
    async getUrl(url){
      try{
        const {data} = await getPreviewUrl({fileUrl:url})
        console.log('allurl',data)
        this.PreviewUrl = data.previewUrl
      }catch(e){
        console.log(e)
      }
    }
  },
};
</script>
<style lang="less" scoped>
iframe {
  height: 100%;
  display: block;
  width: 100%;
  border: medium none;
}
.preview {
  .pre_main {
    // width: 500px;
    height: 500px;
    .material {
      width: 100%;
      height: 100%;
    }
    .material-img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>