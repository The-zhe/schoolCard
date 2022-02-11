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
 */

export function testPaper (params) {  //系统试卷查询
  return get(
    `${baseUrl}/oto/testPaper/page/sysPaperByBeike`, params
  );
}

export function myPaper (params) { //我的试卷查询
  return get(
    `${baseUrl}/oto/testPaper/page/myPaper`, params
  );
}


export function addPaper (data) {
  return postJSON(
    `${baseUrl}/oto/testPaper`, data
  );
}

export function paperQuestionList (data) {
  return get(
    `${baseUrl}/oto/testPaper/paperQuestionList/${data}`,
  );
}

export function systemQuestionList (data) {
  return get(
    `${baseUrl}/oto/testPaper/systemQuestionList/${data}`,
  );
}

export function questionAdd (data) {
  return postJSON(
    `${baseUrl}/oto/testPaper/question/add`, data
  );
}

export function questionDelete (data) {
  return del(
    `${baseUrl}/oto/testPaper​/removeQuestionById/${data}`,
  );
}

export function paperQuestion (params) {
  return get(
    `${baseUrl}/oto/testPaperTemplate/questionList/${params}`,
  );
}

export function KpsBySubject (params) {
  return get(
    `${baseUrl}/schoolaffair/knowledgePoint/KPTreeBySubject`, params,
  );
}

export function addTestPaper (params) { //添加试卷
  return get(
    `${baseUrl}/oto/testPaper`, params,
  );
}

export function includeMyPaper (data) { //系统试卷添加到我的试卷
  return get(
    `${baseUrl}/oto/testPaper/includeMyPaper/${data.id}/${data.teacherId}`,
  );
}

export function kpList (data) { //获取知识点列表
  return get(
    `${baseUrl}/oto/testPaper/kpList/${data.id}/${data.grade}/${data.subject}`,
  );
}

export function questionList (data) { //通过知识点id获取题目列表
  return get(
    `${baseUrl}/oto/testPaper/questionList/${data.id}/${data.grade}/${data.subject}`,
  );
}

export function addOrSaveTest (data) { //新增or保存我的试卷
  return postJSON(
    `${baseUrl}/oto/testPaper/addOrUpdateMyPaper`, data,
  );
}

export function testDetail (data) { //id查询试卷详情
  return get(
    `${baseUrl}/oto/testPaper/getTestAll/${data}`,
  );
}

export function removeQuestion (data) { //id删除题目
  return del(
    `${baseUrl}/oto/testPaper/removeQuestionById/${data}`,
  );
}

export function removeTest (data) { //id删除试卷
  return del(
    `${baseUrl}/oto/testPaper/remove/${data}`,
  );
}

export function downloadTest (data) { //通过试卷id下载试卷
  return get(
    `${baseUrl}/oto/testPaper/download/${data}`,
  );
}


//答题卡

export function answerCard (params) { //获取答题卡列表
  return get(
    `${baseUrl}/oto/testPaperTemplate/detail/${params}`,
  );
}

export function cardQuestionList (data) { //通过id查询答题卡题目
  return get(
    `${baseUrl}/oto/testPaperTemplate/getAll/${data.userId}/${data.id}`,
  );
}

export function saveAnswerCard (data) { //新增or保存答题卡+题目
  return postJSON(
    `${baseUrl}/oto/testPaperTemplate/saveAll`, data,
  );
}

export function deleteAnswerCard (data) { //删除答题卡
  return del(
    `${baseUrl}/oto/testPaperTemplate/${data}`,
  );
}

//在线批改
export function classListByTeacher (data) { //通过老师id查询相关的所有班级
  return get(
    `${baseUrl}/schoolaffair/clazz/clazzList/${data}`,
  );
}

export function onlineMark (data) { //在线批改分页查询
  return get(
    `${baseUrl}/oto/testPaperTemplate/onlineMark`, data,
  );
}

//班级
export function classDetail (data) { //班级详情
  return get(
    `${baseUrl}/schoolaffair/clazz/${data}`,
  );
}


//简易测验列表
export function simpleList (data) {
  return get(
    `${baseUrl}/oto/testPaperTemplate/simpleList`, data
  );
}

//简易测验添加答案
export function saveAnswer (data) {
  return postJSON(
    `${baseUrl}/oto/testPaperTemplate/saveAnswer`, data
  );
}


//简易测验详情
export function answerList (data) {
  return get(
    `${baseUrl}/oto/testPaperTemplate/answerList`, data
  );
}