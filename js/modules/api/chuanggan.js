/** rosen创感相关接口 */
import Config from 'react-native-config';
import request from '~/modules/services/request';
import { store } from '~/modules/redux-app-config';
import { getHeader, filterUrl } from '~/modules/services/utils';

const { CHUANGGAN_API_URL } = Config;

// 上传埋点信息
async function track(params) {
  return request(`${CHUANGGAN_API_URL}/rosen/admin/report`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

module.exports = {
  track,
};
