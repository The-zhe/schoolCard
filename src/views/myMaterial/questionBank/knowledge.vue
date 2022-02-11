<template>
  <el-dialog title="知识点" :append-to-body="true" :visible.sync="visible">
    <el-form>
      <el-form-item>
        <el-input placeholder="输入关键字进行搜索" v-model="filterText">
        </el-input>
      </el-form-item>
      <el-tree
        :data="kpList"
        :props="defaultProps"
        ref="tree"
        show-checkbox
        node-key="id"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ data }">
          <span>{{ data.topic }}</span>
        </span>
      </el-tree>
      <el-form-item style="margin-top: 25px">
        <el-button type="info" style="float: right" @click="this.visible = false">取消</el-button>
        <el-button type="primary" style="float: right; margin-right: 30px" @click="getCheckedKeys()">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { kpAll,kpList } from '@/api/empcustomer';
export default {
  props:["gradeName", "schoolTermName", "subjectName","questionType","chapter"],
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    gradeName: function (val) {
      console.log('grade',val)
      this.grade = val;
      this.getKpList()
    },
    schoolTermName: function (val) {
      this.schoolTerm = val;
      this.getKpList()
    },
    subjectName: function (val) {
      this.subject = val;
      this.getKpList()
    },
    questionType: function (val) {
      this.type = val;
      this.getKpList()
    },
  },
  data() {
    return {
      visible: false,
      grade: this.gradeName,
      schoolTerm: this.schoolTermName,
      subject: this.subjectName,
      type:this.questionType,
      filterText: '',
      treeData:'',
      kpList:null,
      sendKpList:[],
      // data1: JSON.parse(JSON.stringify(data1)),
      defaultProps:{
        children: 'subTopicList',
        label: 'topic',
      },
      kpListData:{
        subject:null,
        grade:null,
        schoolTerm:null,
        chapterId:this.chapter
      }
    };
  },
  methods: {
    init() {
      this.visible = true;
      // this.$refs.tree.setCheckedKeys([]);
      this.treeData = '',
      this.sendKpList = []
    },
    sendKp(){
      console.log('sendKp',this.treeData)
      this.treeData.forEach((item) => {
        this.sendKpList.push(item)
      });
      // console.log('sendList',this.sendKpList)
    },
    filterNode(value, data) {
      console.log(value,data)
      if (!data) return true;
      return data.topic.indexOf(value) !== -1;
    },
    getCheckedKeys(){
        // this.treeData = this.$refs.tree.getCheckedKeys(false)
        this.treeData = this.$refs.tree.getCheckedNodes()
        console.log('submit',this.treeData)
        this.sendKp()
        this.$emit('getKp',this.sendKpList)
        this.$emit('getType',this.type)
        this.$emit('getData',this.treeData)
        this.visible = false
    },
    async getKpList(){
      console.log('getKpList')
      this.kpListData.subject = this.subject
      this.kpListData.grade = this.grade
      this.kpListData.schoolTerm = this.schoolTerm
      try{
        const {data} = await kpList(this.kpListData)
        console.log('kpList',data)
        this.kpList = data.records
      }catch(e){
        console.log(e)
      }
    }
  },
  mounted(){
    this.getKpList()
  }
};
</script>
<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>