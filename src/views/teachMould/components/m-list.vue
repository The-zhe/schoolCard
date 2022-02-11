<template>
  <div class="m-item">
    <div class="m-name ell">{{ item.teachModelName }}</div>
    <div class="edit-btn">
      <router-link
        :to="`/resources/teachMould/edit?type=edit&uuid=${item.uuid}&from=${type}`"
        class="btn c1"
        >编辑</router-link
      >
      <div class="btn c2" @click="handler">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    text() {
      if (this.type == "my") {
        return "删除";
      } else {
        return "收录";
      }
    },
  },
  methods: {
    handler() {
      if (this.type == "my") {
        this.$emit("remove", this.item.uuid);
      } else {
        this.$emit("add", this.item.uuid);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.m-item {
  height: 76px;
  border: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  padding: 0 7px 0 20px;
  font-size: 16px;
  .edit-btn {
    height: 40px;
    display: flex;

    .c1 {
      color: #2196f3;
    }
    .c2 {
      color: #febd2b;
    }
    .c3 {
      color: #85ba44;
    }
    .btn {
      display: flex;
      height: 100%;
      align-items: center;
      padding: 0 14px;
      cursor: pointer;
      position: relative;

      &:last-child {
        &::after {
          width: 0;
          overflow: hidden;
        }
      }

      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        width: 1px;
        height: 100%;
        background: #eee;
      }
    }
  }
  .m-name {
    flex: 1;
    overflow: hidden;
    margin-right: 20px;
  }
}
</style>