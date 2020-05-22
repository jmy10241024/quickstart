/** 数据埋点 */
import _ from 'lodash';
import moment from 'moment';
import Config from 'react-native-config';
import { store, dispatch } from '~/modules/redux-app-config';
import Global from '~/modules/global';

function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

class EventTracking {
  /**
   * 定义所有事件类型
   * 前两位 (01) 表示用户相关
   * (02) 表示图书相关
   */
  types = {
    t0101: 'user_active_log', // 用户活跃日志
    t0102: 'user_sign', // 用户签到
    t0103: 'user_share', // 用户分享
    t0104: 'user_book', // 用户读书记录
    t0105: 'user_point', // 埋点基础表
  };

  /**
   * 定义所有活跃功能
   * (01) 表示课程相关
   * (02) 表示图书相关
   * (03) 表示学习相关
   * (04) 表示家长汇相关
   * (05) 表示支付相关
   */
  reqNames = {
    r0101: '去读书',
    r0102: 'BANNER1',
    r0103: 'BANNER2',
    r0104: 'BANNER3',
    r0105: '免费图书1',
    r0106: '免费图书2',
    r0107: '免费图书3',
    r0108: '免费图书4',
    r0109: '免费图书5',
    r0110: '付费图书1',
    r0111: '课程单词学习宝',
    r0121: '年级选择: 一年级',
    r0122: '年级选择: 二年级',
    r0123: '年级选择: 三年级',
    r0124: '年级选择: 四年级',
    r0125: '年级选择: 五年级',
    r0126: '年级选择: 六年级',
    r0130: '授予手机存储读写权限',
    r0131: '授予手机设备信息读取',
    r0132: '授予录音权限',
    r0133: '进入测试',
    r0134: '先用用看',
    r0135: '活动浮动弹窗',
    r0136: '活动购买按钮',
    r0201: '图书会员',
    r0202: '收藏',
    r0301: '每天坚持读两本书',
    r0302: '学习-单词学习宝',
    r0501: '支付-了解更多',
    r0502: '支付-已购买',
    r0503: '支付-年级月卡',
    r0504: '支付-年级月卡支付',
    r0505: '支付-年级年卡',
    r0506: '支付-年级年卡支付',
    r0507: '支付-畅学年卡',
    r0508: '支付-畅学年卡支付',
    r0509: '支付-联系客服',
  };

  /**
   * 发送埋点数据
   * @param {string} type 事件类型 id
   * @param {string} reqName 活跃功能 id
   * @param {object} params 参数
   * @param {string} requestId
   */
  track(type = '', reqName = '', params = {}, requestId = '') {
    const body = {};
    body.type = this.types[type];
    body.data = {
      id: requestId || guid(),
      userId: store.getState().userInfo.user_id,
      channel: Config.CHANNEL || 'unknow',
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      isTest: Global.getEnv() === 'PROD',
      ...params,
    };
    if (reqName && type !== 't0105') {
      body.data.reqName = this.reqNames[reqName];
    }

    if (type === 't0105' || type.type === 't0105') {
      body.data.regDate = moment(store.getState().userInfo.user.created).format(
        'YYYY-MM-DD HH:mm:ss',
      );

      body.data.pointType = this.reqNames[reqName];
      body.data.pointName = this.reqNames[reqName];
      // }
    }
    body.data = JSON.stringify(body.data).replace(/\"/g, "'");
    dispatch('TRACK', body);
  }
}

export default new EventTracking();
