/** 单词宝相关接口 */

import Config from 'react-native-config';
import request from '~/modules/services/request';
import { store } from '~/modules/redux-app-config';
import { getHeader, filterUrl } from '~/modules/services/utils';

const { API_URL } = Config;

/**
 * 获取年级详情，单元列表和进度，单元内小课列表和进度
 * @param {object} query { grade_id: 年级id, term_id: 学期id 1代表上学期 2代表下学期 }
 */
async function getGradeDetail(query) {
  const url = filterUrl(query);
  return request(`/school/grade/detail?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 获取学习信息
 * @param {object}} query { option_id: 小课种类ID }
 */
async function getOptionStudy(query) {
  const url = filterUrl(query);
  return request(`/school/option/study?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 更新学习进度
 * @param {object} params
 */
async function updateStudyRecord(params) {
  return request('/school/option/study/record', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * 获取单词宝练习题
 * @param {object}} query { option_id: 小课种类ID, lesson_id: 课程ID }
 */
async function getOptionPractice(query) {
  const url = filterUrl(query);
  return request(`/exam/practice?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 上传用户练习进度
 * @param {object} params
 */
async function uploadPractice(params) {
  return request('/school/option/question/record', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * 获取学校阅读信息
 * @param {object}} query { lesson_id: 课程ID }
 */
async function getLessonBook(query) {
  const url = filterUrl(query);
  return request(`/school/lesson/book?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 阅读完成后，更新学习进度
 * @param {object} params
 */
async function uploadBookRecord(params) {
  return request('/school/option/book/record', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * 获取学校阅读信息
 * @param {object}} query { lesson_id: 课程ID, unit_id: 单元ID }
 */
async function getLessonReport(query) {
  const url = filterUrl(query);
  return request(`/school/lesson/report?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 获取考试题目列表
 * @param {object}} query { lesson_id: 课程ID, option_id: 小课种类ID }
 */
async function getExamQuestions(query) {
  const url = filterUrl(query);
  return request(`/exam/questions?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 上报考试答案
 * @param {object} params
 */
async function uploadReportAnswer(params) {
  return request('/exam/reportanswer', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * 结束考试
 * @param {object} params
 */
async function finishExam(params) {
  return request('/exam/finish', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * 重新考试
 * @param {object}} query { exam_id: 考试ID }
 */
async function restartExam(query) {
  const url = filterUrl(query);
  return request(`/exam/restart?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 获取考试成绩列表
 * @param {object}} query { option_id: 小课种类 }
 */
async function getExamList(query) {
  const url = filterUrl(query);
  return request(`/exam/scorelist?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 获取考试成绩详情
 * @param {object}} query { option_id: 小课种类 }
 */
async function getExamDetail(query) {
  const url = filterUrl(query);
  return request(`/exam/scoredetail?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 获取单元的单词表
 * @param {object}} query { unit_id: 单元ID }
 */
async function getUnitWords(query) {
  const url = filterUrl(query);
  return request(`/school/unit/study?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 获取定级测试题目列表
async function getRatingTest(query) {
  const url = filterUrl(query);
  return request(`/exam/entry?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 提交定级测试结果并获取推荐级别
async function postRatingResult(params) {
  return request('/exam/entry/finish', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

module.exports = {
  getGradeDetail,
  getOptionStudy,
  updateStudyRecord,
  getOptionPractice,
  uploadPractice,
  getLessonBook,
  uploadBookRecord,
  getLessonReport,
  getExamQuestions,
  uploadReportAnswer,
  finishExam,
  restartExam,
  getExamList,
  getExamDetail,
  getUnitWords,
  getRatingTest,
  postRatingResult,
};
