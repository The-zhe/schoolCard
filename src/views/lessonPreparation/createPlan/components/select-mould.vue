<template>
  <div class="flow-select-mould">
    <div class="flow-select-header">
      <div>模板名称</div>
      <div class="flow-mould-search">
        <input type="text" v-model="text" @keyup.enter="onSearch" />
        <div class="search" @click="onSearch">
          <i class="el-icon-search"></i>
        </div>
      </div>
    </div>
    <div class="flow-mould-change">
      <div class="btn-wrap">
        <div class="my" :class="{ active: type == 'my' }" @click="change('my')">
          我的模板
        </div>
        <div
          class="system"
          :class="{ active: type == 'system' }"
          @click="change('system')"
        >
          OMO模板
        </div>
      </div>
    </div>
    <div class="flow-mold-list">
      <div class="flow-mold-item" v-for="item in list" :key="item.uuid">
        <div
          class="icon-1"
          :class="{ active: select.includes(item.uuid) }"
          @click="selectItem(item.uuid)"
        >
          <i class="icon iconfont">&#xe61e;</i>
        </div>
        <div class="flow-mold-item-title ell">{{ item.teachModelName }}</div>
      </div>
    </div>
    <div class="flow-pages">
      <el-pagination
        background
        style="text-align: center"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <div class="submit">
        <el-button type="primary" @click="submit">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { teachModelPage, teachModelInfo } from "@/api/teachMould";
export default {
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      total: 10,
      text: "",
      type: "my",
      list: [],
      select: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  props: ["value"],
  watch: {
    value(val) {
      if (val) {
        this.text = "";
        this.type = "my";
        this.onSearch();
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async submit() {
      if (this.select.length == 0) {
        return this.$message({
          message: "请至少引用其中一个教学模板",
          type: "warning",
        });
      }
      try {
        const result = { 1: [], 2: [], 3: [] };
        for (let i = 0; i < this.select.length; i++) {
          const { data } = await teachModelInfo(this.select[i]);
          let list1 = [],
            list2 = [],
            list3 = [];
          data.teachModelStep4InfoRes.forEach((item) => {
            item.teach2FodderAddReqs = [];
            switch (item.stepType) {
              case 1:
                list1.push(item);
                break;
              case 2:
                list2.push(item);
                break;
              case 3:
                list3.push(item);
                break;
            }
          });
          list1.sort((a, b) => a.orderNum - b.orderNum);
          list2.sort((a, b) => a.orderNum - b.orderNum);
          list3.sort((a, b) => a.orderNum - b.orderNum);

          result[1].push(...list1);
          result[2].push(...list2);
          result[3].push(...list3);
        }
        this.$emit("input", false);
        this.$emit("outStep", result);
      } catch (e) {
        console.log(e);
      }
    },
    onSearch() {
      this.pageNum = 1;
      this.total = 0;
      this.select = [];
      this.getList();
    },
    async getList() {
      const params = {
        teachModelName: this.text,
        current: this.pageNum,
        size: this.pageSize,
      };
      if (this.type == "my") {
        params.createdBy = this.user.data.uid;
        params.type = 1;
      } else {
        params.type = 2;
      }
      try {
        const { data } = await teachModelPage(params);
        this.total = data.total;
        this.list = data.records;
      } catch (e) {}
    },
    change(e) {
      this.type = e;
      this.onSearch();
    },
    handleCurrentChange() {
      this.getList();
    },
    selectItem(uuid) {
      let index = this.select.indexOf(uuid);
      if (index > -1) {
        this.select.splice(index, 1);
      } else {
        this.select.push(uuid);
      }
    },
  },
};
</script>

<style lang="less" >
.flow-select-mould {
  .submit {
    text-align: right;
    padding-right: 20px;
    margin-top: 10px;
  }
  .flow-pages {
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 100%;
    z-index: 1;
  }
  .flow-mold-list {
    margin: 15px 0;

    .flow-mold-item {
      display: flex;
      margin-top: 10px;
      align-items: center;

      &:first-child {
        margin-top: 0;
      }

      .icon-1 {
        width: 18px;
        height: 18px;
        border: 1px solid #ebeef5;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 15px;
        .icon {
          font-size: 12px;
          display: none;
        }
      }
      .icon-1.active {
        background-color: #85ba44;
        border-color: #85ba44;
        color: #fff;

        .icon {
          display: block;
        }
      }
      .flow-mold-item-title {
        flex: 1;
        overflow: hidden;
        padding: 0 20px;
        line-height: 34px;
        height: 36px;
        border: 1px solid #e0e0e0;
      }
    }
  }
  .flow-mould-change {
    margin-top: 20px;
    display: flex;
    justify-content: center;

    .btn-wrap {
      border-radius: 2px;
      border: 1px solid #e0e1e2;
      width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 34px;
      cursor: pointer;
    }

    .active {
      background-color: #2196f3;
      color: #fff;
    }

    .my,
    .system {
      flex: 1;
      overflow: hidden;
      text-align: center;
      line-height: 32px;
    }
  }
  .flow-select-header {
    padding-bottom: 24px;
    border-bottom: 1px solid #eeeeee;
  }

  .flow-mould-search {
    display: flex;
    margin-top: 12px;
    input {
      height: 40px;
      border: 1px solid #e0e0e0;
      border-right: 0;
      line-height: 40px;
      padding: 0 15px;
      width: 100%;
    }
    .search {
      width: 60px;
      height: 40px;
      background: #2196f3;
      border-radius: 0px 2px 2px 0px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        font-size: 20px;
      }
    }
  }
}
</style>