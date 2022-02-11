<template>
  <el-dialog title="教学反思" :show-close="true" :visible.sync="visible">
    <mainEditor v-if="!isreflection" v-model="dataFrom.reflection"></mainEditor>
    <div v-else v-html="dataFrom.reflection"></div>
    <span v-if="!isreflection"  slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
    <span v-else slot="footer" class="dialog-footer">
      <div>最后编辑反思时间：{{reflectionTime}}</div>
    </span>
  </el-dialog>
</template>
<script>
import mainEditor from "@/views/myMaterial/questionBank/editer2";
import { teachReflect,editTeachReflect } from "@/api/schoolaffair";
export default {
  components: { mainEditor },
  data() {
    return {
      id: null,
      visible: false,
      content: null,
      reflectionTime:null,
      isreflection:false,
      dataFrom:{
        reflection:null,
        roomId:null,
      }
    };
  },
  methods: {
    init(id) {
      this.visible = true;
      this.dataFrom.roomId = id
      this.$nextTick(() => {
        console.log('id',id)
        this.editInit(id)
      })
    },
    submit() {
      this.$confirm('确定后，无法修改, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.dataFrom.reflection){
            this.subTeachReflect(this.dataFrom)
          }else{
            this.$message({
              message:'内容不许为空！',
              type:'info',
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    async subTeachReflect(from){
      try{
        const {data} = await teachReflect(from)
        console.log(data)
        this.$message({
          message:'保存成功！',
          type:'success'
        })
        this.visible = false;
        location. reload()
      }catch(e){
        console.log(e)
      }
    },
    async editInit(roomId){
      console.log('获取反思编辑')
      try{
        const {data} = await editTeachReflect(roomId)
        console.log(data)
        if(data){
          this.dataFrom.reflection = data.reflection
          this.reflectionTime = data.reflectionTime
          data.reflection?this.isreflection=true:this.isreflection=false
        }
      }catch(e){
        console.log(e)
      }
    }
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