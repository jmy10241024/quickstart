/**
 * 休息提醒弹窗
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';

import actions, { dispatch } from '~/modules/redux-app-config';
import UI from '~/modules/UI';
import { getRouteName } from '~/modules/services/utils';

const dinosaurImg = require('./img/dinosaur.png');
const circleImg = require('./img/circle.png');
const fontBg = require('./img/font_bg.png');
const guideImg = require('./img/guide.png');

@connect(
  R.pick(['settings', 'nav']),
  actions,
)
class RestRemind extends Component {
  constructor(props) {
    super(props);
    this.seconds = 30; // 休息时间 单位：秒
    this.routes = ['home', 'bookShelf', 'cover']; // 哪些路由下显示休息提醒弹窗
    this.state = {
      visible: false,
      timeout: this.seconds,
      waitRouteName: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { restRemind, remindTime } = nextProps.settings;
    const oldSettings = this.props.settings;
    if (restRemind !== oldSettings.restRemind) {
      // 休息提醒开关发生改变
      if (restRemind) {
        // 打开休息提醒
        this.startRemind(remindTime);
      } else {
        // 关闭休息提醒
        this.clearTimer();
        this.clearInterval();
      }
    }
    if (
      restRemind &&
      restRemind === oldSettings.restRemind &&
      remindTime !== oldSettings.remindTime
    ) {
      // 休息提醒打开， 修改了提醒时间
      this.startRemind(remindTime);
    }
    const routeName = getRouteName(this.props.nav);
    const nextRouteName = getRouteName(nextProps.nav);
    if (
      routeName !== nextRouteName &&
      this.routes.includes(nextRouteName) &&
      this.state.waitRouteName
    ) {
      // 切换到可以显示休息提醒弹窗的路由
      this.stratRemindInterval();
    }
  }

  componentDidMount() {
    const { restRemind, remindTime } = this.props.settings;
    if (restRemind) {
      this.startRemind(remindTime);
    }
  }

  // 开启休息提醒倒计时
  startRemind(time) {
    this.clearTimer();
    this.clearInterval();
    this.setState({ waitRouteName: false });
    this.timer = setTimeout(this.remindTimeup, time * 60 * 1000);
  }

  clearTimer() {
    this.timer && clearTimeout(this.timer);
  }

  clearInterval() {
    this.interval && clearInterval(this.interval);
  }

  // 休息提醒时间到
  remindTimeup = () => {
    const { nav } = this.props;
    if (this.routes.includes(getRouteName(nav))) {
      this.stratRemindInterval();
    } else {
      this.setState({ waitRouteName: true });
    }
  };

  // 开启休息提醒弹窗并开启倒计时
  stratRemindInterval() {
    this.setState({ visible: true, timeout: this.seconds });
    this.interval = setInterval(() => {
      const { timeout } = this.state;
      if (timeout === 0) {
        this.setState({ visible: false, timeout: this.seconds });
        this.startRemind(this.props.settings.remindTime);
        return;
      }
      this.setState({ timeout: timeout - 1 });
    }, 1000);
  }

  componentWillUnmount() {
    this.clearTimer();
    this.clearInterval();
  }

  render() {
    const { visible, timeout } = this.state;
    if (!visible) {
      return null;
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={fontBg} style={styles.fontBg} resizeMode="contain">
          <Text style={styles.title}>注意用眼哦，休息一下吧~</Text>
        </ImageBackground>
        <Image source={guideImg} style={styles.guideImg} resizeMode="contain" />
        <Image source={dinosaurImg} style={styles.dinosaurImg} resizeMode="contain" />
        <ImageBackground source={circleImg} style={styles.circleImg} resizeMode="contain">
          <Text style={styles.timeout}>{timeout}s</Text>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleImg: {
    width: UI.scaleSize(120),
    height: UI.scaleSize(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeout: {
    fontSize: UI.scaleSize(15),
    color: '#3D5C85',
  },
  fontBg: {
    width: UI.scaleSize(181),
    height: UI.scaleSize(32),
    position: 'absolute',
    top: UI.scaleSize(64),
    left: (UI.size.deviceWidth - UI.scaleSize(181)) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideImg: {
    width: UI.scaleSize(110),
    height: UI.scaleSize(34),
    position: 'absolute',
    top: UI.scaleSize(64),
    left: (UI.size.deviceWidth + UI.scaleSize(181)) / 2 + UI.scaleSize(15),
  },
  dinosaurImg: {
    width: UI.scaleSize(46),
    height: UI.scaleSize(52),
    position: 'absolute',
    top: UI.scaleSize(76),
    left: (UI.size.deviceWidth + UI.scaleSize(181)) / 2 + UI.scaleSize(133),
  },
  title: {
    fontSize: UI.scaleSize(12),
    color: 'white',
    marginBottom: UI.scaleSize(3),
  },
});

export default RestRemind;
