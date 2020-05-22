import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, PermissionsAndroid } from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import Picker from 'react-native-picker';
import R from 'ramda';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import FastImage from 'react-native-fast-image';

import { addCalendar, cancelCalendar } from '~/modules/call-native';
import actions, { dispatch } from '~/modules/redux-app-config';
import UI from '~/modules/UI';
import { requestPermissions } from '~/modules/services/utils';
import SwitchSelector from 'react-native-switch-selector';
import SafeAreaView from 'react-native-safe-area-view';

import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import CustomNav from '~/components/CustomNav';

import CreditDetailModal from './CreditDetailModal';

const calendarImg = require('./img/calendar_bg.png');
const checkInIcon = require('./img/check-in_icon.png');
const timeIcon = require('./img/time_icon.png');
const reminderOnImg = require('./img/rili_open.png');
const reminderOffImg = require('./img/rili_close.png');
// 返回按钮
const backImg = require('~/images/newBackImg.png');
// 积分日历
@connect(
  R.pick(['settings']),
  actions,
)
class CreditCalendar extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      checkinDailyMap: {},
      visible: false,
      detail: undefined,
      granted: false,
      selected: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.options = [{ value: false }, { value: true }];
    this.getCheckInCalendar();
    this.requestPermissions();
    this.monthStartUnix = moment()
      .startOf('month')
      .unix(); // 月初
    this.monthEndUnix = moment()
      .startOf('month')
      .add(1, 'month')
      .unix(); // 月底
    this.days = (this.monthEndUnix - this.monthStartUnix) / 86400; // 本月一共多少天
    this.startOfWeek = moment.unix(this.monthStartUnix).format('d'); // 本月第一天是周几 0为周日
    this.daysArr = Array.from({ length: this.days }).map((v, k) => k);
    for (let index = 0; index < this.startOfWeek; index++) {
      this.daysArr.unshift('none');
    }
    const { checkInReminder, checkInTime } = this.props.settings;
    this.checkInReminder = checkInReminder;
    this.checkInTime = checkInTime;
    this.pickerHoursData = Array.from({ length: 24 }).map((v, k) => `${k}时`);
    this.pickerMinutesData = Array.from({ length: 60 }).map((v, k) => `${k}分`);
  }

  async requestPermissions() {
    const granted = await requestPermissions([
      PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
      PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
    ]);
    const READ_CALENDAR = granted['android.permission.READ_CALENDAR'];
    const WRITE_CALENDAR = granted['android.permission.WRITE_CALENDAR'];
    if (READ_CALENDAR === 'granted' && WRITE_CALENDAR === 'granted') {
      this.setState({ granted: true });
    }
  }

  getCheckInCalendar = () => {
    dispatch('GET_CHECKIN_CALENDAR', {
      res: res => {
        if (res && res.msg === 'Success') {
          this.setState({
            checkinDailyMap: res.result.checkinDailyMap,
          });
        }
      },
    });
  };

  reminderChanged = value => {
    const { granted } = this.state;
    if (value && !granted) {
      Toast.show('请去系统设置打开日历权限');
      return;
    }
    dispatch('UPDATE_CHECKIN_REMINDER', { reminder: value });
  };

  showPicker = () => {
    const { checkInTime } = this.props.settings;
    const { hour, minute } = checkInTime;
    Picker.init({
      pickerTitleText: '设置时间',
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerConfirmBtnColor: [255, 200, 25, 1],
      pickerCancelBtnColor: [139, 139, 139, 1],
      pickerData: [this.pickerHoursData, this.pickerMinutesData],
      selectedValue: [`${hour}时`, `${minute}分`],
      onPickerConfirm: data => {
        dispatch('UPDATE_CHECKIN_TIME', {
          checkInTime: { hour: parseInt(data[0]), minute: parseInt(data[1]) },
        });
      },
      onPickerCancel: data => {},
      onPickerSelect: data => {},
    });
    Picker.show();
  };

  setVisible = () => {
    this.setState({ visible: false });
  };

  componentWillUnmount() {
    Picker.hide();
    const { granted } = this.state;
    if (!granted) {
      return;
    }
    const { checkInTime, checkInReminder } = this.props.settings;
    const { hour, minute } = checkInTime;
    if (
      this.checkInReminder !== checkInReminder ||
      JSON.stringify(this.checkInTime) !== JSON.stringify(checkInTime)
    ) {
      if (checkInReminder) {
        let start = moment()
          .startOf('day')
          .add(hour, 'h')
          .add(minute, 'm')
          .unix();
        if (start < moment().unix()) {
          start = start + 24 * 60 * 60;
        }
        addCalendar({ start: `${start * 1000}`, end: `${(start + 60 * 10) * 1000}` }, res => {});
      } else {
        cancelCalendar(res => {});
      }
    }
  }

  goBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { daysArr } = this;
    const { checkinDailyMap, visible, detail, selected } = this.state;
    const { checkInReminder, checkInTime } = this.props.settings;
    let newDaysArr = _.union(['日', '一', '二', '三', '四', '五', '六'], daysArr);
    return (
      <View style={styles.container}>
        <CustomNav
          containerStyle={{ backgroundColor: 'white' }}
          title="积分日历"
          titleColor="#3C3C5C"
          imgType="gray"
          navigation={this.props.navigation}
        />
        <View style={styles.monthView}>
          <Text style={styles.monthText}>{moment().format('M')}月</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.daysView}>
            {newDaysArr.map((day, index) => {
              if (day === 'none') {
                return <View key={`${day}${index}`} style={styles.item} />;
              }
              const currentDay = moment
                .unix(this.monthStartUnix)
                .add(day, 'day')
                .format('YYYY-MM-DD');
              const currentUnix = moment
                .unix(this.monthStartUnix)
                .add(day, 'day')
                .unix();
              const checkInInfo = checkinDailyMap[currentDay];
              const isAfterToday = currentUnix > moment().unix();
              const isToday =
                currentUnix ===
                moment()
                  .startOf('day')
                  .unix();
              return (
                <MyTouchableOpacity
                  key={day}
                  disabled={isAfterToday ? true : index <= 6 && true}
                  style={[
                    styles.item,
                    checkInInfo && styles.itemActive,
                    index >= 7 && index <= 13 && styles.marginTop,
                  ]}
                  onPress={() => {
                    this.setState({
                      visible: true,
                      detail: {
                        ...(checkInInfo && checkInInfo[0]),
                        currentUnix,
                      },
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.itemText,
                      isAfterToday && styles.grayText,
                      index <= 6 && styles.weekText,
                      checkInInfo && styles.activeText,
                    ]}
                  >
                    {index <= 6 ? day : day + 1}
                  </Text>
                </MyTouchableOpacity>
              );
            })}
            <View style={styles.lineView} />
          </View>
        </View>

        <View style={styles.checkInCard}>
          <Text style={styles.checkText}>设置签到提醒</Text>
          <View style={styles.settingView}>
            <Image source={checkInIcon} style={styles.icon} />
            <Text style={styles.settingText}>签到提醒</Text>
            <View style={{ flex: 1 }} />
            <SwitchSelector
              style={{ width: UI.scaleSize(70), height: UI.scaleSize(32) }}
              options={this.options}
              // value={checkInReminder ? 0 : 1}
              buttonColor="#fff"
              initial={checkInReminder ? 1 : 0}
              // selectedColor={checkInReminder ? '#4FBBFF' : '#6BC46A'}
              textColor="#fff"
              backgroundColor={checkInReminder ? '#6BC46A' : '#00000033'}
              textStyle={{ fontSize: UI.scaleSize(13) }}
              height={UI.scaleSize(32)}
              borderRadius={UI.scaleSize(32) / 2}
              onPress={value => {
                this.reminderChanged(value);
              }}
              hasPadding
            />

            {/* <MyTouchableOpacity style={{}} onPress={this.reminderChanged}>
              <Image
                source={checkInReminder ? reminderOnImg : reminderOffImg}
                style={styles.reminderImg}
              />
            </MyTouchableOpacity> */}
          </View>
          <MyTouchableOpacity style={styles.settingView} onPress={this.showPicker}>
            <Image source={timeIcon} style={styles.icon} />
            <Text style={styles.settingText}>设置时间</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.reminderTime}>
              {checkInTime.hour < 10 ? `0${checkInTime.hour}` : checkInTime.hour}
              :
              {checkInTime.minute < 10 ? `0${checkInTime.minute}` : checkInTime.minute}
            </Text>
          </MyTouchableOpacity>
        </View>
        <CreditDetailModal
          visible={visible}
          detail={detail}
          setVisible={this.setVisible}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  navigationView: {
    alignSelf: 'flex-start',
    height: UI.scaleSize(50),
    width: UI.size.deviceWidth,
  },
  backTouch: {
    width: UI.scaleSize(50),
    height: UI.scaleSize(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImg: {
    width: UI.scaleSize(24),
    height: UI.scaleSize(24),
  },

  editView: {
    marginLeft: UI.scaleSize(20),
    alignSelf: 'flex-start',
    marginTop: UI.scaleSize(10),
  },
  editText: {
    fontSize: UI.scaleSize(30),
    fontWeight: 'bold',
    color: '#3C3C5C',
  },
  card: {
    width: UI.size.deviceWidth - UI.scaleSize(16) * 2,
    borderRadius: UI.scaleSize(10),
    marginTop: UI.scaleSize(20),
  },
  lineView: {
    position: 'absolute',
    top: UI.scaleSize(50),
    left: UI.scaleSize(16),
    right: UI.scaleSize(16),
    height: UI.scaleSize(1),
    backgroundColor: '#E6E6EA',
  },
  marginTop: {
    marginTop: UI.scaleSize(20),
  },
  weekView: {
    height: UI.scaleSize(50),
    marginHorizontal: UI.scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekInnerView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    color: '#CECED6',
    fontSize: UI.scaleSize(14),
    fontWeight: 'bold',
  },
  calendarImgView: {
    position: 'absolute',
    top: UI.scaleSize(19),
    left: 0,
    width: UI.size.deviceWidth,
    height: UI.scaleSize(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarImg: {
    width: UI.scaleSize(145),
    height: UI.scaleSize(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthView: {
    marginTop: UI.scaleSize(30),
  },
  monthText: {
    fontSize: UI.scaleSize(18),
    color: '#3C3C5C',
    fontWeight: 'bold',
  },
  daysView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: UI.size.deviceWidth - UI.scaleSize(16) * 2,
  },
  item: {
    width: (UI.size.deviceWidth - UI.scaleSize(16) * 2 - UI.scaleSize(90)) / 7,
    height: (UI.size.deviceWidth - UI.scaleSize(16) * 2 - UI.scaleSize(90)) / 7,
    marginTop: UI.scaleSize(10),
    marginLeft: UI.scaleSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (UI.size.deviceWidth - UI.scaleSize(16) * 2 - UI.scaleSize(80)) / 14,
  },
  itemActive: {
    backgroundColor: '#FE9801',
  },
  itemText: {
    fontSize: UI.scaleSize(16),
    color: '#3C3C5C',
    fontWeight: 'bold',
    marginBottom: UI.scaleSize(2),
  },
  grayText: {
    fontSize: UI.scaleSize(16),
    color: '#9D9DAD',
    fontWeight: 'bold',
  },
  activeText: {
    fontSize: UI.scaleSize(16),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  todayView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: (UI.size.deviceWidth - UI.scaleSize(16) * 2 - UI.scaleSize(90)) / 7,
    alignItems: 'center',
  },
  todayText: {
    fontSize: UI.scaleSize(10),
    color: '#FFC819',
  },
  shareView: {
    width: UI.scaleSize(170),
    height: UI.scaleSize(44),
    borderRadius: UI.scaleSize(44) / 2,
    backgroundColor: '#FFC819',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareText: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
  },
  checkInCard: {
    marginTop: UI.scaleSize(50),
    marginBottom: UI.scaleSize(20),
    width: UI.size.deviceWidth - UI.scaleSize(16) * 2,
    height: UI.scaleSize(187),
    backgroundColor: 'rgba(95,192,239,0.2)',
    borderRadius: UI.scaleSize(20),
  },
  checkText: {
    fontSize: UI.scaleSize(18),
    color: '#333333',
    marginTop: UI.scaleSize(23),
    marginLeft: UI.scaleSize(20),
  },
  settingView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: UI.scaleSize(28),
    paddingRight: UI.scaleSize(13),
  },
  switchView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: UI.scaleSize(25),
    height: UI.scaleSize(25),
  },
  settingText: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
    marginLeft: UI.scaleSize(11),
  },
  reminderImg: {
    width: UI.scaleSize(51),
    height: UI.scaleSize(31),
  },
  // selector: {
  //   width:
  // },
  reminderTime: {
    fontSize: UI.scaleSize(16),
    color: '#8B8B8B',
  },
});

export default CreditCalendar;
