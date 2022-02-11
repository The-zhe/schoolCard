import { get, post, postJSON } from "@/axios";
import { baseUrl } from "@/configs";


// 获取题库列表
export function questionPage(params) {
  return get(
    `${baseUrl}/oto/question/page`,
    params,
  );
}
// 获取系统知识点树
export function KPTree(params) {
  return get(
    `${baseUrl}/schoolaffair/knowledgePoint/KPTree`,
    params,
  );
}
// 获取我的题库知识点树
export const myTree = params => get(`${baseUrl}/schoolaffair/knowledgePoint/my`, params)

