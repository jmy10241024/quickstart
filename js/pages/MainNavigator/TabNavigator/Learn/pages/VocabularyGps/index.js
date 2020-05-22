import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

import _ from 'lodash';
import { Facebook } from 'react-content-loader/native';
import { Toast } from 'teaset';

import { dispatch } from '~/modules/redux-app-config';
import UI from '~/modules/UI.js';
import WordSituation from '../../components/WordSituation';
import OverViewClockItem from '../../components/OverViewClockItem';
import StudyTimeChart from '~/components/StudyTimeChart2';

// 学习时长
const learnDurationImg = require('../../img/learnDuration.png');
// 词汇学习效率
const learnEffectImg = require('../../img/learnEffict.png');
// 全国排名
const countryRankImg = require('../../img/countryRank.png');

const MyFacebookLoader = () => <Facebook />;

export default class Vocabulary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clockL: [], // 头部数据
      netLoading: true, // 网络数据是否loading
      wordLearn: [], // 掌握单词情况
    };
  }

  static navigationOptions = {
    title: '词汇GPS',
  };

  UNSAFE_componentWillMount() {
    // 头部view数组
    this.clockL = [
      { icon: learnDurationImg, text: '学习时长(分钟)' },
      { icon: learnEffectImg, text: '词汇学习效率' },
      { icon: countryRankImg, text: '全国排名' },
    ];
    this.titleL = ['读伴儿六千词', '高频词', '小学必备', '新概念一', 'KET', 'PET'];
  }

  componentDidMount() {
    this.getGpsWordLearnInfo();
  }
  // 用户gps词汇学习概况
  getGpsWordLearnInfo = async () => {
    dispatch('SET_LOADING', { visible: true });
    const ret = await new Promise(res => {
      dispatch('GET_GPS_WORD_LEARNINFO', {
        res,
      });
    }).catch(error => {
      dispatch('SET_LOADING', { visible: false });
    });
    dispatch('SET_LOADING', { visible: false });

    if (ret && ret.msg === 'Success') {
      this.objectToLearn(ret);
    }
  };

  /// 将得到的数据转化成需要的数据
  objectToLearn(ret) {
    let learnObj = {};
    let detailObj = {};
    const { result } = ret;
    if (result) {
      const { learn_info } = result;
      if (learn_info) {
        learnObj = learn_info.word_learn;
        detailObj = learn_info.learn_detail;
      } else {
        return;
      }
      this.transferWordLearn(learnObj);
      this.transferLearnDetail(_.toArray(detailObj));
    }
  }

  // 将掌握单词情况转化为相应的数组
  transferWordLearn = learnObj => {
    const learnObjToArr = _.toArray(learnObj);
    const chunkLearnArr = _.chunk(learnObjToArr, 2);

    let finalArr = [];
    this.titleL.map((item, index) => {
      const learn = chunkLearnArr[index][0];
      const total = chunkLearnArr[index][1] === 0 ? 10 : chunkLearnArr[index][1];
      let obj = {
        title: item,
        learn: learn,
        total: total,
        data: [{ x: 1, y: learn }, { x: 2, y: total }],
      };
      finalArr.push(obj);
    });
    this.setState({ wordLearn: finalArr });
  };

  // 将得到的学习概况对象转化为需要的数组
  transferLearnDetail = detailArr => {
    let finalArr = [];
    this.clockL.map((item, index) => {
      let obj = {
        icon: item.icon,
        value: index === 0 ? this.transferSecondsToMin(detailArr[index]) : detailArr[index],
        text: item.text,
      };
      finalArr.push(obj);
    });
    this.setState({ clockL: finalArr });
  };

  // 秒转分钟
  transferSecondsToMin = seconds => {
    return _.toSafeInteger(seconds / 60);
  };

  // 单词掌握情况每一项点击事件
  wordSituationPress = index => {
    Toast.success(index);
  };

  // 跳转横屏
  onLandspaceClick = () => {
    const { navigation } = this.props;
    navigation.navigate('landspaceChart');
  };

  pieOnPress = arr => {
    const { navigation } = this.props;
    navigation.navigate('vocabularyList', {
      title: arr[0].title,
      word_type: arr[1] + 1,
    });
  };

  refreshData = () => {
    this.timechart && this.timechart.refresh();
  };

  render() {
    const { wordLearn, clockL, netLoading } = this.state;
    const scaleW = (2 / 9) * UI.size.deviceWidth;
    // if (netLoading) {
    //   return <MyFacebookLoader />;
    // }
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.clockView}>
            {clockL.map((item, index) => (
              <OverViewClockItem
                key={_.uniqueId()}
                source={item.icon}
                value={index === 1 ? `${_.toSafeInteger(item.value * 100)}%` : item.value}
                bottomText={item.text}
              />
            ))}
          </View>
          <View style={styles.marginTopView}>
            <Text style={styles.moduleTitle}>掌握单词情况</Text>
          </View>
          <View style={styles.wordView}>
            {wordLearn.map((item, index) => (
              <WordSituation
                key={_.uniqueId()}
                learnNum={item.learn}
                title={item.title}
                totalNum={item.total}
                containerWidth={(5 / 18) * UI.size.deviceWidth}
                width={scaleW}
                height={scaleW}
                onPress={this.pieOnPress.bind(this, [item, index])}
              />
            ))}
          </View>
          <View style={[styles.marginTopView, { marginBottom: UI.scaleSize(10) }]}>
            <Text style={styles.moduleTitle} onPress={this.refreshData}>
              学习时长
            </Text>
          </View>
          <View style={styles.timeChartView}>
            <StudyTimeChart
              ref={o => {
                this.timechart = o;
              }}
            />
          </View>

          <View height={UI.scaleSize(30)} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(247,247,247)',
  },
  clockView: {
    marginTop: UI.scaleSize(10),
    flexDirection: 'row',
    marginHorizontal: UI.scaleSize(10),
    backgroundColor: 'white',
    padding: UI.scaleSize(15),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitle: {
    marginLeft: UI.scaleSize(10),
    fontSize: UI.scaleSize(18),
    color: 'black',
    fontWeight: 'bold',
  },
  wordView: {
    marginTop: UI.scaleSize(10),
    marginHorizontal: UI.scaleSize(10),
    paddingHorizontal: UI.scaleSize(20),
    paddingTop: UI.scaleSize(20),
    paddingBottom: UI.scaleSize(10),
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: 'rgb(255,255,255)',
  },
  pie: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  marginTopView: {
    marginTop: UI.scaleSize(20),
  },
  touch: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  timeChartView: {
    width: UI.size.deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
