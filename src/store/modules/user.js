import { setCookie, getCookie, removeCookie, convertToChinaNum } from "@/utils"
import { vm } from "@/main";
import { dictType } from "@/api/admin";
import {
  getTeacherByUser,
  teacherRelated
} from "@/api/schoolaffair";
import {
  teacherSubject
} from "@/api/teach";
import ElementUI from 'element-ui';
import { isEmptyObject } from "@/utils"

const access_token = getCookie("access_token") || '';

const expires_time = getCookie("expires_time") || '';

const refresh_token = getCookie("refresh_token") || '';

let user = getCookie("user")
user = user ? JSON.parse(user) : {}

let teachInfo = getCookie("teachInfo")
teachInfo = teachInfo ? JSON.parse(teachInfo) : {}

let classList = getCookie("classList")
classList = classList ? JSON.parse(classList) : []

let teachSubject = getCookie("teachSubject")
teachSubject = teachSubject ? JSON.parse(teachSubject) : []

let subjectList = getCookie("subjectList")
subjectList = subjectList ? JSON.parse(subjectList) : []

function getSchoolName (array) {
  const data = {};
  array.forEach((item) => {
    data[item.value] = item.label;
  });
  return data;
}

let pedding = false

export default {
  state: {
    access_token,
    expires_time,
    refresh_token,
    data: user,
    teachInfo,  //教师信息
    classList,
    teachSubject, //教师科目
    subjectList //教师科目
  },
  mutations: {
    login: (state, { access_token, expires_in, refresh_token, user_info: user }) => {
      let et = Date.now() + expires_in * 1000;
      user.uid = user.id
      state.access_token = access_token;
      state.expires_time = et;
      state.refresh_token = refresh_token;
      state.data = user;
      setCookie("access_token", access_token);
      setCookie('expires_time', et)
      setCookie('refresh_token', refresh_token)
      setCookie("user", JSON.stringify(user))
    },
    setClassList: (state, classList) => {
      state.classList = classList
      setCookie("classList", JSON.stringify(classList));
    },
    setTeachInfo: (state, data) => {  //教师信息
      state.teachInfo = data
      setCookie("teachInfo", JSON.stringify(data));
    },
    setSubject: (state, data) => {  //教师课程
      state.subjectList = data
      setCookie("subjectList", JSON.stringify(data));
    },
    setTeachSubject: (state, data) => {  //教师学科
      state.teachSubject = data
      setCookie("teachSubject", JSON.stringify(data));
    },
    logout: (state, isReplace = true) => {
      state.access_token = "";
      state.data = {}
      state.classList = []
      state.teachInfo = {}
      state.subjectList = []
      removeCookie("subjectList");
      removeCookie("teachSubject");
      removeCookie("access_token");
      removeCookie("expires_time");
      removeCookie("refresh_token");
      removeCookie("user");
      removeCookie("classList");
      if (isReplace && vm.$route.path != '/login') {
        vm.$router.replace("/login");
      }

    }
  },
  actions: {
    async getSubject ({ state, commit }) {
      try {
        const { data } = await getTeachSubject();
        if (data) {
          commit('setSubject', data)
          return data
        } else {
          commit('logout', vm.$route.path != '/login')
        }
        return Promise.reject('您不是教师，请联系管理员')
      } catch (e) {
        commit('logout', vm.$route.path != '/login')
        throw new Error(e)
      }
    },
    async getTeachInfo ({ state, commit }) {
      try {
        const { data } = await getTeacherByUser();
        if (data) {
          commit('setTeachInfo', data)
          return data
        } else {
          commit('logout', vm.$route.path != '/login')
        }
        return Promise.reject('您不是教师，请联系管理员')
      } catch (e) {
        commit('logout', vm.$route.path != '/login')
        throw new Error(e)
      }
    },
    async getTeachSubject ({ state, commit }) {
      try {
        const { data } = await teacherSubject();
        // console.log('teacherSubject',data)
        if (data) {
          commit('setTeachSubject', data)
          return data
        } else {
          commit('logout', vm.$route.path != '/login')
        }
        return Promise.reject('您不是教师，请联系管理员')
      } catch (e) {
        commit('logout', vm.$route.path != '/login')
        throw new Error(e)
      }
    },
    async getTeacherByUser ({ state, commit, dispatch }, notLogin) {
      if (state.classList.length > 0 && !notLogin) { return state.classList }
      if (pedding) {
        return []
      }
      pedding = true
      try {
        const subject = await dispatch('getTeachSubject');
        //获取教师id
        const teach = await dispatch('getTeachInfo');
        //获取班级列表
        const { data } = await teacherRelated(teach.userId);
        //根据字典赋值 名称
        const { data: courseType } = await dictType("course_type");
        const courseTypeData = getSchoolName(courseType);

        data.forEach((item) => {
          const gradeNm = convertToChinaNum(item.grade);
          const clazzNm = convertToChinaNum(item.classNo);
          item.label = `${item.schoolName}/${gradeNm}年级/${clazzNm}班/`;
          item.label += courseTypeData[item.course]
          item.value = item.clazzId + "," + item.course;
          console.log('item', item)
        });
        commit('setClassList', data)
        pedding = false
      } catch (message) {
        pedding = false
        ElementUI.Message({
          message,
          type: 'error'
        })
        return Promise.reject('身份限制')
      }
    }
  },
};
