import { DeviceEventEmitter } from 'react-native';
import Toast from 'react-native-root-toast';
import _ from 'lodash';
import moment from 'moment';

/**
 * @description 校验用户是否具有阅读读书、单词宝等权限
 * @param {object} userInfo 用户个人信息
 * @param {function} navigation 路由
 * @param {string} redirectRouteName 重定向路由的名字
 * @param {object} redirectParams 重定向路由所需要的参数
 * @return {boolean} true表示用户已经登录并且购买过会员(会员未到期))
 */
function checkUserPermission(userInfo, navigation, redirectRouteName, redirectParams = {}) {
  if (!userInfo.user.mobile) {
    Toast.show('你还未登录，请登录', { position: Toast.positions.CENTER });
    // 判断用户是否登录
    navigation.navigate('pageRegister', {
      redirectRouteName,
      redirectParams,
      res: user => {
        if (user && user.user && user.user.is_member === 'false') {
          // 用户已经登录，但并未购买会员
          navigation.navigate('order');
        }
      },
    });
    return false;
  }
  if (userInfo.user.is_member === 'false') {
    Toast.show('你还未购买，请先购买吧', {
      position: Toast.positions.CENTER,
    });
    // 判断是否是会员
    navigation.navigate('order');
    return false;
  }
  return true;
}

/**
 * 校验用户阅读权限
 * @param {object} userInfo 用户信息 role = 3全年级会员 2 = 9.9会员
 * @param {object} book 图书信息
 * @param {number} lessonGrade 课程页选中的年级
 * @return {object} { status: 'success'可以阅读 'fail'不可阅读 | msg: 不可阅读原因 }
 */
function checkReadingPermission(userInfo, book, lessonGrade = -1) {
  const { is_free, grade, tag } = book;
  const { mobile, is_member, study_year, role, activity } = userInfo.user;
  if (is_free) {
    return { status: 'success' };
  }
  if (!mobile) {
    // 用户未登录
    return { status: 'fail', msg: 'VISITOR' };
  }
  if (is_member === 'false') {
    // 未付费会员
    return { status: 'fail', msg: 'NO_VIP' };
  }
  if (role === '3') {
    // 购买全年级高级会员
    return { status: 'success' };
  }
  if (role !== '3' && !grade.split(', ').includes(`K${study_year}`)) {
    // 单年级付费会员点击非该年级的收费项目时
    // if(lessonGrade > 0 && lessonGrade !== study_year) {
    //   return { status: 'fail', msg: 'NO_SUPER_VIP' };
    // }
    return { status: 'fail', msg: 'NO_SUPER_VIP' };
  }
  if (lessonGrade >= 0 && lessonGrade !== study_year) {
    // 课程页 单年级付费会员点击非该年级收费项目时
    return { status: 'fail', msg: 'NO_SUPER_VIP' };
  }
  // 限制9.9月卡会员只能浏览8本书
  if (role === '2' && _.toSafeInteger(tag) !== 1) {
    return { status: 'fail', msg: 'VIP9.9' };
  }
  return { status: 'success' };
}

/**
 * 校验用户单词宝使用权限
 * @param {object} userInfo 用户信息
 * @return {object} { status: 'success'可以阅读 'fail'不可阅读 | msg: 不可阅读原因 }
 */
function checkWorkLearnPermission(userInfo) {
  const { mobile, is_member } = userInfo.user;
  if (!mobile) {
    // 用户未登录
    return { status: 'fail', msg: 'VISITOR' };
  }
  if (is_member === 'true') {
    // 未付费会员
    return { status: 'success' };
  }
  // 未付费会员
  return { status: 'fail', msg: 'NO_VIP' };
}

/**
 * 发送事件给 ActionSheet
 * @param {object} params 参数
 */
function sendEvent2Sheet(params) {
  DeviceEventEmitter.emit('ActionSheet', params);
}

function getUserAge(birthday) {
  let age;
  const years = moment().diff(birthday, 'years');
  const months = moment().diff(birthday, 'months');
  if (months < 12) {
    age = `${months}个月`;
  } else if (months === 12) {
    age = '一岁';
  } else if (months > 12) {
    let month = months - years * 12;
    if (month > 0) {
      age = `${years}岁${month}个月`;
    }
  }
  return age;
}
module.exports = {
  checkUserPermission,
  checkReadingPermission,
  checkWorkLearnPermission,
  sendEvent2Sheet,
  getUserAge,
};
