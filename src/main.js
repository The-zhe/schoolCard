/*
 * @Author: qz
 * @Date: 2021-11-01 10:45:13
 * @LastEditTime: 2021-12-08 15:04:27
 * @LastEditors: qz
 * @Description: 
 * @FilePath: \new-lesson-admin\src\main.js
 */

import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import '@/plugins';
import mixins from "@/mixins";
import ElementUI from 'element-ui';
import 'font-awesome/css/font-awesome.css';
import 'element-ui/lib/theme-chalk/index.css';
import "./styles/index.less";

Vue.config.productionTip = false;
Vue.mixin(mixins);
Vue.use(ElementUI);
Vue.config.devtools = true;

import throttle from '@/utils/throttle';
Vue.prototype.$throttle = throttle;
import debounce from '@/utils/debounce';
Vue.prototype.$debounce = debounce;

const vue = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

export const vm = vue;
