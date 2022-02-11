import { get, post, postJSON } from "@/axios";
import { baseUrl } from "@/configs";

export function teachModelInfo (uuid) {
  return get(
    `${baseUrl}/oto/teachModel/info/${uuid}`);
}

export function teachModelPage (params) {
  return get(
    `${baseUrl}/oto/teachModel/page`,
    params,
  );
}

export function teachModelRemove (params) {
  return postJSON(
    `${baseUrl}/oto/teachModel/remove`,
    params,
  );
}

export function teachModelAdd (params) {
  return postJSON(
    `${baseUrl}/oto/teachModel/add`,
    params,
  );
}

export function teachModelUpdate (params) {
  return postJSON(
    `${baseUrl}/oto/teachModel/update`,
    params,
  );
}

//教学分组列表查询
export function teachGroupPage (params) {
  return get(
    `${baseUrl}/oto/teachGroup/page`, params
  );
}

//教学分组列表删除
export function teachGroupRemove (data) {
  return postJSON(
    `${baseUrl}/oto/teachGroup/remove`, data
  );
}

//根据班级查询分组
export function getClassGroupList (params) {
  return get(
    `${baseUrl}/oto/teachGroupPlan/class/${params}`
  );
}

//根据学校查询班级
export function classList (params) {
  return get(
    `${baseUrl}/schoolaffair/clazz/page`, params
  )
}

//根据班级查询学生
export function listStudent (params) {
  return get(
    `${baseUrl}/oto/class/listStudent`, params
  )
}