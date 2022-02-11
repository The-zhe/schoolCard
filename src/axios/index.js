import axios from "axios";
import qs from "qs";
import ElementUI from 'element-ui';
import router from "../router";
import store from '@/store'
import { baseUrl, login_access_token, loginData } from "@/configs";
const isTokenExpired = () => { // 验证当前token是否过期
  let expireTime = store.state.user.expires_time
  if (expireTime) {
    let nowTime = Date.now()
    return nowTime > expireTime
  }
  return false
}

let $p = null, $$p = null
function checkToken({ cb, data, notRefresh }) {
  if (!$p) {
    if (isTokenExpired() && !data[0].includes('/oauth/token') && !notRefresh) {
      $$p = axios.get(
        `${baseUrl}/auth/oauth/token`, {
        params: { grant_type: 'refresh_token', refresh_token: store.state.user.refresh_token },
        config: { login_access_token, type: 'login', noToken: true }
      }).then(res => {
        store.commit('login', res)
        return true
      }).catch((e) => {
        store.commit('logout')
        throw new Error(e)
      })
      $p = $$p
    } else {
      return cb.apply(axios, data)
    }
  }
  return $$p.then((res) => cb.apply(axios, data)).finally(() => {
    $p = null
  })
}
/**
 * config.headers
 * @param {Boolean} noToken 请求参数不需要携带token
 * @param {Boolean} notLogin 登陆失效不需要进行跳转
 * @param {Boolean} notToast 请求code错误不需要显示提示框
 */
axios.defaults.timeout = 1000 * 60 * 5;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
axios.defaults.withCredentials = false;
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// axios.defaults.baseUrl = baseUrl;
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const { data, config: { noToken, type ,login_access_token}, method } = config;

    if (!data) {
      config.data = {}
    }

    if (!noToken) {
      config.headers["Authorization"] = `Bearer ${store.state.user.access_token}`;
    } else if (type === 'login') {
      config.headers["Authorization"] = `Basic ${login_access_token}`;
    }

    if (['get', 'delete'].includes(method)) {
      config.params.timestamp = new Date() - 0;
    }

    if (['post', 'put'].includes(method)) {

      // 如果data是FormData 直接返回
      if (data instanceof FormData) {
        return config;
      }
      // 如果 Content-type 不是JSON 用qs序列化
      if (config.headers["Content-Type"] !== "application/json") {
        config.data = qs.stringify(config.data);
      }
    }

    return config;

    // if (!config.data) {
    //   config.data = {};
    // }
    // if (config.config) {
    //   if (!config.config.noToken) {
    //     config.headers["Authorization"] = `Bearer ${store.state.user.access_token}`;
    //   } else {
    //     if (config.config.type == 'login') {
    //       config.headers["Authorization"] = `Basic ${config.config.login_access_token}`;
    //     }
    //   }
    // }

    // if (config.method === "get" || config.method === "delete") {
    //   config.params.timestamp = new Date() - 0;
    // }
    // if (config.method === "post" || config.method === "put") {
    //   if (config.data instanceof FormData) {
    //     return config;
    //   }
    //   if (config.headers["Content-Type"] !== "application/json") {
    //     config.data = qs.stringify(config.data);
    //   }
    // }
    // return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    const { status, config: { config: { type, noToast } = {} } = {}, data } = response;

    const { code, msg:message } = data;
    // 如果返回类型为下载直接返回整个response
    if (type && type === 'download') {
      return response;
    }
    // 如果状态为401 退出登录
    if (status == 401) {
      return store.commit('logout')
    }
    // 如果状态不等于200 或者返回编码为1 说明请求错误
    if (status != 200 || code === 1) {
      // 如果未设置不提示 提示错误消息
      if (!noToast) {
        ElementUI.Message({
          message,
          type: 'error'
        })
      }
      // 停止接口请求 返回Error
      return Promise.reject(new Error(message))
    }
    return response.data;


    // if (response.config.config && response.config.config.type == 'download') {
    //   return response;
    // }
    // const status = Number(response.status) || 200
    // const message = response.data.msg
    // if (status === 401) {
    //   return store.commit('logout')
    // }

    // if (status !== 200 || response.data.code === 1) {

    //   if (!(response.config.config && response.config.config.noToast)) {
    //     ElementUI.Message({
    //       message: message,
    //       type: 'error'
    //     })
    //   }
    //   return Promise.reject(new Error(message))
    // }
    // return response.data;
  },
  error => {
    if (error.message.indexOf('401') > -1) {
      store.commit('logout')
    } else {

    }
    return Promise.reject(error);
  }
)
/**
 * 对ajax进行细致化处理
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} config axios配置对象
 *
 * @desc: 提取不同的方法
 */
export function get(url = "", params = {}, config = {}) {
  return checkToken({ cb: axios.get, data: [url, { params, config }], notRefresh: config.notRefresh })

}
export function del(url = "", params = {}, config = {}) {
  return checkToken({ cb: axios.delete, data: [url, { params, config }], notRefresh: config.notRefresh })

}
export function post(url = "", data = {}, config = {}) {
  return checkToken({
    cb: axios.post, data: [url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      }, config
    }], notRefresh: config.notRefresh
  })

}
export function uploadFiles(url = "", data = {}, config = {}) {
  var forms = new FormData()
  Object.keys(data).forEach(key => {
    forms.append(key, data[key])
  })

  return checkToken({
    cb: axios.post, data: [url, forms, {
      headers: {
        "Content-Type": "multipart/form-data",
      }, config
    }], notRefresh: config.notRefresh
  })

}

export function postJSON(url = "", data = {}, config = {}) {
  return checkToken({
    cb: axios.post, data: [url, data, {
      headers: {
        "Content-Type": "application/json",
      }, config
    }], notRefresh: config.notRefresh
  })

}

export function put(url = "", data = {}, config = {}) {
  return checkToken({
    cb: axios.put, data: [url, data, {
      headers: {
        "Content-Type": "application/json",
      }, config
    }], notRefresh: config.notRefresh
  })

}

export function getBlob(url = "", params = {}, config = {}) {
  return checkToken({ cb: axios.get, data: [url, { params, config, responseType: 'blob' }], notRefresh: config.notRefresh })

}
export default {
  post,
  put,
  get,
  del,
  postJSON,
  uploadFiles,
  getBlob,
};