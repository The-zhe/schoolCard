<template>
  <div class="exercise" v-if="end">
    <div class="tip">
      试题{{ index + 1 }}【{{ questionType[current.questionType] }}】
    </div>
    <div class="title" v-html="current.questionContent"></div>
    <textarea
      class="mould-text mt15"
      v-if="current.questionType == 5 || current.questionType == 3"
      v-model="current.value"
    ></textarea>
    <template v-if="current.questionType == 1 || current.questionType == 2">
      <div
        class="exercise-item"
        v-for="(item, i) in current.options"
        :key="item.id"
      >
        <el-radio
          v-model="item.value"
          :disabled="current.step == 1"
          :class="[
            current.step == 1
              ? item.value == item.rightAnswer
                ? 'ok'
                : 'no'
              : '',
          ]"
          :label="1"
          @change="changeRadio(i)"
          v-if="current.questionType == 1 || current.questionType == 4"
        ></el-radio>
        <el-checkbox
          v-model="item.value"
          :class="[
            current.step == 1
              ? item.value == item.rightAnswer
                ? 'ok'
                : 'no'
              : '',
          ]"
          :disabled="current.step == 1"
          v-if="current.questionType == 2"
        ></el-checkbox>
        <div class="input-sub">
          <span>{{ asc[i] }}</span>
          <div v-html="item.optionContent"></div>
        </div>
        <div class="check">
          <span
            class="icon iconfont"
            v-if="item.rightAnswer && current.step == 1"
            >&#xe61e;</span
          >
        </div>
      </div>
    </template>
    <template v-if="current.questionType == 4">
      <div class="exercise-item" v-for="(item, i) in array" :key="item.value">
        <el-radio
          v-model="item.bool"
          :disabled="current.step == 1"
          :class="[
            current.step == 1
              ? item.value == current.rightAnswers
                ? 'ok'
                : 'no'
              : '',
          ]"
          :label="1"
          @change="changeRadio2(i)"
        ></el-radio>
        <div class="input-sub">
          <div>
            {{ item.label }} {{ item.value }}-{{ current.rightAnswers }}
          </div>
        </div>
        <div class="check">
          <span
            class="icon iconfont"
            v-if="item.value == current.rightAnswers && current.step == 1"
            >&#xe61e;</span
          >
        </div>
      </div>
    </template>

    <template
      v-if="
        current.step == 1 &&
        (current.questionType == 5 || current.questionType == 3)
      "
    >
      <div class="c1 mt15">正确答案</div>
      <textarea
        class="mould-text mt15"
        :value="current.optionContent"
        disabled
      ></textarea>
    </template>

    <div class="exer-btn">
      <el-button
        type="primary"
        :disabled="index == 0"
        @click="next(-1)"
        v-if="list.length > 1"
        >上一题</el-button
      >
      <el-button
        type="primary"
        :disabled="index == list.length - 1"
        v-if="list.length > 1"
        @click="next(1)"
        >下一题</el-button
      >
      <el-button type="primary" @click="current.step = 1">提交</el-button>
    </div>
  </div>
</template>

<script>
import { teachActivity } from "@/api/empcustomer";
import { questionType, asc } from "@/configs";
export default {
  data() {
    return {
      asc,
      questionType,
      res: null,
      list: [],
      end: false,
      index: -1,
      current: {},
      array: [
        { label: "正确", value: "T", bool: false },
        { label: "错误", value: "F", bool: false },
      ],
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    uuid: {
      type: [String, Number],
      default: () => {},
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.list = [];
        this.array.forEach((item) => {
          item.bool = false;
        });
        this.index = -1;
        this.current = {};
        this.res = null;
        this.end = true;
        this.getData();
      }
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        const { data } = await teachActivity(this.uuid);
        data.activityContent = JSON.parse(data.activityContent);
        data.activityContent.forEach((item) => {
          item.step = 0;
          if (item.questionType == 1 || item.questionType == 2) {
            item.options.forEach((option) => {
              option.value = false;
            });
          }
          if (item.questionType == 4) {
            item.value = "";
          }
        });
        console.log(data.activityContent);
        this.res = data;
        this.list = data.activityContent;
        this.index = 0;
        this.current = this.list[0];
        this.end = true;
      } catch (e) {
        console.log(e);
      }
    },
    changeRadio(e) {
      this.current.options.forEach((item, index) => {
        if (index != e) {
          item.value = false;
        }
      });
    },
    changeRadio2(e) {
      this.array.forEach((item, index) => {
        if (index != e) {
          item.bool = false;
        }
      });
    },
    next(index) {
      let num = this.index + index;
      if (num < 0 || num > this.list.length - 1) {
        return;
      }
      this.index = num;
      this.current = this.list[num];
    },
  },
};
</script>

<style lang="less" scoped>
.exercise {
  position: relative;
  padding-bottom: 44px;
  min-height: 500px;

  .c1 {
    color: #85ba44;
  }
  .exer-btn {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    text-align: right;
  }
  /deep/.el-radio__label {
    display: none;
  }
  .exercise-item {
    display: flex;
    align-items: center;
    margin-top: 15px;
    cursor: pointer;

    /deep/.ok.is-checked {
      .el-checkbox__inner,
      .el-radio__inner {
        background: #85ba44;
        border-color: #85ba44;
      }
      .el-radio__inner {
        &::after {
          background: #fff;
        }
      }
      .el-checkbox__inner {
        &::after {
          border-color: #fff;
        }
      }
    }
    /deep/.no.is-checked {
      .el-checkbox__inner,
      .el-radio__inner {
        background: red;
        border-color: red;
      }
      .el-checkbox__inner {
        &::after {
          border-color: #fff;
        }
      }
      .el-radio__inner {
        &::after {
          background: #fff;
        }
      }
    }

    .el-radio,
    .el-checkbox {
      margin-right: 0;
      padding: 3px;
    }
    .el-radio,
    .el-checkbox {
      padding-right: 10px;
    }
    .check {
      width: 80px;
      text-align: center;

      > span {
        font-size: 25px;
        color: #85ba44;
      }
    }
  }

  .input-sub {
    flex: 1;
    overflow: hidden;
    padding: 10px;
    display: flex;
    align-items: center;
    min-height: 40px;
    border: 1px solid #e0e0e0;
  }
  .tip {
    font-size: 16px;
    color: #febd2b;
  }
  .title {
    margin: 15px 0;
  }
  .mt15 {
    margin-top: 15px;
  }
  .mould-text {
    display: block;
    width: 100%;
    height: 120px;
    padding: 10px 20px;
    border: 1px solid #e0e0e0;
  }
}
</style>