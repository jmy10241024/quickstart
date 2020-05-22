import { Image, Alert } from 'react-native';
import { call, put, takeEvery, all } from 'redux-saga/effects';
import Toast from 'react-native-root-toast';
import AudioManager from '~/modules/services/audio-manager';
import { parseSentence, imageResizeWithWidth } from '~/modules/services/utils';
import i18n from '~/i18n';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import api from '~/modules/api';
import UI from '~/modules/UI';

export function* getUserInfo(actions) {
  const res = yield call(api.getUserInfo);
  if (res && res.msg === 'Success') {
    yield put({ type: 'UPDATE_USER', payload: { user: res.result } });
  }
  const { payload = {} } = actions;
  payload.callback && payload.callback(res);
}

export function* userLogin(actions) {
  const res = yield call(api.getUserInfo);
  if (res && res.msg === 'Success') {
    yield put({ type: 'UPDATE_USER', payload: { user: res.result } });
  }
  actions.callback && actions.callback();
}

// 用户退出登录
export function* userLogOut(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.userLogout, payload);
  if (res && res.msg === 'Success') {
    yield put({ type: 'UPDATE_USER', payload: { user: res.result } });
  }
  payload.res && payload.res(res);
}

export function* getBookShelf(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getBookShelf, payload);
  const msg = (res && res.msg) || 'fail';
  if (msg !== 'Success') {
    payload.callback && payload.callback(msg);
    return;
  }
  const { book_hosts, book_list } = res.result;

  // let newResult = res.result;
  // let resList =
  //   payload.is_member === 'true' ? res.result.book_list : _.drop(res.result.book_list, 6);
  // newResult.book_list = resList;
  if (!book_list || !book_hosts) {
    payload.callback && payload.callback(msg);
    return;
  }
  // yield call(async () => {
  //   for (let i = 0; i < book_list.length; i++) {
  //     const img = await new Promise((res, rej) =>
  //       Image.getSize(
  //         `${book_hosts.book_cover}${book_list[i].cover}`,
  //         (width, height) => {
  //           res({ width, height });
  //         },
  //         rej,
  //       ),
  //     );
  //     const imgWidth = UI.scaleSize(98);
  //     let imgHeight = imgWidth;
  //     if (img) {
  //       imgHeight = (imgWidth * img.height) / img.width;
  //     }
  //     book_list[i].imgWidth = imgWidth;
  //     book_list[i].imgHeight = imgHeight;
  //     book_list[i].coverUrl = `${book_hosts.book_cover}${book_list[i].cover}`;
  //   }
  // });
  yield put({
    type: payload.isRefresh ? 'REFRESH_SHELF' : 'UPDATE_SHELF',
    payload: { result: res.result },
  });
  payload.callback && payload.callback(msg);
}

export function* getLessonBookList(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getBookShelf, payload);
  const msg = (res && res.msg) || 'fail';
  if (msg !== 'Success') {
    payload.callback && payload.callback(msg);
    return;
  }
  const { book_hosts, book_list } = res.result;
  if (!book_list || !book_hosts) {
    payload.callback && payload.callback(msg);
    return;
  }
  yield put({
    type: 'UPDATE_LOCAL_SHELF',
    payload: { result: res.result },
  });
  payload.callback && payload.callback(msg);
}

export function* getBookDetail(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getBookDetail, payload);
  if (!res || (res && res.msg !== 'Success')) {
    payload.res && payload.res({});
    return Toast.show(i18n.t('warn.error'));
  }
  const { pack_url: packUrl, image } = res.result.book;
  // if (!packUrl) {
  //   payload.res && payload.res({});
  //   return Toast.show('没权限');
  // }
  let fileName;
  let downloadUrl;
  if (packUrl) {
    fileName = packUrl.split('/')[2].replace('.zip', '');
    downloadUrl = `${res.result.book_hosts.book_pack}${packUrl}`;
  } else {
    fileName = `book_${payload.book_id}`;
    downloadUrl = `http://reading-oss.dubaner.com/book/zip/book_${payload.book_id}.zip`;
  }
  payload.res &&
    payload.res({
      ...res.result.book,
      fileName,
      downloadUrl,
      imageUrl: `${res.result.book_hosts.book_cover}${image}`,
    });
  return true;
}

export function* getWordDetail(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getWordDetail, payload);
  payload.callback && payload.callback(res);
}

