<template>
  <el-dialog
    title="教案及教学反思"
    :show-close="true"
    :visible.sync="visible"
    width="60%"
  >
    <el-form
      ref="form"
      :model="dataFrom"
      label-width="70px"
      class="screen_from"
    >
      <el-form-item label="年级">
        <el-select v-model="dataFrom.grade" placeholder="请选择年级">
          <el-option
            v-for="item in classList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="dataFrom.classNo" placeholder="请选择班级">
          <el-option
            v-for="item in clazzList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上课时间" label-width="80px">
        <el-date-picker
          v-model="dataFrom.classDate"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="教学反思编辑时间" label-width="130px">
        <el-date-picker
          v-model="dataFrom.reflectionDate"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-delete" @click="empty">清空</el-button>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableFrom">
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="年级" align="center">
        <template slot-scope="scope">{{ scope.row.grade }}年级</template>
      </el-table-column>
      <el-table-column label="班级" align="center">
        <template slot-scope="scope">{{ scope.row.classNo }}班</template>
      </el-table-column>
      <el-table-column label="科目" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.subject == 1">语文</div>
          <div v-if="scope.row.subject == 2">数学</div>
          <div v-if="scope.row.subject == 3">英语</div>
        </template>
      </el-table-column>
      <el-table-column label="上课时间" align="center" width="200px">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column label="教学反思时间" align="center" width="200px">
        <template slot-scope="scope">{{ scope.row.reflectionTime }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: #2196f3; padding: 0px"
            @click="toDeatil(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { clazzListReflect,reflectPlanlist,reflectClasslist } from "@/api/schoolaffair";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      user: (state) => state.user,
      teachSubject: (state) => state.user.teachSubject,
    }),
  },
  data() {
    return {
      id: null,
      uuid:null,
      visible: false,
      content: null,
      teacherId: null,
      classList: null,
      clazzList: null,
      dataFrom: {
        planUuid: null,
        grade: null,
        reflectionDate: null,
        classDate: null,
        classNo:null,
      },
      tableFrom: [],
    };
  },
  methods: {
    init(item) {
      this.visible = true;
      console.log(item)
      this.uuid = item.uuid
      this.dataFrom.planUuid = item.uuid
      this.$nextTick(() => {
        this.getGrade()
        this.getClass(this.uuid);
        this.getList(this.dataFrom)
      })
    },
    toDeatil(row) {
      this.$router.push(
        {
          name:'teachPlan',
          query:{
            detail:JSON.stringify(row) 
          }
        }
      )
      console.log(row);
    },
    empty(){
      this.dataFrom.grade = null
      this.dataFrom.reflectionDate = null
      this.dataFrom.classDate = null
      this.dataFrom.classNo = null
    },
    search() {
      this.getList(this.dataFrom)
    },
    async getGrade() {
      this.teacherId = this.user.data.uid
      try {
        const { data } = await clazzListReflect(this.teacherId); //this.user.data.uid
        this.classList = data;
      } catch (e) {
        console.log(e);
      }
    },
    async getClass(id) {
      try {
        const { data } = await reflectClasslist(id); //uuid
        this.clazzList = data;
        console.log('getClass',this.classList);
      } catch (e) {
        console.log(e);
      }
    },
    async getList(from) {
      try {
        const { data } = await reflectPlanlist(from);
        this.tableFrom = data
      } catch (e) {
        console.log(e);
      }
    },
  }
};
</script>
<style lang="less" scoped>
.screen_from {
  display: flex;
  flex-wrap: wrap;
}
</style>