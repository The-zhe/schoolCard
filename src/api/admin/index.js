import { get, post, postJSON, put, del } from "@/axios";
import { baseUrl } from "@/configs";


/**
 * type
 * term_type:上下学期
 * primary_course_type:小学学科
 * middle_course_type:初中学科
 * high_course_type:高中学科
 * teach_book_type:教材版本
 * grade_type:年级
 * school_type:学校类型
 * year_type:年份
 * area_type:地区
 * test_type:试卷类型
 * file_type:文件类型
 */

export function dictType (type) {
  return get(
    `${baseUrl}/admin/dict/type/${type}`,
  );
}


export function getFILE_URL () {
  return get(
    `${baseUrl}/admin/param/publicValue/FILE_URL`,
  );
}

export function getPreviewUrl (params) {
  return get(
    `${baseUrl}/admin/sys-file/getPreviewUrl`,
    params
  );
}

export function getRecord (params) {
  return get(
    `${baseUrl}/oto/teachPlan/getRecord`,
    params
  );
}

export function cancelSave (params) {
  return post(
    `${baseUrl}/oto/teachPlan/cancelSave`,
    params
  );
}

export function saveTeachPlan (params) {
  return post(
    `${baseUrl}/oto/teachPlan/saveTeachPlan`,
    params
  );
}

export function allRead (params) {
  return post(
    `${baseUrl}/oto/teachPlan/allRead`,
    params
  );
}