// 获取图书最近读书人数
export function* getBookReadNumber(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getBookReadNumber, payload);
  if (res && res.msg !== 'Success') {
    payload.res && payload.res({});
    return Toast.show(i18n.t('warn.error'));
  }
  payload.res && payload.res(res.result);
  return true;
}

export function* scoreAudio(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.scoreAudio, payload);
  if (!res || (res && res.msg !== 'Success')) {
    payload.callback && payload.callback();
    return Alert.alert(i18n.t('warn.error'));
  }
  const score = parseInt(res.result.score);
  if (score < 30) {
    AudioManager.misread();
  } else if (score >= 80) {
    AudioManager.scoreHigh();
  } else {
    AudioManager.scoreLow();
  }
  const { words, result } = res.result;
  const { compl, fluency, nativ } = result;
  const fontsResult = parseSentence(words);
  payload.callback &&
    payload.callback({
      score,
      isRejected: parseInt(score) < 30,
      fontsResult,
      quality: {
        score,
        compl,
        fluency,
        nativ,
      },
    });
  return 1;
}

export function* addWord(actions) {
  const { payload } = actions;
  const res = yield call(api.addWord, payload);
  payload.res && payload.res(res);
}

// 图书阅读进度上报
export function* uploadReadingProgress(actions) {
  const { payload } = actions;
  const res = yield call(api.uploadReadingProgress, payload);
  payload.res && payload.res(res);
}

// 获取图书习题
export function* getBookQuiz(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getBookQuiz, payload);
  payload.callback && payload.callback(res);
}

export function* uploadQuizResult(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.uploadQuizResult, payload);
  if (res && res.msg === 'Success') {
    payload.res && payload.res(true);
  } else {
    payload.res && payload.res(false);
  }
}

export function* getBookPoster(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getBookPoster, payload);
  payload.res && payload.res(res);
}

export function* getBookSearch(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.searchBook, payload);
  yield call(imageResizeWithWidth, {
    res,
    width: UI.scaleSize(98),
  });
  payload.res && payload.res(res);
}

export function* addFavourite(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.addFavourite, payload);
  payload.res && payload.res(res);
}

export function* removeFavourite(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.removeFavourite, payload);
  payload.res && payload.res(res);
}

export function* getFavouriteList(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getFavouriteList, payload);
  const data = yield call(imageResizeWithWidth, {
    res,
    width: UI.scaleSize(98),
  });
  payload.res && payload.res(res);
}

// 获取年级详情列表（单词宝列表）
export function* getGradeDetail(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getGradeDetail, payload);
  if (res && res.msg !== 'Success') {
    payload.res && payload.res(res);
    return;
  }
  const { unit_list: unitList } = res.result.grade_detail;
  const data = [];

  unitList.forEach(unit => {
    const { name: unitName, id: unitId, grade_id: gradeId, term, lesson_list: lessonList } = unit;
    lessonList.forEach(lesson => {
      const {
        id: lessonId,
        name: lessonName,
        option_list: optionList,
        over,
        over_steps: overSteps,
        steps,
        current,
      } = lesson;
      const isUnitTest = lessonName === '期中考试' || lessonName === '期末考试';
      data.push({
        unitName,
        unitId,
        gradeId,
        term,
        lessonId,
        lessonName,
        optionList: isUnitTest
          ? [{ ...optionList[0], name: '考试' }, { ...optionList[0], name: '成绩' }]
          : optionList,
        over,
        current,
        isUnitTest,
        overSteps,
        steps,
      });
    });
  });
  res.result.data = data;
  payload.res && payload.res(res);
}

// 获取学习信息
export function* getOptionStudy(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getOptionStudy, payload);
  if (res && res.msg !== 'Success') {
    payload.res && payload.res(res);
    return;
  }
  payload.res && payload.res(res);
}

// 上传学习进度
export function* updateStudyRecord(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.updateStudyRecord, payload);
}

// 获取练习题目列表
export function* getOptionPractice(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getOptionPractice, payload);
  payload.res && payload.res(res);
}

// 上传用户练习进度
export function* uploadPractice(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.uploadPractice, payload);
  payload.res && payload.res(res);
}

// 获取学校阅读信息
export function* getLessonBook(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getLessonBook, payload);
  payload.res && payload.res(res);
}

// 阅读完成后，更新学习进度
export function* uploadBookRecord(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.uploadBookRecord, payload);
  payload.res && payload.res(res);
}

// 练习后，获取小课分享
export function* getLessonReport(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getLessonReport, payload);
  payload.res && payload.res(res);
}

