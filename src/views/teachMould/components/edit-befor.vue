<template>
  <div>
    <div
      class="item-wrap"
      v-for="(item, i) in list"
      :key="i"
      :class="{ active: activeIndex == i }"
    >
      <div class="befor-title" @click="toggle(i)">
        <div class="b-t ell">步骤{{ i + 1 }}</div>
        <div class="b-r" @click.stop="remove(i)">删除</div>
      </div>
      <div class="befor-content">
        <div class="edit-label-title">
          步骤名称
          <span class="require">*</span>
        </div>
        <input
          class="mould-input"
          type="text"
          v-model="item.stepName"
          placeholder="请输入步骤名称"
        />
        <div class="edit-label-title">方法描述</div>
        <quill-editor
          v-model="item.remark"
          ref="myQuillEditor"
          :options="{}"
        ></quill-editor>
      </div>
    </div>

    <div class="add-list">
      <div class="circular" @click="add"><i class="el-icon-plus"></i></div>
    </div>
  </div>
</template>

<script>
const obj = {
  remark: "",
  stepName: "",
};
export default {
  data() {
    return {
      activeIndex: -1,
      list: [],
    };
  },
  props: {
    array: {
      type: Array,
      default: () => [],
    },
    stepType: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    array: {
      handler(val) {
        this.list = [...val];
      },
      deep: true,
    },
  },
  mounted() {
    this.list = [...this.array];
  },
  methods: {
    validata() {
      return new Promise((resolve, reject) => {
        for (let i = 0; i < this.list.length; i++) {
          const item = this.list[i];
          if (!item.stepName) {
            const step =
              this.stepType == 1
                ? "前置学习"
                : this.stepType == 2
                ? "课堂学习"
                : "课后延伸";
            return reject({ msg: `请输入 ${step}->步骤${i + 1}->步骤名称` });
          }
        }
        this.list.forEach((data, index) => {
          data.orderNum = index + 1;
          data.stepType = this.stepType;
        });
        resolve(this.list);
      });
    },
    add() {
      this.list.push({ ...obj });
      this.activeIndex = this.list.length - 1;
    },
    remove(e) {
      this.list.splice(e, 1);
    },
    toggle(e) {
      if (this.activeIndex == e) {
        this.activeIndex = -1;
      } else {
        this.activeIndex = e;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.add-list {
  margin-top: 20px;
  display: flex;
  flex-direction: row-reverse;
  text-align: right;

  > .circular {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: #fff;
    border-radius: 50%;
    background-color: rgb(133, 186, 68);
    font-size: 26px;
    cursor: pointer;
  }
}
.befor-content {
  max-height: 0;
  overflow: hidden;
}
.befor-title {
  margin: 20px 0;
  display: flex;
  align-items: center;
  height: 40px;
  border: 1px solid #eeeeee;
  padding: 0 10px;
  cursor: pointer;
  transform: background-color 0.3s;

  &:hover {
    background-color: #ecf5ff;
  }

  .b-t {
    flex: 1;
    overflow: hidden;
    margin-right: 50px;
    color: #85ba44;
  }
  .b-r {
    color: #2196f3;
    padding-left: 20px;
  }
}
.item-wrap.active {
  .befor-content {
    max-height: 9999px;
  }
  .befor-title {
    background-color: #ecf5ff;
  }
}
</style>