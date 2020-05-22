import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import { Select, Toast } from 'teaset';
import Promise from 'bluebird';
import moment from 'moment';
import Swiper from 'react-native-swiper';

import { dispatch } from '~/modules/redux-app-config';
import EventTracking from '~/modules/services/event-tracking';
import { checkReadingPermission, sendEvent2Sheet, getBookBgColors } from '~/modules/services/utils';
import i18n from '~/i18n';
import UI from '~/modules/UI';
import AudioManager from '~/modules/services/audio-manager';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import GradeSelector from '~/components/GradeSelector';
import RatingTestActionSheet from '~/components/RatingTestActionSheet';
import { store } from '~/modules/redux-app-config';

const lessonImg = require('~/images/lesson.png');
const lessonGrayImg = require('~/images/lesson_gray.png');
// 单词宝图片
const wordImg = require('./img/lesson.png');
const readedImg = require('./img/yidu.png');
// 未读图片
const unreadImg = require('./img/unread.png');
// 图书锁住图标
const lockImg = require('~/images/book_lock.png');

@connect(R.pick(['lesson', 'userInfo', 'ratingTest', 'banner']))
class Lesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerIndex: 0, // 轮播索引
      autoPlay: true, // 轮播图自动播放
    };
  }

  static navigationOptions = () => ({
    tabBarLabel: i18n.t('tab.lesson'),
    tabBarIcon: ({ focused }) => (
      <FastImage style={styles.icon} source={focused ? lessonImg : lessonGrayImg} />
    ),
    tabBarOnPress: ({ navigation }) => {
      // do other things
      const { navigate, state } = navigation;
      AudioManager.click();
      navigate(state.routeName);
    },
  });

  UNSAFE_componentWillMount() {
    this.bottomModuleL = [
      { title: '单词学习宝', image: wordImg, content: '紧贴教材 助力学习', btnText: '去学习' },
    ];
    this.years = [
      { text: '一年级', value: 1 },
      { text: '二年级', value: 2 },
      { text: '三年级', value: 3 },
      { text: '四年级', value: 4 },
      { text: '五年级', value: 5 },
      { text: '六年级', value: 6 },
    ];
  }

  componentDidMount() {
    this.getBanner();
    dispatch('GET_GOODS_LIST', {});
    const { navigation, lesson, ratingTest, userInfo } = this.props;
    const nowDate = moment(new Date());
    const hasTest = ratingTest.hasTest;
    const timeDiff = nowDate.diff(ratingTest.laterUnix, 'day');

    // 新用户进入选择年级界面
    if (lesson.grade <= 0 || userInfo.user.study_year <= 0) {
      setTimeout(() => {
        navigation.navigate('grade', {
          transition: 'forFade',
          callback: grade => {
            navigation.navigate('lesson');
            DeviceEventEmitter.emit('privacy', false);
          },
        });
      }, 500);
    } else {
      DeviceEventEmitter.emit('privacy', false);
      // 未完成定级测试并且已过三天
      if (timeDiff > 2 && !hasTest) {
        this.actionSheet.show();
      }
    }

    this.getBooks(true, lesson.grade);
    if (lesson.grade > 3) {
      setTimeout(() => {
        this.scroll.scrollToEnd();
      }, 1);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.lesson.grade !== this.props.lesson.grade) {
      this.getBooks(true, nextProps.lesson.grade);
    }
  }

  getBanner = async () => {
    const ret = await new Promise(res => {
      dispatch('GET_BANNER', {});
    });
  };

  /**
   * @description: 轮播图索引发生变化
   * @param : 轮播图索引
   * @return:
   */
  bannerIndexChanged = bannerIndex => {
    this.setState({ bannerIndex });
  };

  bannerTouchOpacityClick(item, index) {
    const { navigation } = this.props;
    const net = store.getState().netInfoStatus.status;
    if (!net) {
      Toast.smile('请检查网络后再试ovo');
    } else {
      index = index === 1 ? 2 : 0;
      navigation.navigate('bannerDetail', { ...item, source: '轮播图', index });
      EventTracking.track('t0101', `r010${index + 2}`);
      EventTracking.track('t0105', `r010${index + 2}`);
    }
  }

  getBooks = async (isRefresh = false, study_year) => {
    const { lesson } = this.props;
    try {
      dispatch('SET_LOADING', { visible: true });
      dispatch('GET_LESSON_BOOKLIST', {
        page: '1',
        size: '6',
        grade: `K${study_year || lesson.grade || 1}`,
        read_flag: '0',
        callback: () => {
          dispatch('SET_LOADING', { visible: false });
        },
      });
    } catch (error) {
      dispatch('SET_LOADING', { visible: false });
    }
  };

  /**
   * @description: 学习时间1-3转年级
   * @param :
   * @return:
   */
  transToGrade(year) {
    return (this.years[year - 1] && this.years[year - 1].text) || '一年级';
  }

  /**
   * @description: 更多图书点击事件
   * @param :
   * @return:
   */
  moreBookPress = () => {
    const { navigation } = this.props;
    navigation.navigate('book');
  };

  /**
   * @description: 每本图书点击事件
   * @param :
   * @return:
   */
  bookTouchPress = (item, index) => {
    const { userInfo, navigation } = this.props;
    const data = checkReadingPermission(userInfo, item);
    if (data.status === 'fail') {
      sendEvent2Sheet({
        msg: data.msg,
        userInfo,
        book: item,
        redirectRouteName: 'lesson',
      });
      return;
    }
    navigation.navigate('cover', {
      item,
      index,
      UPDATE_READOVER_ACTION: 'UPDATE_LESSON_STATUS',
    });
  };

  onGradeSelected = grade => {
    dispatch('UPDATE_LOCAL_GRADE', { grade: grade });
  };

  onGradeTouchPress = currentPage => {
    this.setState({ currentPage });
  };

  render() {
    const { navigation } = this.props;

    const { lesson, userInfo, banner } = this.props;

    const { book_hosts: hosts, book_list } = lesson.shelf;
    const grade = this.transToGrade(lesson.grade);
    const { study_year, role, is_member } = userInfo.user;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* <View style={styles.rowView}>
            <GradeSelector
              isSingleStudyYear={false}
              haveBackGround
              studyYear={grade}
              onGradeSelected={this.onGradeSelected}
            />
          </View> */}
            <View style={styles.bannerView}>
              <Swiper
                autoplay
                onIndexChanged={this.bannerIndexChanged}
                autoplayTimeout={5}
                dot={<View style={styles.dot} />}
                activeDotStyle={[styles.dot, styles.activeDot]}
              >
                {banner &&
                  banner.banners.map((bannerInfo, index) => {
                    return (
                      <TouchableOpacity
                        key={`banner${index}`}
                        activeOpacity={0.8}
                        style={{ flex: 1 }}
                        onPress={this.bannerTouchOpacityClick.bind(this, bannerInfo, index)}
                      >
                        <Image
                          source={{ uri: bannerInfo.img_url }}
                          style={[styles.bannerView, { borderRadius: UI.scaleSize(10) }]}
                          resizeMode="stretch"
                        />
                      </TouchableOpacity>
                    );
                  })}
              </Swiper>
            </View>
            <View style={styles.containerView}>
              <ScrollView
                ref={o => {
                  this.scroll = o;
                }}
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                horizontal={true}
              >
                {this.years.map((item, index) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      this.onGradeSelected(item.value);
                    }}
                    style={[
                      styles.gradeTouch,
                      lesson.grade === item.value && styles.gradeTouchSelect,
                    ]}
                    key={_.uniqueId()}
                  >
                    <Text
                      style={[
                        styles.gradeText,
                        lesson.grade === item.value && styles.gradeTextSelect,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.bookView}>
              {book_list.map((item, index) => {
                const msg = checkReadingPermission(userInfo, item, lesson.grade);
                let isShow;
                if (msg.status === 'fail') {
                  isShow = 'true';
                }
                return (
                  <TouchableOpacity
                    key={`${item.cover}${index}`}
                    style={styles.item}
                    activeOpacity={0.8}
                    onPress={() => {
                      this.bookTouchPress(item, index);
                      if (index === 5) {
                        EventTracking.track('t0101', 'r0110');
                        EventTracking.track('t0105', 'r0110');
                      } else {
                        EventTracking.track('t0101', `r010${index + 5}`);
                        EventTracking.track('t0105', `r010${index + 5}`);
                      }
                    }}
                  >
                    <FastImage
                      source={{ uri: hosts.book_cover + item.cover }}
                      style={styles.cover}
                      resizeMode="stretch"
                    />

                    <View style={[styles.bottomView]}>
                      <Text numberOfLines={1} style={styles.bookName}>
                        {item.name}
                      </Text>
                      <View style={styles.subBottomView}>
                        <View style={styles.freeView}>
                          <Text style={styles.freeText}>{isShow === 'true' ? '付费' : '免费'}</Text>
                        </View>
                        <View style={styles.readView}>
                          <Image
                            style={styles.readedImgStyle}
                            source={item.read_over === 'true' ? readedImg : unreadImg}
                            resizeMode="contain"
                          />
                          <Text style={styles.readText}>
                            {item.read_over === 'true' ? '已读' : '未读'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {isShow === 'true' && (
                      <View style={styles.lockView}>
                        <FastImage source={lockImg} resizeMode="contain" style={styles.lockImg} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.allText}>单词学习</Text>
            {this.bottomModuleL.map(item => (
              <MyTouchableOpacity
                key={_.uniqueId('bottom')}
                activeOpacity={1}
                style={styles.wordTouch}
                onPress={() => {
                  navigation.navigate('word');
                  EventTracking.track('t0105', 'r0111');
                }}
              >
                <Image source={item.image} style={styles.imageStyle} />
                <View style={{ paddingLeft: UI.scaleSize(15) }} />
              </MyTouchableOpacity>
            ))}
            <View style={{ height: UI.scaleSize(10) }} />
          </ScrollView>
          <RatingTestActionSheet
            ref={o => (this.actionSheet = o)}
            grade={study_year}
            navigation={this.props.navigation}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: UI.scaleSize(15),
  },
  bannerView: {
    width: UI.size.deviceWidth - UI.scaleSize(30),
    height: ((UI.size.deviceWidth - UI.scaleSize(30)) * 320) / 690,
  },
  dot: {
    backgroundColor: 'rgb(251,221,170)',
    width: UI.scaleSize(17),
    height: UI.scaleSize(4),
    borderRadius: UI.scaleSize(4),
    marginLeft: UI.scaleSize(3),
    marginRight: UI.scaleSize(5),
    marginTop: UI.scaleSize(3),
    marginBottom: -UI.scaleSize(20),
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
  dotImg: {
    width: UI.scaleSize(17),
    height: UI.scaleSize(4),
  },
  containerView: {
    flexDirection: 'row',
  },
  spaceView: {
    backgroundColor: 'yellow',
    width: UI.scaleSize(83),
    height: UI.scaleSize(28),
    borderRadius: UI.scaleSize(5),
  },
  gradeScroll: {
    paddingHorizontal: UI.scaleSize(20),
    marginTop: UI.scaleSize(20),
    marginBottom: UI.scaleSize(10),
  },
  icon: {
    width: UI.scaleSize(28),
    height: UI.scaleSize(28),
  },
  rowView: {
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: UI.scaleSize(20),
    marginTop: UI.scaleSize(20),
    marginBottom: UI.scaleSize(10),
    height: UI.scaleSize(52),
    width: UI.size.deviceWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalScroll: {
    marginTop: UI.scaleSize(20),
  },
  gradeTouch: {
    backgroundColor: '#FDCB97',
    height: UI.scaleSize(28),
    width: UI.scaleSize(83),
    borderRadius: UI.scaleSize(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: UI.scaleSize(15),
  },
  gradeTouchSelect: {
    backgroundColor: '#E48726',
  },
  gradeText: {
    fontSize: UI.scaleSize(16),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  gradeTextSelect: { color: 'white' },
  bookView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: UI.scaleSize(3),
  },
  item: {
    marginTop: UI.scaleSize(15),
    width: (UI.size.deviceWidth - UI.scaleSize(60)) / 3,
    height:
      (UI.scaleSize(140) * ((UI.size.deviceWidth - UI.scaleSize(60)) / 3)) / UI.scaleSize(105),
    borderRadius: UI.scaleSize(5),
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: UI.color.black,
    elevation: 2,
  },
  lockView: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: (UI.size.deviceWidth - UI.scaleSize(60)) / 3,
    height:
      (UI.scaleSize(140) * ((UI.size.deviceWidth - UI.scaleSize(60)) / 3)) / UI.scaleSize(105),
    borderRadius: UI.scaleSize(5),
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockImg: {
    width: UI.scaleSize(32),
    height: UI.scaleSize(34),
  },
  cover: {
    width: (UI.size.deviceWidth - UI.scaleSize(60)) / 3,
    height:
      (UI.scaleSize(140) * ((UI.size.deviceWidth - UI.scaleSize(60)) / 3)) / UI.scaleSize(105),
  },
  freeView: {
    width: UI.scaleSize(27),
    height: UI.scaleSize(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DE6363',
    borderRadius: UI.scaleSize(2.5),
  },
  freeText: {
    fontSize: UI.scaleSize(10),
    color: '#FFFFFF',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: UI.scaleSize(35),
    backgroundColor: 'white',
    justifyContent: 'space-around',
    paddingHorizontal: UI.scaleSize(5),
  },
  subBottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: UI.scaleSize(2),
  },
  readView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bookName: {
    fontSize: UI.scaleSize(11),
    color: UI.color.text5,
    fontWeight: '300',
  },
  readText: {
    fontSize: UI.scaleSize(9),
    color: '#999999',
    fontWeight: '300',
  },
  readedImgStyle: {
    marginRight: UI.scaleSize(2),
    width: UI.scaleSize(10),
    height: UI.scaleSize(10),
  },
  allText: {
    fontSize: UI.scaleSize(16),
    color: UI.color.text5,
    fontWeight: 'bold',
    marginTop: UI.scaleSize(15),
  },
  wordTouch: {
    marginTop: UI.scaleSize(10),
    width: UI.size.deviceWidth - UI.scaleSize(30),
    height: ((UI.size.deviceWidth - UI.scaleSize(30)) * 160) / 345,
    borderRadius: UI.scaleSize(20),
    overflow: 'hidden',
  },
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: UI.size.deviceWidth - UI.scaleSize(30),
    height: ((UI.size.deviceWidth - UI.scaleSize(30)) * 160) / 345,
  },
  title: {
    marginTop: UI.scaleSize(20),
    fontSize: UI.scaleSize(30),
    color: '#3C3C5C',
  },
  content: {
    fontSize: UI.scaleSize(16),
    color: '#A65A87',
    marginTop: UI.scaleSize(5),
  },
  itemBtn: {
    width: UI.scaleSize(90),
    height: UI.scaleSize(34),
    backgroundColor: '#FD9801',
    borderRadius: UI.scaleSize(17),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: UI.scaleSize(15),
  },
  btnText: {
    fontSize: UI.scaleSize(12),
    color: 'white',
  },
});

export default Lesson;
