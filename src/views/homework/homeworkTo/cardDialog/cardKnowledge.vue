<template>
  <el-dialog title="知识点" :append-to-body="true" :before-close="closeBefore" :visible.sync="visible">
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
        :current-node-key="currentNodeKey"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ data }">
          <span>{{ data.name }}</span>
        </span>
      </el-tree>
      <el-form-item style="margin-top: 25px">
        <el-button type="info" style="float: right" @click="visible = false;$refs.tree.setCheckedKeys([]);"
          >取消</el-button
        >
        <el-button
          type="primary"
          style="float: right; margin-right: 30px"
          @click="getCheckedKeys()"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { KPTree } from "@/api/question";
// import { formatData } from "@/utils";
export default {
  // props:["gradeName", "schoolTermName", "subjectName","questionType","chapter"],
  watch: {
    filterText(val) {
      this.$refs.tree.setCheckedKeys([]); //清空
      this.$refs.tree.filter(val);
    },
    currentNodeKey(val) {
      // Tree 内部使用了 Node 类型的对象来包装用户传入的数据，用来保存目前节点的状态。可以用 $refs 获取 Tree 实例
      // if (val.toString()) {
      console.log(this.$refs.tree);
      this.$refs.tree.setCurrentKeys(val);
      // } else {
      //   this.$refs.tree.setCurrentKey(null);
      // }
      console.log("currentNodeKey", val);
    },
  },
  data() {
    return {
      visible: false,
      detail: null,
      currentNodeKey: null,
      filterText: "",
      treeData: "",
      kpList: null,
      subject:null,
      kpsNameList: [],
      sendKpList: [],
      // data1: JSON.parse(JSON.stringify(data1)),
      defaultProps: {
        children: "children",
        label: "name",
      },
      kpListData: {
        subject: null,
        grade: null,
        schoolTerm: null,
        chapterId: this.chapter,
      },
    };
  },
  methods: {
    init(item, indexSort,homeworkType) {
      this.visible = true;
      console.log("KPSinit", item, indexSort);
        // this.subject = subject
        this.detail = item;
        this.detail.indexSort = indexSort;
        this.getKpList(homeworkType);
        if (item.kpIdsTree) {
          console.log('1',item.kpIdsTree)
          // item.kpIdsTree = JSON.parse(item.kpIdsTree)
          // console.log('2',item.kpIdsTree)
          this.$nextTick(() =>{
            setTimeout(() => {
              console.log(item.kpIdsTree)
              item.kpIdsTree.forEach((item) => {
              this.$refs.tree.setChecked(item, true, false);
            });
            },500)
          })
        }
        (this.treeData = ""),
        (this.kpsNameList = []),
        (this.sendKpList = []);
    },
    sendKp() {
      // console.log("sendKp", this.treeData);
      this.treeData.forEach((item) => {
        this.sendKpList.push(item.id);
        this.kpsNameList.push(item.name);
      });
      console.log("sendList", this.sendKpList);
      this.detail.kpIdsTree = this.sendKpList;
      this.detail.kpIdNames = this.kpsNameList.toString();
      this.$emit("getKp", this.detail);
    },
    filterNode(value, data) {
      console.log(value, data);
      if (!data) return true;
      return data.name.indexOf(value) !== -1;
    },
    getCheckedKeys() {
      // this.treeData = this.$refs.tree.getCheckedKeys(false)
      this.treeData = this.$refs.tree.getCheckedNodes();
      console.log("submit", this.treeData);
      this.sendKp();
      this.$refs.tree.setCheckedKeys([]);
      this.visible = false;
    },
    closeBefore(done){
      this.$refs.tree.setCheckedKeys([]);
      done()
    },
    async getKpList(homeworkType) {
      console.log("getKpList",homeworkType);
      try {
        const { data } = await KPTree({subject:homeworkType});
        console.log("kpList", data);
        this.kpList = data;
      } catch (e) {
        console.log(e);
      }
    },
  },
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