<template>
  <el-dialog class="preview" :title="title" :visible.sync="preView" width="70%">
    <div class="pre_main">
      <img
        class="material-img"
        :src="imgPrefix + imgUrl"
        alt=""
        />
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
    init(item) {
      console.log(item)
      this.imgUrl = item
      this.preView = true;
      this.parmasUrl = this.imgPrefix + item
      console.log(this.parmasUrl)
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