// 获取考试题目列表
export function* getExamQuestions(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getExamQuestions, payload);
  if (res && res.msg === 'Success') {
    yield put({
      type: 'UPDATE_EXAM_QUESTIONS',
      payload: res.result,
    });
    payload.res && payload.res(res);
  }
}

// 上报考试答案
export function* uploadReportAnswer(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.uploadReportAnswer, payload);
  payload.res && payload.res(res);
}

// 结束考试
export function* finishExam(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.finishExam, payload);
  payload.res && payload.res(res);
}

// 重新考试
export function* restartExam(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.restartExam, payload);
  payload.res && payload.res(res);
}

// 成绩列表
export function* getExamList(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getExamList, payload);
  payload.res && payload.res(res);
}

// 成绩详情
export function* getExamDetail(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getExamDetail, payload);
  payload.res && payload.res(res);
}

// 家长汇轮播图
export function* getParentalBanner(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getParentalBanner, payload);
  payload.res && payload.res(res);
}

// 获取单元单词表
export function* getUnitWords(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getUnitWords, payload);
  payload.res && payload.res(res);
}

// 获取可以领取的积分
export function* getCheckInReceive(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getCheckInReceive, payload);
  payload.res && payload.res(res);
}

// 打卡
export function* checkInDaily(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.checkInDaily, payload);
  payload.res && payload.res(res);
}

// 获取积分日历
export function* getCheckInCalendar(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getCheckInCalendar, payload);
  payload.res && payload.res(res);
}

// 打卡日历
export function* getCheckInRecord(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getCheckInRecord, payload);
  payload.res && payload.res(res);
}

// 用户上传头像
export function* uploadImg(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.uploadImg, payload);
  payload.res && payload.res(res);
}

// 获取榜单数据
export function* getRankList(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getRankList, payload);
  payload.res && payload.res(res);
}
// 获取学习周报数据
export function* getWeekReport(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getWeekReport, payload);
  payload.res && payload.res(res);
}

// 获取学习日报数据
export function* getDailyReport(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getDailyReport, payload);
  payload.res && payload.res(res);
}

// 用户修改密码
export function* userChangePwd(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.userChangePwd, payload);
  payload.res && payload.res(res);
}

// 意见反馈图片上传
export function* feedBackUpload(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.feedBackUpload, payload);
  payload.res && payload.res(res);
}

// 用户意见反馈提交
export function* feedBackSubmit(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.feedBackSubmit, payload);
  payload.res && payload.res(res);
}

// 修改用户基本信息
export function* userUpdate(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.userUpdate, payload);
  if (res && res.msg === 'Success') {
    yield put({ type: 'UPDATE_USER', payload: { user: res.result } });
  }
  payload.res && payload.res(res);
}

// 获取生词本所有
export function* getNewWords(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getNewWords, payload);
  if (res && res.msg === 'Success') {
    yield put({
      type: 'UPDATE_NEW_WORDS',
      payload: res.result,
    });
  }
  payload.res && payload.res(res);
}

// 累计学习
export function* getAllReport(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getAllReport, payload);
  payload.res && payload.res(res);
}

// 购买记录
export function* getPurchasedListTrade(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getPurchasedListTrade, payload);
  payload.res && payload.res(res);
}

// 光荣榜 用户历史数据
export function* getRankHistory(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getRankHistory, payload);
  payload.res && payload.res(res);
}

// 发送短信验证码
export function* sendSmsCode(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.sendSmsCode, payload);
  payload.res && payload.res(res);
}

// 用户手机号短信验证码注册或登录
export function* registerLogin(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.registerLogin, payload);
  if (res && res.msg === 'Success') {
    yield put({ type: 'UPDATE_USER', payload: { user: res.result } });
  }
  payload.res && payload.res(res);
}

// 获取定级测试题目列表
export function* getRatingTest(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getRatingTest, payload);
  payload.res && payload.res(res);
}

// 提交定级测试结果并获取推荐级别
export function* postRatingTestResult(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.postRatingResult, payload);
  payload.res && payload.res(res);
}

// 用户gps词汇学习概况
export function* getGpsWordLearnInfo(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getGpsWordLearnInfo, payload);
  payload.res && payload.res(res);
}
// 获取省列表
export function* getProvince(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getProvince, payload);
  payload.res && payload.res(res);
}

// 获取城镇列表
export function* getCity(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getCity, payload);
  payload.res && payload.res(res);
}

// 获取区县列表
export function* getDistrict(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getDistrict, payload);
  payload.res && payload.res(res);
}

