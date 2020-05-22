import { PermissionsAndroid, Platform, Alert, Image, DeviceEventEmitter } from 'react-native';
import { unzip } from 'react-native-zip-archive';
import Config from 'react-native-config';
import RNFS from 'react-native-fs';
import _ from 'lodash';
import i18n from '~/i18n';
import { Toast as TeaToast } from 'teaset';
import * as WeChat from 'react-native-wechat';

const { DocumentDirectoryPath, CachesDirectoryPath } = RNFS;

/**
 * 下载压缩包
 * @param {string} filePath 文件名存储路径
 * @param {string} fromUrl 下载地址
 * @param {function} begin 下载回调函数
 * @param {function} progress 下载进度回调函数
 * @warn 现在统一将下载的压缩包存储在 RNFS.DocumentDirectoryPath 文件夹下
 */
function downloadZip(filePath, fromUrl, begin, progress) {
  const options = {
    fromUrl,
    toFile: filePath,
    background: true,
    begin: res => {
      begin && begin(res);
      console.log('==== dwonload begin =====', {
        res,
        contentLength: `${res.contentLength / 1024 / 1024}M`,
      });
    },
    progress: res => {
      const pro = res.bytesWritten / res.contentLength;
      progress && progress(pro);
      console.log('======= progress ====== ', pro);
    },
  };
  const ret = RNFS.downloadFile(options);
  return ret.promise;
}

/**
 * 读取目录下文件夹信息
 * @param {string} 文件目录
 */
function readDir(directoryPath = DocumentDirectoryPath) {
  return RNFS.readDir(directoryPath);
}

function readFile(filepath, encoding = 'utf8') {
  return RNFS.readFile(filepath, encoding);
}

/**
 * 解压文件
 * @param {string} filePath 需要解压的zip的路径
 * @param {string} targetPath 解压到的目录
 */
function unzipDirectory(filePath, targetPath = DocumentDirectoryPath) {
  return unzip(filePath, targetPath);
}

/**
 * 删除文件
 * @param {string} filePath 删除的文件目录
 */
function deleteFile(filePath) {
  return RNFS.unlink(filePath);
}

/**
 * 创建文件夹
 * @param {string} filePath
 */
function mkdir(filePath) {
  return RNFS.mkdir(filePath);
}

/**
 * 解析 xml 文件
 * @param {object} result
 */
function parseContent(result) {
  const { p } = result.text;
  const data = p.map(content =>
    content.s.map(item =>
      item.w.map(w => ({
        text: w._,
        start: parseInt(w.$.start_audio),
        end: parseInt(w.$.end_audio),
      })),
    ),
  );
  const flatArr = _.flattenDepth(data, 1);
  return flatArr;
}

/**
 * 解析打分后的结果
 * @param {array} words
 */
function parseSentence(words) {
  const data = words.map(word => {
    const fonts =
      word.phon &&
      word.phon.map(font => ({
        text: font.t,
        color: font.s > 0 ? '#4dab43' : '#d14353',
      }));
    return {
      content: word.text,
      fonts,
    };
  });
  return data;
}

/**
 * 获取当前路由的名字
 * @param {object} navigationState
 */
function getRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getRouteName(route);
  }
  return route.routeName;
}

/**
 * 获取区间随机整数
 * @param {number} max
 * @param {number} min
 */
