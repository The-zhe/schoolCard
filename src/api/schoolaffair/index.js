import {
  get,
  post,
  postJSON,
  put,
  del
} from "@/axios";
import {
  baseUrl
} from "@/configs";

export function getTeacherByUser () {
  return get(
    `${baseUrl}/schoolaffair/teacher/getTeacherByUser`,
  );
}

export function teacherRelated (teacherId) {
  return get(
    `${baseUrl}/schoolaffair/clazz/teacherRelated/${teacherId}`,
  );
}

export function clazzAndCourse (params) {
  return get(
    `${baseUrl}/schoolaffair/teachbook/clazzAndCourse`, params
  );
}

export function getTeachbookchapter (bookid) {
  return get(
    `${baseUrl}/schoolaffair/teachbookchapter/book/${bookid}`
  );
}

export function getTeachchapter (id) {
  return get(
    `${baseUrl}/schoolaffair/teachbookchapter/${id}`
  );
}

export function gradeAndCourse (params) {
  return get(
    `${baseUrl}/schoolaffair/teachbook/gradeAndCourse`, params
  );
}

export function studenthomework (params) {
  return get(
    `${baseUrl}/schoolaffair/homework/pageByRequireByRelease`, params
  );
}

// export function homeworkDetail (params) {
//   return get(
//     `${baseUrl}/schoolaffair/studenthomework/pageByHomeWorkId`,params
//   );
// }

export function stuhomeworkDetail (params) {
  return get(
    `${baseUrl}/schoolaffair/studenthomework/${params}`,
  );
}

export function homeworkQuestion (params) {
  return get(
    `${baseUrl}/schoolaffair/homework/question/getQuestion`, params,
  );
}


export function questionErrorRank (params) {
  return get(
    `${baseUrl}/schoolaffair/homework/getQuestionErrorRanking`, params,
  );
}

export function SynthesisScoreDistribute (params) {
  return get(
    `${baseUrl}/schoolaffair/homework/getSynthesisScoreDistribute`, params,
  );
}

export function recallHomework (params) {
  return put(
    `${baseUrl}/schoolaffair/homework/recall?id=${params}`,
  );
}

export function homeworkDetail (params) {
  return get(
    `${baseUrl}/schoolaffair/studenthomework/commitDetail`, params,
  );
}


// 课上作业

export function classRecord (params) {
  return get(
    `${baseUrl}/oto/classRecord/page`, params,
  );
}

export function detailPage (params) {
  return get(
    `${baseUrl}/oto/classRecord/detailPage`, params,
  );
}

export function errorPage (params) { //错题排行
  return get(
    `${baseUrl}/oto/classRecord/errorPage`, params,
  );
}

export function masterPage (params) { //未听懂排行
  return get(
    `${baseUrl}/oto/classRecord/masterPage`, params,
  );
}

export function rightPage (params) { //正确率排行
  return get(
    `${baseUrl}/oto/classRecord/rightPage`, params,
  );
}

export function answerDetail (params) { //学生答题情况
  return get(
    `${baseUrl}/oto/classRecord/answerDetail`, params,
  );
}

export function stuHomeworkType (data) { //批改--获取题型
  return post(
    `${baseUrl}/schoolaffair/homework/questionList`, data,
  );
}

export function stuHomeworkInfo (data) { //批改--根据id获取作业
  return post(
    `${baseUrl}/schoolaffair/homework/commitDetail`, data,
  );
}

export function nextStudent (params) { //批改--根据id获取下一个学生
  return get(
    `${baseUrl}/schoolaffair/studenthomework/getNextStudent`, params,
  );
}

export function commitTeacher (data) { //批改--提交
  return post(
    `${baseUrl}/schoolaffair/homework/correct`, data
  );
}
export function cardList (data) { //作业答题卡
  return post(
    `${baseUrl}/schoolaffair/homework/templateQuestionList`, data
  );
}




// 布置作业

export function makeHomework (params) {
  return get(
    `${baseUrl}/schoolaffair/homework/pageByRequireBySave`, params,
  );
}

export function saveHomework (params) {
  return postJSON(
    `${baseUrl}/schoolaffair/homework/saveTemplate`, params,
  );
}

export function releaseHomework (data) {
  return postJSON(
    `${baseUrl}/schoolaffair/homework/releaseTemplate`, data,
  );
}

export function classWorkDetail (params) {
  return get(
    `${baseUrl}/schoolaffair/homework/getInfo/${params}`,
  );
}

export function removeWork (params) {
  return get(
    `${baseUrl}/schoolaffair/homework/remove/${params}`,
  );
}

export function homeWorkDeatil (params) {
  return get(
    `${baseUrl}/schoolaffair/homework/getInfoHomework?homeworkId=${params}`,
  );
}

export function homeWorkCardDeatil (params) {
  return get(
    `${baseUrl}/schoolaffair/homework/getInfoAnswerSheet?homeworkId=${params}`,
  );
}

export function cardParse (params) { //解题思路详情
  return get(
    `${baseUrl}/schoolaffair/homework/getAnalysisList?templateQuestionId=${params}`,
  );
}

// 教学反思
export function teachReflect (data) { //新增教学反思
  return postJSON(
    `${baseUrl}/oto/classplan/addReflection`, data
  );
}
export function editTeachReflect (data) { //编辑教学反思
  return get(
    `${baseUrl}/oto/classplan/getInfo/${data}`,
  );
}
export function clazzListReflect (params) { //教案-年级
  return get(
    `${baseUrl}/oto/teachFodder/permission/listGradeByTeacher?teacherId=${params}`,
  )
}
export function courseListReflect (params) { //教案-科目
  return get(
    `${baseUrl}/oto/teachFodder/permission/listCourseByTeacher?teacherId=${params}`,
  )
}
export function reflectList (params) { //教案列表
  return get(
    `${baseUrl}/oto/teachPlan/listTeachPlan`, params
  )
}
export function reflectDeatil (params) { //教案列表
  return get(
    `${baseUrl}/oto/teachPlan/planInfo/${params}`,
  )
}
export function haveReflectDeatil (paramsUuid, paramsRoomId) { //教学反思，有反思
  return get(
    `${baseUrl}/oto/teachPlan/planInfoReflection/${paramsUuid}/${paramsRoomId}`
  )
}
export function reflectPlanlist (params) { //教案反思列表
  return get(
    `${baseUrl}/oto/classplan/listReflection`, params
  )
}
export function reflectClasslist (params) { //教案班级列表
  return get(
    `${baseUrl}/oto/classplan/listClassNo?uuid=${params}`,
  )
}
export function reviewlist (params) { //教案点评列表
  console.log(params)
  return get(
    `${baseUrl}/oto/classplanreview/reviewPage`, params
  )
}
export function addReview (data) { //新增教案点评
  return postJSON(
    `${baseUrl}/oto/classplanreview/addReview`, data
  )
}
export function deleteReview (params) { //删除教案点评
  return get(
    `${baseUrl}/oto/classplanreview/delete/${params}`,
  )
}

//班级

export function classList (params) {
  return get(
    `${baseUrl}/schoolaffair/clazz/clazzList/${params}`,
  );
}


export function classDetail (params) {
  return get(
    `${baseUrl}/schoolaffair/clazz/${params}`,
  );
}

//老师
export function teacherDetail (id) {
  return get(
    `${baseUrl}/schoolaffair/teacher/${id}`
  );
}

export function editAnalysis (params) {
  return postJSON(
    `${baseUrl}/schoolaffair/homework/editAnalysis`, params,
  );
}