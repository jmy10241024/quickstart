/** 学习页相关接口 */
import Config from 'react-native-config';
import request from '~/modules/services/request';
import { store } from '~/modules/redux-app-config';
import { getHeader, filterUrl } from '~/modules/services/utils';

import _ from 'lodash';

const { API_URL } = Config;

/**
 * 获取可以领取的积分
 */
async function getCheckInReceive() {
  return request('/checkin/canReceive', {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 打卡
 * @param {object} params
 */
async function checkInDaily(params) {
  return request('/checkin/daily', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * 获取积分日历
 */
async function getCheckInCalendar() {
  return request('/checkin/calendar', {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * 获取打卡日历
 * @params { yarn: 年 | month: 月 }
 */
async function getCheckInRecord(query) {
  const url = filterUrl(query);
  return request(`/checkin/record?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * @description: 获取学习周报数据
 * @params { week: 传入一年中第几周,不传默认当前周}
 */
async function getWeekReport(query) {
  const url = filterUrl(query);
  return request(`/learn/week/report?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * @description: 获取学习周报数据
 * @param : {day 日期 选中的日期 例如2019-08-05}
 */
async function getDailyReport(query) {
  const url = filterUrl(query);
  return request(`/learn/daily/report?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * @description: 获取累计学习报告
 */
async function getAllReport() {
  return request('/learn/report', {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * @description: 用户gps词汇学习概况
 */
async function getGpsWordLearnInfo() {
  return request(`${_.replace(API_URL, 'v1', 'v2')}/gps/word/learn/info`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * @description: 用户词汇学习单词列表
 */
async function gpsWordList(query) {
  const url = filterUrl(query);
  return request(`/gps/word/list?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

module.exports = {
  getCheckInReceive,
  checkInDaily,
  getCheckInCalendar,
  getCheckInRecord,
  getWeekReport,
  getDailyReport,
  getAllReport,
  getGpsWordLearnInfo,
  gpsWordList,
};
