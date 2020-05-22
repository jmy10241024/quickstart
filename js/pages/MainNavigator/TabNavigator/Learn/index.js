import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';

import actions from '~/modules/redux-app-config';
import i18n from '~/i18n';
import UI from '~/modules/UI';
import EventTracking from '~/modules/services/event-tracking';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import AudioManager from '~/modules/services/audio-manager';

import FastImage from 'react-native-fast-image';
import { SpringScrollView } from 'react-native-spring-scrollview';

import CheckIn from './CheckIn';
import CheckInListItem from './components/CheckInListItem';

const learnImg = require('~/images/learn.png');
const learnGrayImg = require('~/images/learn_gray.png');
const newWordsImg = require('./img/new_words.png');
const rankImg = require('./img/rank.png');
const reportImg = require('./img/report.png');
const readBookImg = require('./img/readbook_icon.png');
const wordImg = require('./img/word_icon.png');

@connect(
  R.pick(['userInfo']),
  actions,
)
class Learn extends Component {
  static navigationOptions = () => ({
    tabBarLabel: i18n.t('tab.learn'),
    tabBarIcon: ({ focused }) => (
      <Image style={styles.icon} source={focused ? learnImg : learnGrayImg} />
    ),
    tabBarOnPress: ({ navigation }) => {
      // do other things
      const { navigate, state } = navigation;
      AudioManager.click();
      navigate(state.routeName);
    },
  });

  UNSAFE_componentWillMount() {
    this.studyList = [
      {
        backColor: 'rgb(250,223,223)',
        title: '生词本',
        titleColor: '#DE6363',
        img: newWordsImg,
        onPress: this.pressNewWords,
      },
      {
        backColor: 'rgb(223,237,251)',
        title: '学习报告',
        titleColor: '#6DAEFC',
        img: reportImg,
        onPress: this.pressReport,
      },
      {
        backColor: 'rgb(235,223,248)',
        title: '排行榜',
        titleColor: '#945FEB',
        img: rankImg,
        onPress: this.pressRank,
      },
      // { backColor: '#A386E6', title: '词汇GPS', img: rankImg, onPress: this.pressVocabularyGps },
    ];
  }

  pressNewWords = () => {
    this.props.navigation.navigate('newWords');
  };

  pressReport = () => {
    const { navigation } = this.props;
    navigation.navigate('studyReport');
  };

  pressRank = () => {
    this.props.navigation.navigate('rank');
  };
  pressVocabularyGps = () => {
    this.props.navigation.navigate('vocabularyList', { title: '词汇GPS' });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.container}>
            <CheckIn userInfo={this.props.userInfo} navigation={this.props.navigation} />
            <View style={styles.bottomView}>
              <View style={styles.studyList}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal scrollEnabled={false}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: UI.scaleSize(20),
                    }}
                  >
                    {this.studyList.map((item, index) => (
                      <MyTouchableOpacity
                        activeOpacity={0.7}
                        style={[
                          styles.itemTouch,
                          { backgroundColor: item.backColor },
                          index !== 2 && { marginRight: UI.scaleSize(10) },
                        ]}
                        key={item.title}
                        onPress={item.onPress}
                      >
                        <FastImage source={item.img} style={styles.itemView} />
                        <Text style={[styles.itemText, { color: item.titleColor }]}>
                          {item.title}
                        </Text>
                      </MyTouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              <Text style={styles.checkIn}>学习打卡</Text>
              <CheckInListItem
                title="每天坚持读两本书"
                subTitle="学习越来越棒鸭!"
                btnText="去读书"
                icon={readBookImg}
                onPress={() => {
                  EventTracking.track('t0101', 'r0301');
                  EventTracking.track('t0105', 'r0301');
                  this.props.navigation.navigate('book');
                }}
              />
              <CheckInListItem
                title="单词学习宝"
                subTitle="紧贴教材学习助力"
                btnText="去学习"
                icon={wordImg}
                onPress={() => {
                  EventTracking.track('t0101', 'r0302');
                  EventTracking.track('t0105', 'r0302');
                  this.props.navigation.navigate('word');
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: UI.scaleSize(28),
    height: UI.scaleSize(28),
  },
  studyList: {
    width: UI.size.deviceWidth,
    marginTop: UI.scaleSize(20),
  },
  itemTouch: {
    width: (UI.size.deviceWidth - UI.scaleSize(60)) / 3,
    height: UI.scaleSize(40),
    borderRadius: UI.scaleSize(10),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  itemView: {
    width: UI.scaleSize(20),
    height: UI.scaleSize(20),
  },
  itemText: {
    marginLeft: UI.scaleSize(5),
    fontSize: UI.scaleSize(14),
    fontWeight: '400',
  },
  checkIn: {
    marginTop: UI.scaleSize(30),
    fontSize: UI.scaleSize(18),
    fontWeight: '700',
    color: UI.color.text5,
    marginLeft: UI.scaleSize(16),
    marginBottom: UI.scaleSize(5),
  },
  bottomView: {
    flex: 1,
    // backgroundColor: UI.color.white,
    overflow: 'hidden',
  },
});

export default Learn;
