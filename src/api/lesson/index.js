import { get, post, postJSON } from "@/axios";
import { baseUrl } from "@/configs";

// export function toLogin (data) {
//   return postJSON(
//     `${baseUrl}/user/login/accountLogin`,
//     data
//   );
// }
export default {
  getPlanList (params) {
    return get(`${baseUrl}/oto/teachPlan/page`,
      params);
  },
  getSmallCapter (params, url) {
    return get(`${baseUrl}${url}`,
      params);
  },
  teachPlanAdd (params) {
    return postJSON(
      `${baseUrl}/oto/teachPlan/add`,
      params,
    );
  },
  teachPlanRemove (params) {
    return postJSON(
      `${baseUrl}/oto/teachPlan/remove`,
      params,
    );
  },
  teachPlanInfo (uuid) {
    return get(
      `${baseUrl}/oto/teachPlan/info/${uuid}`);
  },
  teachPlanUpdate (params) {
    return postJSON(
      `${baseUrl}/oto/teachPlan/update`,
      params,
    );
  },
  getSendTeacher (params) {
    return get(
      `${baseUrl}/oto/teachPlan/getSendTeacher`,
      params,
    );
  },
  saveRecord (params) {
    return get(
      `${baseUrl}/oto/teachPlan/saveRecord`,
      params,
    );
  },
  getTeachPlanUuid () {
    return post(
      `${baseUrl}/oto/teachPlan/uuid`,

    );
  },
}