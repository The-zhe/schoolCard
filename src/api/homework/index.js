import { get, post, postJSON } from "@/axios";
import { baseUrl } from "@/configs";

//获取版本
export function getVersion() {
  return get(
    `${baseUrl}/admin/dict/type/teach_book_type`
  );
}
//获取学期
export function getSemester () {
    return get(
      `${baseUrl}/admin/dict/type/term_type`
    );
  }
  //获取年级
export function getGrades () {
    return get(
      `${baseUrl}/admin/dict/type/grade_type`
    );
  }
 //根据版本，年级，学期获取书本 
 export function getBooks (data) {
    return post(
      `${baseUrl}/schoolaffair/exercise/book/listBook`,data
    );
  }
 //获取页码
 export function getPage (data) {
    return post(
      `${baseUrl}/schoolaffair/exercise/book/getPageInfo`,data
    );
  }
 //获取该页码的题目
 export function getPageList (data) {
    return post(
      `${baseUrl}/schoolaffair/exercise/book/listPageTopic`,data
    );
  }