// 地理编码
export function* getGeocode(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getGeocode, payload);
  payload.res && payload.res(res);
}

// 输入提示
export function* getAssistant(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getAssistant, payload);
  payload.res && payload.res(res);
}

// 关键词查找行政区域
export function* getKeyWordsDistrict(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getKeyWordsDistrict, payload);
  payload.res && payload.res(res);
}

// 用户词汇学习单词列表
export function* getGpsWordList(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.gpsWordList, payload);
  payload.res && payload.res(res);
}

// 创建 oppo 订单
export function* oppoInit(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.oppoInit, payload);
  payload.res && payload.res(res);
}

// 创建支付宝订单
export function* alipayInit(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.alipayInit, payload);
  payload.res && payload.res(res);
}

// 创建微信订单
export function* wechatInit(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.wechatInit, payload);
  payload.res && payload.res(res);
}

// 获取订单状态
export function* getPayStatus(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getPayStatus, payload);
  payload.res && payload.res(res);
}

// 取消订单
export function* cancelPay(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.cancelPay, payload);
  payload.res && payload.res(res);
}

// 兑换码校验
export function* checkRedeemCode(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.checkRedeemCode, payload);
  payload.res && payload.res(res);
}

// 兑换码兑换会员
export function* redeemVip(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.redeemVip, payload);
  payload.res && payload.res(res);
}

// 上传埋点信息
export function* track(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.track, payload);
  payload.res && payload.res(res);
}

// V1版本H5中用户读书，思维导图课，AI分级阅读分享
export function* getShareInfo(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getShareInfo, payload);
  payload.res && payload.res(res);
}

/**
 * 获取轮播图
 *
 * @export
 * @param {*} actions
 */
export function* getBanner(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getBanner, payload);
  if (res && res.msg === 'Success') {
    if (DeviceInfo.getVersion() === '1.0.2') {
      res.result.banners[0].img_url =
        'https://dubaner-reading.oss-cn-beijing.aliyuncs.com/RosenRead/banner/banner2-promo.jpg';
      res.result.banners[0].target_url = 'https://r-read.dubaner.com/share/build/9.9.promo.html';
    }
    yield put({
      type: 'STORE_BANNER',
      payload: res.result,
    });
  }
  payload.res && payload.res(res);
}

/**
 * 获取商品列表
 *
 * @export
 * @param {*} actions
 */
export function* getGoodsList(actions) {
  const { payload = {} } = actions;
  const res = yield call(api.getGoodsList, payload);
  if (res && res.msg === 'Success') {
    let { member_list } = res.result;
    if (!member_list) {
      return;
    }
    const colors = ['#E9D8FB', '#CFECFF', '#FFE2C5'];
    for (let i = 0; i < member_list.length; i++) {
      member_list[i].color = colors[i];
      member_list[i].money = `¥${member_list[i].price / 100}${
        member_list[i].price < 1000 ? '0' : '.00'
      }`;
      member_list[i].amount = member_list[i].price;
      member_list[i].content = _.split(member_list[i].content, '#@#');
      member_list[i].productId = _.toString(member_list[i].product_id);
      if (DeviceInfo.getVersion() === '1.0.2') {
        // 此段逻辑为前端临时改变9.9元价格为1元
        if (member_list[i].productId === '15') {
          member_list[i].amount = 100;
          member_list[i].money = '¥1.00';
          member_list[i].title = '1元体验卡';
          member_list[i].description = '新用户福利，仅需 1 元即可体验 8 本优质图书和单词学习宝课程';
        }
      }
    }
    yield put({
      type: 'STORE_GOODS_LIST',
      payload: res.result,
    });
  }
  payload.res && payload.res(res);
}

