/** 支付相关接口 */
import Config from 'react-native-config';
import request from '~/modules/services/request';
import { store } from '~/modules/redux-app-config';
import { getHeader, filterUrl } from '~/modules/services/utils';
const { API_URL } = Config;

// 创建 oppo 订单
async function oppoInit(payload) {
  const url = filterUrl(payload);
  return request(`/pay/oppo/init?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 获取订单状态
async function getPayStatus(payload) {
  const url = filterUrl(payload);
  return request(`/pay/status?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 取消订单
async function cancelPay(params) {
  return request('/pay/cancel', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: getHeader(store),
  });
}

// 创建支付宝订单
async function alipayInit(payload) {
  const url = filterUrl(payload);
  return request(`/pay/alipay/sign?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 创建微信订单
async function wechatInit(payload) {
  const url = filterUrl(payload);
  return request(`/pay/wechat/sign?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

module.exports = {
  oppoInit,
  getPayStatus,
  cancelPay,
  alipayInit,
  wechatInit,
};
