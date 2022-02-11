/*
 * @Author: qz
 * @Date: 2021-11-01 10:45:13
 * @LastEditTime: 2021-12-10 13:29:16
 * @LastEditors: qz
 * @Description: 
 * @FilePath: \new-lesson-admin\src\api\login\index.js
 */
import { get, post, postJSON } from "@/axios";
import { baseUrl, login_access_token, loginData } from "@/configs";
import qs from "qs";

export function toLogin(data) {
  return post(
    `${baseUrl}/auth/oauth/token`,
    { ...data, ...loginData },
    { login_access_token, type: 'login', noToken: true, notRefresh: true }
  );
}

export function getRole() {
  return get(
    `${baseUrl}/admin/user/info`, {},
    { notRefresh: false }
  );
}


export function getSendMsg(mobile) {
  return get(
    `${baseUrl}/admin/mobile/${mobile}`, { type: 2 },
    { noToken: true, notRefresh: true }
  );
}
export function toMsgCodeLogin(data) {
  return post(
    `${baseUrl}/auth/mobile/token/sms?${qs.stringify(data)}`,
    {},
    { login_access_token, type: 'login', noToken: true, notRefresh: true }
  );
}


export function getLoginQrCode(data) {
  return post(
    `${baseUrl}/oto/qrLogin/code`,
    data,
    { noToken: true, notRefresh: true }
  );
}

export function qrCheckToken(uuid) {
  return post(
    `${baseUrl}/oto/qrLogin/token/${uuid}`,
    {},
    { noToken: true, noToast: true, notRefresh: true }
  );
}

export function teacherLogin(params) {
  return post(
    `${baseUrl}/schoolaffair/teacher/login`,
    params,
    { noToken: true, notRefresh: true }
  );
}


export function passwordCode(params) {
  return post(
    `${baseUrl}/schoolaffair/teacher/modify/password/code`, params,
    { noToken: true, notRefresh: true }
  );
}

export function modifyPassword(params) {
  return post(
    `${baseUrl}/schoolaffair/teacher/modify/password`, params,
    { noToken: true, notRefresh: true }
  );
}

