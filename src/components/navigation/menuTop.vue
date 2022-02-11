<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    background-color="#ffffff"
    mode="horizontal"
    text-color="#333333"
    active-text-color="#85BA44"
    :router="true"
  >
    <template v-for="x in menuData">
      <template v-if="x.children.length == 0">
        <el-menu-item :disabled="x.disabled" :key="x.index" :index="x.index">
          <!-- <i :class="x.icon"></i> -->
          <span slot="title">{{ x.name }}</span>
        </el-menu-item>
      </template>
      <template v-else>
        <el-submenu :disabled="x.disabled" :key="x.index" :index="x.index">
          <template slot="title">
            <!-- <i :class="x.icon"></i> -->
            <span>{{ x.name }}</span>
          </template>
          <el-menu-item
            :disabled="y.disabled"
            :key="y.index"
            v-for="y in x.children"
            :index="y.index"
            >{{ y.name }}</el-menu-item
          >
        </el-submenu>
      </template>
    </template>
  </el-menu>
</template>

<script>
import menuData from "./menu.json";
export default {
  data() {
    return {
      menuData: menuData.data,
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>
