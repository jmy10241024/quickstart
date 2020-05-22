import Config from 'react-native-config';
import request from '~/modules/services/request';
import { store } from '~/modules/redux-app-config';
import { getHeader, filterUrl } from '~/modules/services/utils';

const { AMAP_API_URL, AMAP_WEBAPI_KEY, API_URL } = Config;

// 获取省列表
async function getProvince() {
  return request('/address/province', {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 获取城镇列表
async function getCity(payload) {
  const url = filterUrl(payload);
  return request(`/address/city?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 获取区县列表
async function getDistrict(payload) {
  const url = filterUrl(payload);
  return request(`/address/district?${url}`, {
    method: 'GET',
    headers: getHeader(store),
  });
}

// 地理编码
async function getGeocode(payload) {
  const params = payload;
  params.key = AMAP_WEBAPI_KEY;
  const url = filterUrl(params);
  return request(`${AMAP_API_URL}/geocode/regeo?${url}`, {
    method: 'GET',
  });
}

// 地理编码
async function getAssistant(payload) {
  const params = payload;
  params.key = AMAP_WEBAPI_KEY;
  const url = filterUrl(params);
  return request(`${AMAP_API_URL}/assistant/inputtips?${url}`, {
    method: 'GET',
  });
}

// 关键词查找行政区域
async function getKeyWordsDistrict(payload) {
  const params = payload;
  params.key = AMAP_WEBAPI_KEY;
  params.offset = 30;
  const url = filterUrl(params);
  return request(`${AMAP_API_URL}/config/district?${url}`, {
    method: 'GET',
  });
}

module.exports = {
  getProvince,
  getCity,
  getDistrict,
  getGeocode,
  getAssistant,
  getKeyWordsDistrict,
};
