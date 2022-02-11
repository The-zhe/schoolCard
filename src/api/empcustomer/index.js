import { get, post, postJSON, put, del } from "@/axios";
import { baseUrl } from "@/configs";

// TODO 后端说没有对应接口，发现已在项目中使用，先行注释
// export function fxUploadBase64 (data) {
//   return postJSON(
//     `${baseUrl}/common/oss/uploadBase64`, data
//   );
// }
//教学活动分页查询
export function teachActivityPage(params) {
  return get(
    `${baseUrl}/oto/teachActivity/page`, params
  );
}

export function teachActivityPageWithUuid(params) {
  return get(
    `${baseUrl}/oto/teachActivity/pageWithUuid`, params
  );
}
//教学活动列表查询
export function teachActivity(params) {
  return get(
    `${baseUrl}/oto/teachActivity/info/${params}`
  );
}

//教学活动列表删除
export function teachActivityRemove(data) {
  return postJSON(
    `${baseUrl}/oto/teachActivity/remove`, data
  );
}
//教学活动列表更新
// export function teachActivityUpdate (data) {
//   return postJSON(
//     `${baseUrl}/oto/teachActivity/update`, data
//   );
// }

//教学活动新增
export function teachActivityAdd(data) {
  return postJSON(
    `${baseUrl}/oto/teachActivity/add`, data
  );
}

//教学活动编辑
export function teachActivityUpdate(data) {
  return postJSON(
    `${baseUrl}/oto/teachActivity/update`, data
  );
}

//教学活动详情
export function teachActivityInfo(params) {
  return get(
    `${baseUrl}/oto/teachActivity/info/${params}`
  );
}

// 教学分组-分页获取列表
export function getTeachGroupPlan(params) {
  return get(
    `${baseUrl}/oto/teachGroupPlan`,
    params,
  );
}
export function getTeachGroupPlanInfo(id) {
  return get(
    `${baseUrl}/oto/teachGroupPlan/${id}`
  );
}
export function getTeachGroupAdd(params) {
  return postJSON(
    `${baseUrl}/oto/teachGroupPlan`,
    params,
  );
}
export function getTeachGroupEdit(params) {
  return put(
    `${baseUrl}/oto/teachGroupPlan`,
    params,
  );
}
export function getTeachGroupDel(id) {
  return del(
    `${baseUrl}/oto/teachGroupPlan/${id}`,
  );
}

// 教学素材-分页获取列表
export function getTeachFodderList(params) {
  return get(
    `${baseUrl}/oto/teachFodder/page`,
    params,
  );
}

// 教学素材-删除素材
export function removeTeachFodderList(data) {
  return postJSON(
    `${baseUrl}/oto/teachFodder/remove`,
    data,
  );
}

// 教学素材-添加素材
export function addTeachFodderList(data) {
  return postJSON(
    `${baseUrl}/oto/teachFodder/add`,
    data,
  );
}

// 教学素材-查看视频的上传状态
export function videoUploadStatus(params) {
  return get(
    `${baseUrl}/common/oss/videoUploadStatus`,
    params,
  );
}

// 教学素材-列表小章
export function listSmallChapter(params) {
  return get(
    `${baseUrl}/oto/teachFodder/listSmallChapter`,
    params,
  );
}

// 我的题库-获取题目列表
export function questionPage(params) {
  return get(
    `${baseUrl}/oto/question/page`,
    params,
  );
}

// 我的题库-删除题目
export function questionDelete(data) {
  return post(
    `${baseUrl}/oto/question/delete/${data}`,
  );
}

// 我的题库-添加题目
export function questionAdd(data) {
  return postJSON(
    `${baseUrl}/oto/question/add`, data
  );
}

// 我的题库-题目详情
export function questionDetail(params) {
  return get(
    `${baseUrl}/oto/question/detail/${params}`,
  );
}

// 我的题库-编辑题目
export function questionUpdata(data) {
  return postJSON(
    `${baseUrl}/oto/question/update`, data
  );
}


// 知识点-知识点列表(all)
// export function kpAll (params) {
//   return get(
//     `${baseUrl}schoolaffair/knowledgepoint/page`,params
//   );
// }

// 知识点-根据年级，学期，科目知识点列表
export function kpList(params) {
  return get(
    `${baseUrl}/schoolaffair/knowledgepoint/page`,
    params,
  );
}

