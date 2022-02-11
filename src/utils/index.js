export * from "./validata";
export * from "./formatTime";
import * as CryptoJS from 'crypto-js'

export function compose (...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }
  //由内向外，逐步调用
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export function isObject (obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

// 判断是否为空对象
export const isEmptyObject = obj => {
  for (var name in obj) {
    return false; // 返回false，不为空对象
  }
  return true; // 返回true，为空对象
};

export function setCookie (key, value) {
  localStorage.setItem(key, value)
}

export function getCookie (key) {
  return localStorage.getItem(key)
}

export function removeCookie (key) {
  localStorage.removeItem(key)
}


export function sortByKey (obj) {
  const newkey = Object.keys(obj).sort();
  var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {
    //遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;
}

//判断文件是否为图片
export function isAssetTypeAnImage (ext) {
  return ext.toLowerCase().indexOf('image') !== -1;
}

//判断文件是否为视频
export function isAssetTypeAnVideo (ext) {
  return ext.toLowerCase().indexOf('video') !== -1;
}

//判断文件是否为音频
export function isAssetTypeAnAudio (ext) {
  return ext.toLowerCase().indexOf('audio') !== -1;
}
//判断文件是否为word
export function isAssetTypeAnWord (ext) {
  return ext.toLowerCase().indexOf('doc') !== -1;
}
//判断文件是否为pdf
export function isAssetTypeAnPdf (ext) {
  return ext.toLowerCase().indexOf('pdf') !== -1;
}
//判断文件是否为execl
export function isAssetTypeAnExcel (ext) {
  return ext.toLowerCase().indexOf('xls') !== -1;
}
//判断文件是否为ppt
export function isAssetTypeAnPpt (ext) {
  return ext.toLowerCase().indexOf('ppt') !== -1;
}
//判断文件是否为ppt
export function isAssetTypeAnRar (ext) {
  return ext.toLowerCase().indexOf('rar') !== -1;
}
//判断文件是否为ppt
export function isAssetTypeAnZip (ext) {
  return ext.toLowerCase().indexOf('zip') !== -1;
}


export function secondForTime (value) {
  let theTime = value;//秒
  let middle = 0;//分
  let hour = 0;//小时
  if (theTime > 59) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
  }
  if (middle > 59) {
    hour = parseInt(middle / 60);
    middle = parseInt(middle % 60);
  }
  theTime < 10 ? theTime = '0' + theTime : theTime = theTime
  middle < 10 ? middle = '0' + middle : middle = middle
  hour < 10 ? hour = '0' + hour : hour = hour
  return hour + ':' + middle + ':' + theTime
}

/**
 *加密处理
 */
export const encryption = (params) => {
  let {
    data,
    type,
    param,
    key
  } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      var data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      var iv = key
      // 加密
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      })
      result[ele] = encrypted.toString()
    })
  }
  return result
}



export function convertToChinaNum (num) {
  var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
  var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿');//可继续追加更高位转换值
  if (!num || isNaN(num)) {
    return "零";
  }
  var english = num.toString().split("")
  var result = "";
  for (var i = 0; i < english.length; i++) {
    var des_i = english.length - 1 - i;//倒序排列设值
    result = arr2[i] + result;
    var arr1_index = english[des_i];
    result = arr1[arr1_index] + result;
  }
  //将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
  //合并中间多个零为一个零
  result = result.replace(/零+/g, '零');
  //将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
  //将【亿万】换成【亿】
  result = result.replace(/亿万/g, '亿');
  //移除末尾的零
  result = result.replace(/零+$/, '')
  //将【零一十】换成【零十】
  //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
  //将【一十】换成【十】
  result = result.replace(/^一十/g, '十');
  return result;
}

// 格式化数据，递归将空的children置为undefined
export function formatData (data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].children.length < 1) {
      data[i].children = undefined
    } else {
      formatData(data[i].children)
    }
  }
  return data
}