export default function* rootSaga() {
  yield all([
    takeEvery('USER_LOGIN', userLogin),
    takeEvery('GET_USERINFO', getUserInfo),
    takeEvery('GET_BOOKSHELF', getBookShelf),
    takeEvery('GET_LESSON_BOOKLIST', getLessonBookList),
    takeEvery('GET_BOOKDETAIL', getBookDetail),
    takeEvery('GET_BOOKREADNUMBER', getBookReadNumber),
    takeEvery('GET_WORDDETAIL', getWordDetail),
    takeEvery('GET_BOOKQUIZ', getBookQuiz),
    takeEvery('GET_BOOK_POSTER', getBookPoster),
    takeEvery('BOOK_SEARCH', getBookSearch),
    takeEvery('ADD_FAVOURITE', addFavourite),
    takeEvery('REMOVE_FAVOURITE', removeFavourite),
    takeEvery('GET_FAVOURITE_LIST', getFavouriteList),
    takeEvery('GET_GRADE_DETAIL', getGradeDetail),
    takeEvery('GET_OPTIONAL_STUDY', getOptionStudy),
    takeEvery('GET_OPTIONAL_PRACTICE', getOptionPractice),
    takeEvery('GET_LESSON_BOOK', getLessonBook),
    takeEvery('GET_LESSON_REPORT', getLessonReport),
    takeEvery('GET_EXAM_QUESTIONS', getExamQuestions),
    takeEvery('RESTART_EXAM', restartExam),
    takeEvery('GET_EXAM_LIST', getExamList),
    takeEvery('GET_EXAM_DETAIL', getExamDetail),
    takeEvery('GET_UNIT_WORDS', getUnitWords),
    takeEvery('GET_CHECKIN_RECEIVE', getCheckInReceive),
    takeEvery('GET_CHECKIN_CALENDAR', getCheckInCalendar),
    takeEvery('GET_CHECKIN_RECORD', getCheckInRecord),
    takeEvery('GET_PARENTAL_BANNER', getParentalBanner),
    takeEvery('GET_RANK_LIST', getRankList),
    takeEvery('GET_NEW_WORDS', getNewWords),
    takeEvery('GET_WEEK_REPORT', getWeekReport),
    takeEvery('GET_DAILY_REPORT', getDailyReport),
    takeEvery('GET_ALL_REPORT', getAllReport),
    takeEvery('GET_PURCHASE_LIST_TRADE', getPurchasedListTrade),
    takeEvery('GET_RANK_HISTORY', getRankHistory),
    takeEvery('GET_RATING_TEST', getRatingTest),
    takeEvery('GET_GPS_WORD_LEARNINFO', getGpsWordLearnInfo),
    takeEvery('GET_PROVINCE', getProvince),
    takeEvery('GET_CITY', getCity),
    takeEvery('GET_DISTRICT', getDistrict),
    takeEvery('GET_GEOCODE', getGeocode),
    takeEvery('GET_ASSISTANT', getAssistant),
    takeEvery('GET_KEYWORDS_DISTRICT', getKeyWordsDistrict),
    takeEvery('GET_GPS_WORD_LIST', getGpsWordList),
    takeEvery('OPPO_INIT', oppoInit),
    takeEvery('GET_PAY_STATUS', getPayStatus),
    takeEvery('GET_SHAREINFO', getShareInfo),
    takeEvery('GET_BANNER', getBanner),
    takeEvery('GET_GOODS_LIST', getGoodsList),
    takeEvery('ALIPAY_INIT', alipayInit),
    takeEvery('WECHATPAY_INIT', getGoodsList),

    takeEvery('SCORE_ADUIO', scoreAudio),
    takeEvery('ADD_WORD', addWord),
    takeEvery('UPLOAD_READING_PROGRESS', uploadReadingProgress),
    takeEvery('UPLOAD_QUIZ_RESULT', uploadQuizResult),
    takeEvery('UPDATE_STUDY_RECORD', updateStudyRecord),
    takeEvery('UPLOAD_PRACTICE', uploadPractice),
    takeEvery('UPLOAD_BOOK_RECORD', uploadBookRecord),
    takeEvery('UPLOAD_REPORT_ANSWER', uploadReportAnswer),
    takeEvery('FINISH_EXAM', finishExam),
    takeEvery('CHECKIN_DAILY', checkInDaily),
    takeEvery('UPLOAD_IMG', uploadImg),
    takeEvery('USER_LOGOUT', userLogOut),
    takeEvery('USER_CHANGE_PWD', userChangePwd),
    takeEvery('FEED_BACK_UPLOAD', feedBackUpload),
    takeEvery('FEED_BACK_SUBMIT', feedBackSubmit),
    takeEvery('USER_UPDATE', userUpdate),
    takeEvery('SEND_SMS_CODE', sendSmsCode),
    takeEvery('REGISTER_LOGIN', registerLogin),
    takeEvery('POST_RATINGTEST_RESULT', postRatingTestResult),
    takeEvery('CANCEL_PAY', cancelPay),
    takeEvery('REDEEM_CODE_CHECK', checkRedeemCode),
    takeEvery('REDEEM_VIP', redeemVip),
    takeEvery('TRACK', track),
  ]);
}
