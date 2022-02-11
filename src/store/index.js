import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    imgPrefix: '',
    isGenerateRouters: false, //是否已生成路由
  },
  mutations: {
    setImgPrefix: (state, str) => {
      state.imgPrefix = str
    },
    GENERATEROUTERS: (state, bool) => {
      state.isGenerateRouters = bool
    },
  },
  modules
});
