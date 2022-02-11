<template>
  <div
    :style="{ height: height + 'px', width: width + 'px' }"
    class="searchInput"
  >
    <input
      :placeholder="placeholder"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      type="text"
    />
    <div class="searchButton"><i class="fa fa-search"></i></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
    },
    placeholder: {
      type: String,
    },
  },
  data() {
    return {
      // text: this.value,
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.searchInput {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 13px;
  input {
    padding-left: 17px;
    width: calc(100% - 40px);
    height: 100%;
    border: 0;
    outline: none;
  }
  .searchButton {
    cursor: pointer;
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    background: #2196f3bf;
    justify-content: center;
    transition: 0.5s;
    i {
      color: #ffffff;
    }
  }
  .searchButton:hover{
    background: #2196f3;
  }
}
</style>