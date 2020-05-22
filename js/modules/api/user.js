/** 用户相关接口 */
import Config from 'react-native-config';
import request from '~/modules/services/request';
import { store } from '~/modules/redux-app-config';
import { getHeader, filterUrl } from '~/modules/services/utils';

const { API_URL } = Config;

// 获取用户信息
async function getUserInfo() {
  return request('/user/info', {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 重新获取用户信息（用户退出）
async function userLogout() {
  return request('/user/info', {
    method: 'GET',
    headers: {
      device: JSON.stringify({
        imei: `${store.getState().deviceInfo.uniqueId}`,
        platformId: '1', // TODO: 获取banner传0返回空数组
      }),
    },
  });
}

async function login(params) {
  return request('/user/login', {
    method: 'POST',
    body: params,
  });
}

async function logout(params) {
  return request('/user/logout', {
    method: 'POST',
    body: params,
    headers: getHeader(store),
  });
}

// 用户上传头像
async function uploadImg({ file }) {
  const formData = new FormData();
  const fileInfo = {
    uri: file.filePath,
    type: 'image/jpeg',
    name: 'image.jpg',
  };
  formData.append('upload', fileInfo);
  return request('/user/header/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      token: store.getState().userInfo.token,
    },
    body: formData,
  });
}

/**
 * 获取榜单数据
 * @params { page: 页数 | size: 大小 }
 */
async function getRankList(query) {
  const url = filterUrl(query);
  return request(`/rank/all?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

async function addWord(params) {
  return request('/word/add', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * 获取生词本
 */
async function getNewWords() {
  return request('/ebbinghaus/unknown', {
    method: 'GET',
    headers: getHeader(store),
  });
}

/*
 * @description: 用户修改密码
 * @param :
 * @return:
 */
async function userChangePwd(params) {
  return request('/user/password', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

// 意见反馈图片上传
async function feedBackUpload({ file }) {
  const formData = new FormData();
  const fileInfo = {
    uri: file.filePath,
    type: 'image/jpeg',
    name: 'image.jpeg',
  };
  formData.append('file', fileInfo);
  return request('/feedback/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      token: store.getState().userInfo.token,
    },
    body: formData,
  });
}

/**
 * @description: 用户意见反馈提交
 * @param :
 * @return:
 */
async function feedBackSubmit(params) {
  return request('/feedback/submit', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}
/**
 * @description: 修改用户基本信息
 * @param :
 * @return:
 */
async function userUpdate(params) {
  return request('/user/update', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * @description: 获取家长汇轮播图
 * @param : query {location: 3}
 */
async function getParentalBanner(query) {
  const url = filterUrl(query);
  return request(`/banner/location?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * @description: 购买记录
 * @param :
 * @return:
 */
async function getPurchasedListTrade(query) {
  const url = filterUrl(query);
  return request(`/purchased/list/trade?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * @description: 光荣榜 用户历史数据
 */
async function getRankHistory() {
  return request('/rank/history', {
    method: 'GET',
    headers: getHeader(store),
  });
}

/**
 * @description 发送短信验证码
 * @param {object} params { mobile: 手机号, sms_type: 短信类型 }
 */
async function sendSmsCode(params) {
  return request('/sms/send', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * @description 用户手机号短信验证码注册或登录
 * @param {object} params { mobile: 手机号, sms_type: 短信类型 }
 */
async function registerLogin(params) {
  return request('/user/register/login', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

async function checkRedeemCode(params) {
  return request('/redeem/check/code', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * 兑换码兑换会员
 *
 * @param {*} params
 * @returns
 */
async function redeemVip(params) {
  return request('/redeem/code', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

/**
 * V1版本H5中用户读书，思维导图课，AI分级阅读分享
 *
 * @param {*} params
 * @returns
 */
async function getShareInfo(query) {
  const url = filterUrl(query);
  return request(`/share/info?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}
/**
 * 获取轮播图
 *
 * @param {*} query
 * @returns
 */
async function getBanner(query) {
  const url = filterUrl(query);
  return request(`/banner/get?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}
/**
 * 获取商品列表
 *
 * @param {*} query
 * @returns
 */
async function getGoodsList(query) {
  const url = filterUrl(query);
  return request(`/member/get?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}
module.exports = {
  login,
  logout,
  getUserInfo,
  userLogout,
  addWord,
  uploadImg,
  getRankList,
  getNewWords,
  userChangePwd,
  feedBackUpload,
  feedBackSubmit,
  userUpdate,
  getPurchasedListTrade,
  getRankHistory,
  sendSmsCode,
  registerLogin,
  getParentalBanner,
  checkRedeemCode,
  redeemVip,
  getShareInfo,
  getBanner,
  getGoodsList,
};
