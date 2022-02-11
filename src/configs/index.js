const proxyConfig = require("../../proxy.config");
const vueConfig = proxyConfig[args_type].vueConfig
const { proxys, webUrl } = vueConfig

const env = process.env.NODE_ENV || "production";

export const weburl = webUrl

// 抛出debug, 是否开启debug
export const debug = env === "development";

export const baseUrl = debug ? '/api' : '';

export const ossUrl = ''

// export const baseUrl = debug ? '/api' : 'http://192.168.8.76:9999';

export const uploadUrl = '/admin/sys-file/otoUpload';

export const uploadStatus = '/v1/common/oss/videoUploadStatus';  //查看视频的上传状态


export const officeUrl = 'http://ow365.cn/?i=24355&ssl=1&furl='

//难易程度
export const difficulty = {
  1: '难',
  2: '中等',
  3: '简单',
}

//题目类型
export const questionType = {
  1: '单选题',
  2: '多选题',
  3: '填空题',
  4: '判断题',
  5: '简答题',
  6: '组合题',
}


export const asc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']

export const login_access_token = (args_type == 'test' || args_type == 'dev') ? 'dGVzdDp0ZXN0' : 'cGlnOnBpZw=='

export const loginData = {
  scope: 'server',
  grant_type: 'password'
}
