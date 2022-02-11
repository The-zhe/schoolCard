import { get, post, postJSON } from "@/axios";
import { baseUrl } from "@/configs";

export function teachFodderPage (params) {
  return get(
    `${baseUrl}/oto/teachFodder/page`,
    params,
  );
}


export function teachFodderRemove (params) {
  return postJSON(
    `${baseUrl}/oto/teachFodder/remove`,
    params,
  );
}

export function teachFodderAdd (params) {
  return postJSON(
    `${baseUrl}/oto/teachFodder/add`,
    params,
  );
}

export function teachFodderInfo (uuid) {
  return get(
    `${baseUrl}/oto/teachFodder/info/${uuid}`);
}


export function teachFodderActivityAdd (params) {
  return postJSON(
    `${baseUrl}/oto/teachFodder/activity/add`,
    params,
  );
}


export function teachFodderActivityRemove (params) {
  return postJSON(
    `${baseUrl}/oto/teachFodder/activity/remove`,
    params,
  );
}

export function teachFodderActivityUpate (params) {
  return postJSON(
    `${baseUrl}/oto/teachFodder/activity/update`,
    params,
  );
}