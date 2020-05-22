import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { Avatar, ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { SpringScrollView } from 'react-native-spring-scrollview';
import _ from 'lodash';

import { checkPhone, checkUserPermission, getUserAge } from '~/modules/services/utils';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import UI from '~/modules/UI';
import i18n from '~/i18n';
import { dispatch } from '~/modules/redux-app-config';
import AudioManager from '~/modules/services/audio-manager';
import Gestures from 'react-native-easy-gestures';

const avatarImg = require('~/images/avatar.png');
// 底部图标
const parentalImg = require('~/images/parental.png');
const parentalGrayImg = require('~/images/parental_gray.png');
//积分框
const integralCicleImg = require('./img/intergralCicle.png');
// 积分图
const intergralImg = require('./img/intergral.png');
const tempImg = require('~/images/imagebackground.png');

// 右上角编辑资料
const editImg = require('./img/pen.png');
// 学习报告
const report_bun_img = require('./img/Report_bun.png');
// 家长课堂
const parent_class_img = require('./img/ParentClassroom_bun.png');
// 学习规划
const learn_paln_img = require('./img/LearningPlanning_bun.png');

// 购买记录图片
const purchaseRecordingImg = require('./img/purchase_icon.png');

// 扫一扫图片
const scanImg = require('./img/Scan_icon.png');
// 设置图片
const settingImg = require('./img/Setup_icon.png');

const iconRightImg = require('./img/iconRight.png');

const absoluteWhiteList = [
  {
    icon: parent_class_img,
    title: '生词本',
  },
  {
    icon: report_bun_img,
    title: '学习报告',
  },
  {
    icon: learn_paln_img,
    title: '排行榜',
  },
];

// 轮播图数组
const bannerImageList = [
  {
    image: tempImg,
    toNavigationName: '',
  },
  {
    image: tempImg,
    toNavigationName: '',
  },
  {
    image: tempImg,
    toNavigationName: '',
  },
];

// 底部list数组
const bottomList = [
  {
    icon: purchaseRecordingImg,
    title: '购买记录',
  },
  {
    icon: scanImg,
    title: '扫一扫',
  },
  {
    icon: purchaseRecordingImg,
    title: '兑换码',
  },
  {
    icon: settingImg,
    title: '设置',
  },
];
@connect(R.pick(['userInfo']))
class Parental extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validTime: '',
      bannerIndex: 0,
      bannerHosts: '',
      bannerArr: [],
    };
  }

  static navigationOptions = () => ({
    tabBarLabel: i18n.t('tab.parental'),
    tabBarIcon: ({ focused }) => (
      <FastImage source={focused ? parentalImg : parentalGrayImg} style={styles.icon} />
    ),
    tabBarOnPress: ({ navigation }) => {
      // do other things
      const { navigate, state } = navigation;
      AudioManager.click();
      navigate(state.routeName);
    },
  });

  /**
   * @description: 获取轮播图数据
   * @param : location: '3'
   * @return:
   */
  getBanner = async () => {
    const banner = await new Promise(res => {
      dispatch('GET_PARENTAL_BANNER', {
        location: '3',
        res,
      });
    });
    if (banner.msg === 'Success') {
      const { banner_hosts: bannerHosts } = banner.result;
      const { banners: bannerArr } = banner.result;
      this.setState({ bannerArr, bannerHosts });
    }
  };

  /**
   * @description: 点击头像跳转编辑资料页面
   * @param :
   * @return:
   */
  avatarClick = () => {
    const { navigation } = this.props;
    navigation.navigate('editUserInfo');
  };

  UNSAFE_componentWillMount() {
    this.getBanner();
  }

  /**
   * @description: 学习报告 家长课堂 学习规划 点击事件
   * @param :
   * @return:
   */
  absoluteWhiteItemClick(item) {
    const { navigation } = this.props;
    const { navigate } = navigation;
    switch (item.title) {
      case '学习报告':
        navigate('studyReport', { title: item.title });
        break;
      case '生词本':
        navigate('newWords');
        break;
      case '排行榜':
        navigate('rank');
        break;
      default:
        break;
    }
  }

  /**
   * @description: 轮播图索引发生变化函数
   * @param : 轮播图索引
   * @return: null
   */
  bannerIndexChanged(bannerIndex) {
    this.setState({ bannerIndex });
  }

  /**
   * @description: 轮播图点击事件
   * @param : 点击的轮播图index
   * @return: null
   */
  bannerTouchOpacityClick(item) {
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate('bannerDetail', { href: item.target_url });
  }

  /**
   * @description: 底部ListItem点击事件
   * @param :
   * @return: null
   */
  itemPress = item => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    switch (item.title) {
      case '购买记录':
        navigate('purchaseRecording', { title: item.title });
        break;
      case '扫一扫':
        this.requestCameraPermission();
        break;
      case '设置':
        navigate('settingsList');
        break;
      case '选择地址':
        navigate('map');
        break;
      case '兑换码':
        this.onExchangeCodeClick();
        break;
      default:
        break;
    }
  };

  // 兑换码点击事件
  onExchangeCodeClick = () => {
    const { userInfo, navigation } = this.props;

    const { user } = userInfo;
    if (user && user.role !== '99') {
      navigation.navigate('exchangeCode');
      return;
    }

    navigation.navigate('pageRegister', {
      redirectRouteName: 'parental',
      userInfo,
      res: user => {
        if (user && user.user && user.user.role !== '99') {
          // 用户已经登录，那么 跳转到兑换码页面
          navigation.navigate('exchangeCode');
        }
      },
    });
  };

  requestCameraPermission = async () => {
    const { navigation } = this.props;
    try {
      if (Platform.OS === 'ios') {
        navigation.navigate('codeScan', { transition: 'forVertical' });
        return;
      }
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: '使用相机权限',
        message: '申请您的相机权限' + '用以拍照',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        navigation.navigate('codeScan', { transition: 'forVertical' });
      }
    } catch (err) {}
  };

  render() {
    const { userInfo } = this.props;
    const { head_url, user } = userInfo;
    const {
      div_header,
      is_member,
      nick: userName,
      validity_date_show,
      gold = 0,
      role,
      birthday,
    } = user;
    let icon = head_url + div_header;
    let nick = userName;
    if (!div_header) {
      icon = avatarImg;
    }
    if (!nick) {
      nick = '宝贝';
    }
    const age = getUserAge(birthday);
    return (
      <View style={[styles.container]}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <View style={styles.topView}>
            <View style={styles.avatarView}>
              <Avatar
                activeOpacity={1.0}
                rounded
                size={UI.scaleSize(60)}
                source={
                  div_header && div_header !== 'user/header/headicon0.png'
                    ? { uri: icon }
                    : avatarImg
                }
              />
            </View>
            <View style={styles.nickView}>
              <Text style={styles.nickText}>{nick}</Text>
              <MyTouchableOpacity style={styles.editTouch} onPress={this.avatarClick}>
                <FastImage style={styles.editImg} source={editImg} resizeMode="contain" />
              </MyTouchableOpacity>
            </View>
            <Text style={styles.ageText}>{age}</Text>
            <ImageBackground
              style={styles.integralInnerView}
              source={integralCicleImg}
              resizeMode="contain"
            >
              <FastImage style={styles.integralImg} source={intergralImg} resizeMode="contain" />
              <Text style={styles.integralText}>{gold || 0}</Text>
            </ImageBackground>
          </View>
          <View style={styles.dividerView} />
          <View style={{ backgroundColor: 'white' }}>
            <View style={styles.midView}>
              {absoluteWhiteList.map((item, i) => (
                <TouchableOpacity
                  key={_.uniqueId()}
                  style={styles.columnTouchOpacity}
                  onPress={() => {
                    this.absoluteWhiteItemClick(item);
                  }}
                >
                  <FastImage
                    style={styles.studyIconImage}
                    source={item.icon}
                    resizeMode="contain"
                  />
                  <Text style={styles.studyText}>{item.title}</Text>
                  <FastImage source={iconRightImg} resizeMode="contain" style={styles.iconRight} />
                  {i !== 2 && <View style={styles.lineView} />}
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ height: UI.scaleSize(5), backgroundColor: '#F2F2F2' }} />
            <View>
              <View style={[styles.midView, { marginTop: 0 }]}>
                {bottomList.map((item, i) => (
                  <TouchableOpacity
                    key={_.uniqueId()}
                    style={styles.columnTouchOpacity}
                    onPress={() => {
                      this.itemPress(item);
                    }}
                  >
                    <FastImage
                      style={styles.studyIconImage}
                      source={item.icon}
                      resizeMode="contain"
                    />
                    <Text style={styles.studyText}>{item.title}</Text>
                    <FastImage
                      source={iconRightImg}
                      resizeMode="contain"
                      style={styles.iconRight}
                    />
                    {i !== 3 && <View style={styles.lineView} />}
                  </TouchableOpacity>
                ))}
              </View>
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
    // backgroundColor: '#F5F5F5',
  },
  topView: {
    backgroundColor: UI.color.primary,
    height: UI.scaleSize(195),
    paddingTop: UI.scaleSize(40),
    alignItems: 'center',
  },
  avatarView: {
    backgroundColor: '#AADAFD',
    marginTop: UI.scaleSize(10),
    width: UI.scaleSize(79),
    height: UI.scaleSize(79),
    borderRadius: UI.scaleSize(79 / 2),
    borderColor: '#FFFFFF',
    borderWidth: UI.scaleSize(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInnerView: {
    backgroundColor: 'white',
    padding: UI.scaleSize(14),
    alignItems: 'center',
    justifyContent: 'center',
    width: UI.scaleSize(120),
    height: UI.scaleSize(120),
    borderRadius: UI.scaleSize(60),
  },
  editTouch: {
    // position: 'absolute',
    // top: UI.scaleSize(30),
    // right: 0,
    width: UI.scaleSize(20),
    height: UI.scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: UI.scaleSize(5),
  },
  editImg: {
    width: UI.scaleSize(10),
    height: UI.scaleSize(10),
  },
  iconView: {
    backgroundColor: 'white',
    position: 'absolute',
    right: UI.scaleSize(-10),
    top: UI.scaleSize(-10),
    height: UI.scaleSize(40),
    width: UI.scaleSize(40),
    borderRadius: UI.scaleSize(20),
    padding: UI.scaleSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipImg: {
    width: UI.scaleSize(25),
    height: UI.scaleSize(25),
  },
  nickView: {
    marginTop: UI.scaleSize(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickText: {
    fontSize: UI.scaleSize(17),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  ageText: {
    fontSize: UI.scaleSize(13),
    color: '#FFFFFF',
  },
  integralView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: UI.scaleSize(10),
    width: UI.scaleSize(100),
    height: UI.scaleSize(40),
    borderRadius: UI.scaleSize(20),
    borderColor: '#FE9801',
    borderWidth: UI.scaleSize(2),
    flexDirection: 'row',
    paddingHorizontal: UI.scaleSize(20),
    paddingVertical: UI.scaleSize(8),
  },
  integralInnerView: {
    position: 'absolute',
    top: UI.scaleSize(30),
    right: UI.scaleSize(25),
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

  icon: {
    width: UI.scaleSize(28),
    height: UI.scaleSize(28),
  },
  grayImg: {
    backgroundColor: 'gray',
  },
  topUserInfoView: {
    width: UI.size.deviceWidth,
    height: UI.scaleSize(300),
    backgroundColor: '#FFE24F',
  },
  topRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: UI.size.deviceWidth - UI.scaleSize(32),
    height: UI.scaleSize(100),
    marginTop: UI.scaleSize(32),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  vipLeftThreeView: {
    width: UI.scaleSize(187),
    height: UI.scaleSize(95),
  },
  noVipLeftThreeView: {
    width: UI.scaleSize(187),
    height: UI.scaleSize(95),
    justifyContent: 'center',
  },
  userNameText: {
    color: '#333333',
    fontSize: UI.scaleSize(20),
  },
  vipImage: {
    marginTop: UI.scaleSize(10),
    width: UI.scaleSize(99),
    height: UI.scaleSize(26),
    borderRadius: UI.scaleSize(12),
  },
  validTimeText: {
    marginTop: 5,
    color: '#6A5900',
    fontSize: UI.scaleSize(12),
  },
  rightArrowImage: {
    width: UI.scaleSize(18),
    height: UI.scaleSize(18),
  },
  whiteAbsoluteView: {
    top: UI.scaleSize(-30),
    width: UI.size.deviceWidth - UI.scaleSize(32),
    height: UI.scaleSize(97),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: UI.scaleSize(10),
  },
  wrapper: {
    marginTop: UI.scaleSize(70),
    width: UI.size.deviceWidth,
    height: UI.scaleSize(66),
  },
  bannerTouchOpacity: {
    width: UI.size.deviceWidth - UI.scaleSize(32),
    height: UI.scaleSize(66),
    borderRadius: UI.scaleSize(10),
    overflow: 'hidden',
    alignSelf: 'center',
  },
  sliderImage: {
    width: UI.size.deviceWidth - UI.scaleSize(32),
    alignItems: 'center',
    height: UI.scaleSize(66),
  },
  dot: {
    width: UI.scaleSize(6),
    height: UI.scaleSize(6),
    marginLeft: UI.scaleSize(5),
    alignSelf: 'flex-end',
  },
  activeDot: {
    width: UI.scaleSize(10),
    height: UI.scaleSize(6),
    marginLeft: UI.scaleSize(5),
    alignSelf: 'flex-end',
  },
  columnTouchOpacity: {
    alignItems: 'center',
    flexDirection: 'row',
    height: UI.scaleSize(50),
    width: UI.size.deviceWidth - UI.scaleSize(30),
  },
  studyIconImage: {
    width: UI.scaleSize(20),
    height: UI.scaleSize(20),
  },
  studyText: {
    color: UI.color.text5,
    fontSize: UI.scaleSize(15),
    marginLeft: UI.scaleSize(17),
    width: UI.size.deviceWidth - UI.scaleSize(68),
  },
  lineView: {
    position: 'absolute',
    left: UI.scaleSize(38),
    bottom: UI.scaleSize(1),
    width: UI.size.deviceWidth - UI.scaleSize(38),
    height: UI.scaleSize(1),
    backgroundColor: '#F5F5F5',
  },
  iconRight: {
    width: UI.scaleSize(7),
    height: UI.scaleSize(11),
  },
  midView: {
    marginTop: UI.scaleSize(5),
    paddingHorizontal: UI.scaleSize(15),
    width: UI.size.deviceWidth,
  },

  item: {
    height: UI.scaleSize(50),
    width: UI.size.deviceWidth - UI.scaleSize(40),
    alignSelf: 'center',
    marginBottom: UI.scaleSize(10),
    borderRadius: UI.scaleSize(10),
  },
  dividerView: {
    height: UI.scaleSize(5),
  },
  itemTitle: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
  },
});

export default Parental;
