import { get, post, postJSON } from "@/axios";
import { baseUrl } from "@/configs";

//获取老师所教年级列表
export function getGrades () {
  return get(
    `${baseUrl}/schoolaffair/teacher/grades`
  );
}
//获取老师对应年级课程
export function getCourses (id) {
  return get(
    `${baseUrl}/schoolaffair/teacher/courses?grade=${id}`
  );
}
//获取老师课程
export function teacherSubject (params) {
  return get(
    `${baseUrl}/schoolaffair/teacher/subject`,params
  );
}
//教材列表查询
export function getTeachbook (params) {
  return get(
    `${baseUrl}/schoolaffair/teachbook/list`, params
  );
}
//通过bookid查询章节
export function getChapter (id) {
  return get(
    `${baseUrl}/schoolaffair/teachbookchapter/book/${id}`
  );
}

//通过bookid查询章节
export function getChapterTree (id) {
  return get(
    `${baseUrl}/schoolaffair/teachbookchapter/chapterTree/${id}`
  );
}

export function getTeachSubject (params) {
  return get(
    `${baseUrl}/schoolaffair/teacher/subject`,params
  );
}