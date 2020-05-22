import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Promise from 'bluebird';
import { Select } from 'teaset';
import R, { prop } from 'ramda';
import { connect } from 'react-redux';

import i18n from '~/i18n';
import UI from '~/modules/UI';
import EventTracking from '~/modules/services/event-tracking';
import AudioManager from '~/modules/services/audio-manager';
import actions, { dispatch } from '~/modules/redux-app-config';
import GradeSelector from '~/components/GradeSelector';
import BookList from './BookList';

const bookImg = require('~/images/book.png');
const bookGrayImg = require('~/images/book_gray.png');
const noVipImg = require('~/images/noVip.png');
const monthImg = require('~/images/month.png');
const singleYearImg = require('~/images/singleYear.png');
const allYearImg = require('~/images/allYear.png');

@connect(
  R.pick(['shelf', 'userInfo']),
  actions,
)
class Book extends Component {
  static navigationOptions = () => ({
    tabBarLabel: i18n.t('tab.book'),
    tabBarIcon: ({ focused }) => (
      <Image style={styles.icon} source={focused ? bookImg : bookGrayImg} />
    ),
    tabBarOnPress: ({ navigation }) => {
      // do other things
      const { navigate, state } = navigation;
      AudioManager.click();
      navigate(state.routeName);
    },
  });

  constructor(props) {
    super(props);
    const { userInfo } = this.props;
    this.state = {
      selectedGrade: userInfo.user.study_year,
      shouldUpdateShelf: false,
    };
    this.gradeName = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
  }

  onGradeSelected = selected => {
    this.setState({ selectedGrade: selected });
    const { userInfo } = this.props;
    dispatch('USER_UPDATE', {
      ...userInfo.user,
      study_year: `${selected}`,
      res: res => {},
    });
  };

  /**
   * 展示不同会员图标
   *
   * @memberof Book
   */
  getVipImg = () => {
    const { userInfo } = this.props;
    const { user } = userInfo;
    const { role, is_member } = user;
    let img;
    if (role === '2') {
      img = monthImg;
    } else if (role === '1' && is_member === 'true') {
      img = singleYearImg;
    } else if (role === '3') {
      img = allYearImg;
    } else {
      img = noVipImg;
    }
    return img;
  };

  vipTouch = () => {
    const { navigation } = this.props;
    navigation.navigate('bannerDetail', {
      target_url: 'https://r-read.dubaner.com/share/build/328.html',
      source: '图书会员',
    });
  };
  render() {
    const { shelf, navigation, userInfo } = this.props;
    const { user } = userInfo;
    const { role } = user;
    const { selectedGrade, shouldUpdateShelf } = this.state;
    return (
      <View style={styles.container}>
        <View style={[styles.container, { paddingHorizontal: UI.scaleSize(15) }]}>
          <View style={styles.headerView}>
            <Text style={styles.tushu}>图书</Text>
            <TouchableOpacity
              style={styles.vipView}
              disabled={role === '3' && true}
              onPress={() => {
                this.vipTouch();
                EventTracking.track('t0101', 'r0201');
                EventTracking.track('t0105', 'r0201');
              }}
            >
              <Image source={this.getVipImg()} style={styles.vipImg} resizeMode="contain" />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.searchView}
              onPress={() => {
                EventTracking.track('t0101', 'r0202');
                this.props.navigation.navigate('sort', {
                  transition: 'forVertical',
                  type: 'COLLECT',
                });
              }}
            >
              <Image source={collectImg} style={styles.searchImg} />
            </TouchableOpacity> */}
          </View>
          <View style={{ height: UI.scaleSize(20) }} />
          <GradeSelector
            navigation={navigation}
            containerStyle={{ marginLeft: UI.scaleSize(-15) }}
            isSingleStudyYear={userInfo.user.role !== '3'}
            haveBackGround={false}
            studyYear={this.gradeName[userInfo.user.study_year - 1] || '一年级'}
            onGradeSelected={this.onGradeSelected}
          />
          <View style={{ height: UI.scaleSize(10) }} />
          <BookList
            grade={`K${
              userInfo.user.role === '3'
                ? selectedGrade
                : userInfo.user.study_year <= 0
                  ? 1
                  : userInfo.user.study_year
            }`}
            shouldUpdateShelf={shouldUpdateShelf}
            userInfo={userInfo}
            data={shelf.book_list}
            hosts={shelf.book_hosts}
            current_level_count={shelf.current_level_count}
            navigation={navigation}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: UI.scaleSize(10),
  },
  icon: {
    width: UI.scaleSize(28),
    height: UI.scaleSize(28),
  },
  btnView: {
    height: UI.scaleSize(50),
    paddingHorizontal: UI.scaleSize(16),
    borderWidth: UI.size.lineWidth,
    borderColor: UI.color.text1,
    borderRadius: UI.scaleSize(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: UI.color.text2,
    fontSize: UI.scaleSize(20),
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: UI.size.deviceWidth - UI.scaleSize(30),
  },
  tushu: {
    fontSize: UI.scaleSize(25),
    color: UI.color.text5,
    fontWeight: 'bold',
  },
  vipView: {
    width: UI.scaleSize(90),
    height: UI.scaleSize(27),
  },
  vipImg: {
    width: UI.scaleSize(90),
    height: UI.scaleSize(27),
    marginLeft: UI.scaleSize(10),
  },
  vipText: {
    fontSize: UI.scaleSize(14),
    color: UI.color.text5,
    fontWeight: '400',
    marginLeft: UI.scaleSize(5),
  },
  searchView: {
    width: UI.scaleSize(40),
    height: UI.scaleSize(40),
    borderRadius: UI.scaleSize(20),
    borderWidth: UI.scaleSize(2),
    borderColor: '#FF9900',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchImg: {
    width: UI.scaleSize(20),
    height: UI.scaleSize(20),
  },
});

export default Book;
