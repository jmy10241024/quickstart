/** 图书相关接口 */
import Config from 'react-native-config';
import request from '~/modules/services/request';
import { store } from '~/modules/redux-app-config';
import { getHeader, filterUrl } from '~/modules/services/utils';

const { API_URL } = Config;

// 获取年级图书列表
async function getBookShelf(payload) {
  const url = filterUrl(payload);
  return request(`/book/list/byGrade?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 获取图书详情
async function getBookDetail(query) {
  const url = filterUrl(query);
  return request(`/book/detail?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 获取单词详情
async function getWordDetail(payload) {
  const url = filterUrl(payload);
  return request(`/word/detail?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 获取图书最近读书人数
async function getBookReadNumber(query) {
  const url = filterUrl(query);
  return request(`/book/read/number?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

async function scoreAudio({ query, file }) {
  const formdata = new FormData();
  formdata.append('upload', {
    uri: file.filePath,
    name: 'recording.aac',
    type: 'multipart/form-data',
  });
  const url = filterUrl({
    ...query,
    model: 'kid4to14',
    format: 'mp3',
    encode: 'byte',
    way: 1,
    read_version: 1,
  });
  return request(`/recognize?${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      token: store.getState().userInfo.token,
    },
    body: formdata,
  });
}

// 图书阅读进度上报
async function uploadReadingProgress(params) {
  return request('/book/reading', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

async function getBookQuiz(payload) {
  const url = filterUrl(payload);
  return request(`/quiz/list?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

async function uploadQuizResult(body) {
  return request('/quiz/result', {
    method: 'POST',
    headers: getHeader(store),
    body: JSON.stringify(body),
  });
}

async function getBookPoster(query) {
  const url = filterUrl(query);
  return request(`/book/poster?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

async function searchBook(query) {
  const url = filterUrl(query);
  return request(`/book/search?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

async function addFavourite(query) {
  const url = filterUrl(query);
  return request(`/book/addFavourite?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

async function removeFavourite(query) {
  const url = filterUrl(query);
  return request(`/book/remFavourite?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

async function getFavouriteList() {
  return request('/book/favouriteList', {
    method: 'GET',
    headers: getHeader(store),
  });
}

module.exports = {
  getBookShelf,
  getBookDetail,
  getBookReadNumber,
  getWordDetail,
  scoreAudio,
  uploadReadingProgress,
  getBookQuiz,
  uploadQuizResult,
  getBookPoster,
  searchBook,
  addFavourite,
  removeFavourite,
  getFavouriteList,
};
