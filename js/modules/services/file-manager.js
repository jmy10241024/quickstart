import { Alert } from 'react-native';
import _ from 'lodash';
import RNFS from 'react-native-fs';
import xml2js from 'react-native-xml2js';
import i18n from '~/i18n';
import { store, dispatch } from '~/modules/redux-app-config';
import {
  DocumentDirectoryPath,
  readDir,
  readFile,
  unzipDirectory,
  deleteFile,
  downloadZip,
  parseContent,
} from '~/modules/services/utils';

console.log(' ============ DocumentDirectoryPath ============ ', DocumentDirectoryPath);

const parser = new xml2js.Parser();

class FileManager {
  /**
   * 解析阅读页文件夹
   * @param {string} fileName 文件名
   * @return {object} book 图书详情
   */
  async parseBookReading(fileName, ossZip) {
    console.log(' ============ parseBookReading ============ ', {
      fileName,
      ossZip,
    });
    // 获取本地存储文件
    const dirArr = await readDir(`${DocumentDirectoryPath}`);
    const index = _.findIndex(dirArr, o => o.name === fileName);
    // 判断需要解析的文件夹是否存在
    if (index > -1) {
      // 存在 进行对文件夹的解析
      return await this.parseBookReadingDir(fileName);
    }
    // 不存在，则进行网络下载
    // 判断当前网络状态
    if (!store.getState().netInfoStatus.status) {
      Alert.alert(i18n.t('warn.network'));
      return false;
    }
    const downloadRes = await this.downloadZipFile(fileName, ossZip);
    if (!downloadRes) {
      Alert.alert(i18n.t('warn.error'));
      return false;
    }
    return await this.parseBookReadingDir(fileName);
  }

  // 解析阅读页中使用图示资源文件 json 信息
  async parseBookReadingDir(fileName) {
    try {
      // 本地存储中获取该文件夹下所有内容
      const dirArr = await readDir(`${DocumentDirectoryPath}/${fileName}`);
      // 获取 json 文件数据
      const json = await readFile(`${RNFS.DocumentDirectoryPath}/${fileName}/book.json`, 'utf8');
      if (!json) {
        return false;
      }
      // 解析 json 字符串
      const textInfo = JSON.parse(json);
      const data = [];
      // 遍历 json 对象，返回滑动组件需要的内容 item = { text: 文字, picUrl: 本地图片Url || '', mp3Url: 本地mp3文件 || '', dictionary: 字典文字内容}
      await (async function() {
        for (let i = 0; i < textInfo.length; i++) {
          const value = textInfo[i];
          const { pdf_content, pdf_parameters, pdf_pic, pdf_sound, course_id, sort_index } = value;
          let content = [];
          if (pdf_content && pdf_content.indexOf('.xml') > -1) {
            const xml = await readFile(`${DocumentDirectoryPath}/${fileName}/${pdf_content}`);
            parser.parseString(xml, (err, result) => {
              content = parseContent(result);
            });
          }
          data.push({
            courseId: course_id,
            sortIndex: sort_index,
            content,
            parameters: (pdf_parameters && JSON.parse(pdf_parameters)) || {},
            pic: pdf_pic ? `${DocumentDirectoryPath}/${fileName}/${pdf_pic}` : '',
            sound: pdf_sound ? `${DocumentDirectoryPath}/${fileName}/${pdf_sound}` : '',
          });
        }
      })();
      return data;
    } catch (err) {
      return false;
    }
  }

  // 下载压缩包文件 -> 解压 -> 删除
  async downloadZipFile(fileName, ossZip) {
    try {
      const res = await downloadZip(
        `${DocumentDirectoryPath}/${fileName}.zip`,
        ossZip,
        null,
        progress => {
          dispatch('SET_LOADING_PERCENTAGE', parseInt(progress * 100));
        },
      );
      if (res.statusCode !== 200) {
        return false;
      }
      await unzipDirectory(
        `${DocumentDirectoryPath}/${fileName}.zip`,
        `${DocumentDirectoryPath}/${fileName}`,
      );
      await deleteFile(`${DocumentDirectoryPath}/${fileName}.zip`);
      return true;
    } catch (error) {}
  }
}

export default new FileManager();