function random(max = 10, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function requestPermission(permission) {
  if (Platform.OS === 'ios') {
    return;
  }
  try {
    const granted = await PermissionsAndroid.request(permission, {});
  } catch (err) {}
}

async function requestPermissions(permissions) {
  if (Platform.OS === 'ios') {
    return;
  }
  try {
    const granted = await PermissionsAndroid.requestMultiple(permissions, {});
    return granted;
  } catch (err) {}
}

async function checkPermission(permission) {
  if (Platform.OS === 'ios') {
    return;
  }
  try {
    const granted = await PermissionsAndroid.check(permission);
    return granted;
  } catch (err) {}
}

function getShelfLevel() {
  const A = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const B = ['I', 'J', 'K', 'L', 'M', 'N', 'O'];
  return [...A, ...B];
}

function goBackAlert(navigation, callback) {
  Alert.alert(
    null,
    '确认退出阅读吗',
    [
      {
        text: 'Yes',
        onPress: () => {
          callback && callback(true);
          navigation.goBack();
        },
      },
      {
        text: 'No',
        onPress: () => {
          callback && callback(false);
        },
        style: 'cancel',
      },
    ],
    { cancelable: false },
  );
}

function getStars(score) {
  if (typeof score !== 'number') {
    return 0;
  }
  if (score < 30) {
    return 0;
  }
  if (score >= 30 && score < 60) {
    return 1;
  }
  if (score >= 60 && score < 80) {
    return 2;
  }
  if (score >= 80) {
    return 3;
  }
  return 0;
}

async function imageResizeWithWidth({ res, width }) {
  return new Promise(async (success, fail) => {
    if (!res) {
      success({ msg: 'fail' });
    }
    const { book_list, book_hosts, book_cover_url } = res.result;
    const host = book_cover_url || book_hosts.book_cover;
    if (!book_list) {
      success(res);
    }
    await new Promise(async resolve => {
      for (let i = 0; i < book_list.length; i++) {
        const img = await new Promise((res, rej) =>
          Image.getSize(
            `${host}${book_list[i].cover}`,
            (width, height) => {
              res({ width, height });
            },
            rej,
          ),
        );
        const imgWidth = width;
        let imgHeight = imgWidth;
        if (img) {
          imgHeight = (imgWidth * img.height) / img.width;
        }
        book_list[i].imgWidth = imgWidth;
        book_list[i].imgHeight = imgHeight;
        book_list[i].coverUrl = `${host}${book_list[i].cover}`;
      }
      resolve(res);
    });
    success(res);
  });
}

function checkPhone(phone) {
  if (!/^1[3456789]\d{9}$/.test(phone)) {
    return false;
  }
  return true;
}

/**
 * @description: 跳转小程序
 * @param :
 * @return:
 */
async function launchMini(userInfo) {
  // TeaToast.success('即将上线,敬请期待!');
  try {
    const res = await WeChat.isWXAppInstalled();
    if (res) {
      if (!WeChat.launchMini) {
        return;
      }
      const { nick, is_member } = userInfo.user;
      const result = await WeChat.launchMini({
        userName: Config.MINI_RESEN_READING,
        miniProgramType: 0,
        path: `pages/index/index?is_member=${is_member}&name=${nick}`,
      });
      TeaToast.success(`${result.errCode}:${result.errStr}`);
    } else {
      TeaToast.fail('尚未安装微信客户端');
    }
  } catch (error) {}
}

/**
 * 发送事件给ShareModal
 *
 * @param {*} params
 */
function sendEventToShareModal(params) {
  DeviceEventEmitter.emit('HideModal', params);
}

//生成大写字母  A的Unicode值为65
function generateBig() {
  var str = [];
  for (var i = 65; i < 91; i++) {
    str.push(String.fromCharCode(i));
  }
  return str;
}

// 获取图书封面底部颜色
function getBookBgColors(index) {
  const colors = [
    'rgba(255,110,106,1)',
    'rgba(68,184,133,1)',
    'rgba(95,193,239,1)',
    'rgba(163,134,230,1)',
    'rgba(161,151,255,1)',
    'rgba(255,155,131,1)',
  ];
  return colors[index % 6];
}

module.exports = {
  getRouteName,
  random,
  requestPermission,
  getShelfLevel,
  DocumentDirectoryPath,
  CachesDirectoryPath,
  downloadZip,
  readDir,
  readFile,
  unzipDirectory,
  deleteFile,
  mkdir,
  parseContent,
  parseSentence,
  getStars,
  goBackAlert,
  imageResizeWithWidth,
  requestPermissions,
  checkPermission,
  checkPhone,
  launchMini,
  sendEventToShareModal,
  generateBig,
  getBookBgColors,
};
