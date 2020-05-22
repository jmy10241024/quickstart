import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import moment from 'moment';
import zhLocal from 'moment/locale/zh-cn';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';

import UI from '~/modules/UI';
import { dispatch } from '~/modules/redux-app-config';
import EventTracking from '~/modules/services/event-tracking';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';

import Cloud from './Cloud';
import Nut from './Nut';

const skyBg = require('../img/sky_bg.png');
const calendarImg = require('../img/canlendar.png');
const sammyImg = require('../img/sammy.png');
const cutImg = require('../img/cut.png');
const cutGrayImg = require('../img/cut_gray.png');
const tree2Img = require('../img/tree02.png');
const tree3Img = require('../img/tree03.png');
const tree4Img = require('../img/tree04.png');
const tree5Img = require('../img/tree05.png');
const checkInImg = require('../img/checkin.png');
//积分框
const integralCicleImg = require('../img/intergralCicle.png');
// 积分图
const intergralImg = require('../img/intergral.png');
//彩色圈
const calendarColorImg = require('../img/calendar_color.png');
//灰色圈
const calendarGrayImg = require('../img/calendar_white.png');

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      canReceiveRewards: {},
      records: [],
    };
  }

  UNSAFE_componentWillMount() {
    moment().local('zh-cn', zhLocal);
    this.getCheckInReceive();
    this.getCheckInRecord();
  }

  getCheckInReceive = () => {
    dispatch('GET_CHECKIN_RECEIVE', {
      res: res => {
        if (res && res.msg === 'Success') {
          this.setState({
            days: res.result.days,
            canReceiveRewards: res.result.canReceiveRewards[0] || {},
          });
        }
      },
    });
  };

  getCheckInRecord = () => {
    dispatch('GET_CHECKIN_RECORD', {
      year: moment().format('YYYY'),
      month: moment().format('M'),
      res: res => {
        if (res && res.msg === 'Success') {
          this.setState({ records: res.result.records });
        }
      },
    });
  };

  checkIn = (data, callback) => {
    if (!data.checkinType) {
      return;
    }

    dispatch('CHECKIN_DAILY', {
      checkinType: data.checkinType,
      res: async res => {
        if (res && res.msg === 'Success') {
          await this.getCheckInRecord();
          await this.getCheckInReceive();
          await this.getUserInfo();
          EventTracking.track('t0102', '', { coin: data.gold }, res.result.request_id);
        }
        callback(res);
      },
    });
  };

  getTree = () => {
    const { userInfo } = this.props;
    const gold = (userInfo.user && userInfo.user.gold) || 0;
    let tree = tree2Img;
    let width = UI.scaleSize(41);
    let height = UI.scaleSize(45);
    if (gold > 50 && gold <= 100) {
      tree = tree3Img;
      width = UI.scaleSize(50);
      height = UI.scaleSize(76);
    } else if (gold > 100 && gold <= 200) {
      tree = tree4Img;
      width = UI.scaleSize(78);
      height = UI.scaleSize(105);
    } else if (gold > 200) {
      tree = tree5Img;
      width = UI.scaleSize(131);
      height = UI.scaleSize(166);
    }
    return {
      img: tree,
      width,
      height,
    };
  };

  getRecentRecords() {
    let { records } = this.state;
    if (records.length === 0) {
      return [];
    }
    records = _.filter(records, o => o.checkin_type === 5);
    const todayUnix = moment()
      .startOf('d')
      .unix();
    if (records.length === 1) {
      if (
        moment(records[0].created)
          .startOf('d')
          .add(1, 'd')
          .unix() === todayUnix ||
        moment(records[0].created)
          .startOf('d')
          .unix() === todayUnix
      ) {
        return records;
      }
      return [];
    }
    if (records.length <= 1) {
      return records;
    }
    const data = [];
    for (let i = records.length - 1; i > 0; i--) {
      const currentUnix = moment(records[i].created)
        .startOf('d')
        .unix();
      const nextUnix = moment(records[i - 1].created)
        .startOf('d')
        .unix();
      if (todayUnix > currentUnix + 86400 && data.length === 0) {
        break;
      }
      if (data.length === 0) {
        data.push(records[i]);
      }
      if (currentUnix === nextUnix + 86400) {
        data.push(records[i - 1]);
      } else {
        break;
      }
    }
    return data.reverse();
  }

  getUserInfo = () => {
    dispatch('GET_USERINFO');
  };

  callBack = () => {};

  render() {
    const { days, canReceiveRewards } = this.state;
    const { userInfo } = this.props;
    const data = this.getRecentRecords();
    return (
      <View style={styles.container1}>
        <View style={styles.container}>
          <View style={styles.topView}>
            <View>
              <Text style={styles.fixedText}>
                已连续签到<Text style={styles.dayText}>{days}</Text>天
              </Text>
            </View>
            <ImageBackground
              style={styles.integralView}
              source={integralCicleImg}
              resizeMode="contain"
            >
              <FastImage style={styles.integralImg} source={intergralImg} resizeMode="contain" />
              <Text style={styles.integralText}>{userInfo.user.gold || 0}</Text>
            </ImageBackground>
          </View>
        </View>
        <View style={{ height: UI.scaleSize(72.5) }} />
        <View style={styles.whiteView}>
          {[0, 1, 2, 3, 4, 5, 6].map(day => {
            const today = moment()
              .startOf('day')
              .unix(); // 今天零点时间戳
            // 查找本周有打卡的记录
            const currentDayInfo = data[day];
            const nextDayInfo = data[day + 1];
            let indexUnix = moment()
              .startOf('day')
              .add(day, 'day')
              .unix(); // 当前坐标时间戳
            if (data[0]) {
              indexUnix = moment(data[0].created)
                .startOf('day')
                .add(day, 'day')
                .unix();
            }
            let time;
            if (indexUnix === today) {
              time = '今天';
            } else if (
              indexUnix ===
              moment(new Date())
                .startOf('day')
                .add(-1, 'days')
                .unix()
            ) {
              time = '昨天';
            } else {
              time = moment.unix(indexUnix).format('MM.DD');
            }
            return (
              <View key={_.uniqueId()} style={[styles.verticalView]}>
                <MyTouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    this.checkIn(canReceiveRewards, this.callBack);
                  }}
                  style={[styles.roundView, currentDayInfo && { backgroundColor: '#E9A12F' }]}
                >
                  <Text style={[styles.plusText, currentDayInfo && { color: 'white' }]}>
                    +{day + 1}
                  </Text>
                </MyTouchableOpacity>
                <View style={styles.circularView}>
                  <View
                    style={[
                      styles.lineView,
                      currentDayInfo && { backgroundColor: '#E9A12F' },
                      day === 0 && { backgroundColor: 'white' },
                    ]}
                  />
                  <FastImage
                    source={currentDayInfo ? calendarColorImg : calendarGrayImg}
                    style={styles.calendarColorImg}
                    resizeMode="contain"
                  />
                  <View
                    style={[
                      styles.lineView,
                      currentDayInfo && { backgroundColor: '#E9A12F' },
                      !nextDayInfo && { backgroundColor: '#D9D7D7' },
                      day === 6 && { backgroundColor: 'white' },
                    ]}
                  />
                </View>

                <Text style={styles.timeText}>{time}</Text>
              </View>
            );
          })}
          <MyTouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('creditCalendar');
            }}
            style={styles.calendarView}
          >
            <FastImage source={calendarImg} style={styles.calendarImg} resizeMode="contain" />
            <Text style={styles.calendarText}>查看积分日历</Text>
          </MyTouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    width: UI.size.deviceWidth,
    height: UI.scaleSize(180 + 72.5),
  },
  container: {
    width: UI.size.deviceWidth,
    paddingBottom: UI.scaleSize(20),
    paddingHorizontal: UI.scaleSize(15),
    paddingTop: UI.scaleSize(40),
    backgroundColor: UI.color.primary,
    height: UI.scaleSize(180),
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fixedText: {
    fontSize: UI.scaleSize(22),
    color: '#FFFFFF',
    fontWeight: '400',
  },
  dayText: {
    fontSize: UI.scaleSize(22),
    color: '#E58726',
    fontWeight: '300',
  },
  integralView: {
    width: UI.scaleSize(60),
    height: UI.scaleSize(22),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  integralImg: {
    width: UI.scaleSize(10),
    height: UI.scaleSize(9),
  },
  integralText: {
    fontSize: UI.scaleSize(11),
    color: UI.color.white,
    marginLeft: UI.scaleSize(5),
  },

  signView: {
    marginTop: UI.scaleSize(40),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  signItemView: {
    alignItems: 'center',
    marginTop: UI.scaleSize(8),
    justifyContent: 'center',
  },
  signItemTouch: {
    marginTop: UI.scaleSize(5),
    width: UI.size.deviceWidth * (60 / 375),
    height: UI.size.deviceWidth * (60 / 375),
    borderRadius: (UI.size.deviceWidth * (60 / 375)) / 2,
    padding: UI.scaleSize(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA319',
    alignSelf: 'center',
  },
  signItemInnerView: {
    width: UI.size.deviceWidth * (52 / 375),
    height: UI.size.deviceWidth * (52 / 375),
    borderRadius: (UI.size.deviceWidth * (52 / 375)) / 2,
    borderColor: '#ff8810',
    borderWidth: UI.scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  signItemTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signItemText: {
    fontSize: UI.scaleSize(18),
    fontWeight: 'bold',
    color: '#CECED6',
  },
  dateView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkView: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: UI.scaleSize(20),
    height: UI.scaleSize(20),
    backgroundColor: UI.color.primary2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: UI.scaleSize(10),
  },
  checkText: {
    fontSize: UI.scaleSize(12),
    color: '#FF9901',
  },
  calendar: {
    position: 'absolute',
    width: UI.size.deviceWidth - UI.scaleSize(16) * 2,
    height: UI.scaleSize(130),
    bottom: 5,
    left: UI.scaleSize(16),
    backgroundColor: '#FFFFFF',
    borderRadius: UI.scaleSize(10),
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: UI.color.black,
    elevation: 4,
  },
  top: {
    flexDirection: 'row',
    marginTop: UI.scaleSize(20),
    marginLeft: UI.scaleSize(20),
  },
  checkInText: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
  },
  calendarView: {
    position: 'absolute',
    top: UI.scaleSize(15),
    right: 0,
    width: UI.scaleSize(92),
    height: UI.scaleSize(18),
    borderTopLeftRadius: UI.scaleSize(5),
    borderBottomLeftRadius: UI.scaleSize(5),
    alignItems: 'center',
    backgroundColor: '#E58726',
    flexDirection: 'row',
  },
  calendarImg: {
    width: UI.scaleSize(11),
    height: UI.scaleSize(11),
    marginLeft: UI.scaleSize(3),
  },
  calendarText: {
    fontSize: UI.scaleSize(11),
    fontWeight: 'bold',
    color: UI.color.white,
    marginLeft: UI.scaleSize(2),
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    marginTop: UI.scaleSize(10),
    justifyContent: 'space-between',
    paddingHorizontal: UI.scaleSize(5),
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  itemImg: {
    width: UI.scaleSize(34),
    height: UI.scaleSize(37),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIndex: {
    fontSize: UI.scaleSize(12),
    color: '#CDCDCD',
    marginTop: UI.scaleSize(7),
    marginRight: UI.scaleSize(2),
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: UI.scaleSize(12),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // calendarImg: {
  //   width: UI.scaleSize(71),
  //   height: UI.scaleSize(14),
  //   marginRight: UI.scaleSize(10),
  // },
  sammyImg: {
    position: 'absolute',
    bottom: UI.scaleSize(135),
    left: UI.scaleSize(40),
    width: UI.scaleSize(80),
    height: UI.scaleSize(61),
  },
  treeImg: {
    position: 'absolute',
    bottom: UI.scaleSize(150),
  },

  cutImg: {
    width: UI.scaleSize(19),
    height: UI.scaleSize(20),
  },
  gold: {
    marginLeft: UI.scaleSize(6),
    fontSize: UI.scaleSize(14),
    color: '#AE692E',
  },
  whiteView: {
    position: 'absolute',
    left: UI.scaleSize(15),
    bottom: 0,
    width: UI.size.deviceWidth - UI.scaleSize(30),
    height: UI.scaleSize(145),
    backgroundColor: UI.color.white,
    borderRadius: UI.scaleSize(10),
    paddingHorizontal: UI.scaleSize(15),
    paddingTop: UI.scaleSize(40),
    paddingBottom: UI.scaleSize(20),
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: UI.color.black,
    elevation: 2,
    flexDirection: 'row',
  },
  verticalView: {
    alignItems: 'center',
    height: UI.scaleSize(85),
    justifyContent: 'space-between',
    flex: 1,
  },
  plusView: {
    marginTop: UI.scaleSize(40),
    marginLeft: UI.scaleSize(15),
    width: UI.size.deviceWidth - UI.scaleSize(60),
    height: UI.scaleSize(35),
    flexDirection: 'row',
  },
  plusText: {
    fontSize: UI.scaleSize(15),
    color: '#E38C03',
    fontWeight: '400',
  },

  timeView: {
    marginTop: UI.scaleSize(5),
    marginLeft: UI.scaleSize(15),
    width: UI.size.deviceWidth - UI.scaleSize(60),
    height: UI.scaleSize(20),
    flexDirection: 'row',
    // backgroundColor: 'green',
  },
  timeTextView: {
    backgroundColor: UI.color.white,
  },
  timeText: {
    fontSize: UI.scaleSize(12),
    color: UI.color.text5,
    fontWeight: '400',
  },
  roundView: {
    width: UI.scaleSize(35),
    height: UI.scaleSize(35),
    borderRadius: UI.scaleSize(17.5),
    backgroundColor: '#FDD390',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineView: {
    height: UI.scaleSize(1),
    width: UI.scaleSize(18.5),
    backgroundColor: '#D9D7D7',
  },
  calendarColorImg: {
    width: UI.scaleSize(8),
    height: UI.scaleSize(8),
  },
});

export default CheckIn;
