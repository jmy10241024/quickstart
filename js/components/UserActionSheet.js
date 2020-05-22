import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import ActionSheet from 'react-native-actionsheet';

import { launchMini } from '~/modules/services/utils';
import EventTracking from '~/modules/services/event-tracking';

class UserActionSheet extends Component {
  constructor(props) {
    super(props);
    this.gradeName = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
    this.sheetOtions = [
      ['了解更多', '已购买', '取消'],
      ['了解更多', '取消'],
      ['切换年级', '开通全年级权限', '取消'],
    ];
    this.state = {
      title: '',
      options: this.sheetOtions[0],
      redirectRouteName: '',
      redirectParams: {},
    };
  }

  UNSAFE_componentWillMount() {
    this.actionSheetListener = DeviceEventEmitter.addListener(
      'ActionSheet',
      this.onActionSheetMessage,
    );
  }

  componentWillUnmount() {
    this.actionSheetListener && this.actionSheetListener.remove();
  }

  onActionSheetMessage = params => {
    console.log('onActionSheetMessageparams: ', params);
    const { msg, book = {}, redirectRouteName = '', redirectParams = {} } = params;
    const { userInfo } = this.props;
    const { study_year } = userInfo.user;
    let title = '您还未拥有该年级阅读权限哦';
    let optionID = 0;
    switch (params.msg) {
      case 'VISITOR': //游客
        break;

      case 'NO_VIP': //未付费
        optionID = 1;
        break;

      case 'NO_SUPER_VIP': //单年级付费会员点击非该年级的收费项目
        title = `您当前的年级为${this.gradeName[study_year - 1]} ，是否需要切换为${
          this.gradeName[book.grade.split('')[1] - 1]
        }>`;
        optionID = 2;
        break;
      case 'VIP9.9': // 9.9月卡体验会员限制只能读8本书
        title = '正式会员才可以浏览这本书哦';
        optionID = 1;
        break;
      default:
        break;
    }
    this.setState({
      title,
      options: this.sheetOtions[optionID],
      msg,
      redirectRouteName,
      redirectParams,
    });
    this.actionSheet.show();
  };

  onPress = index => {
    const { options, redirectRouteName, redirectRouteParams } = this.state;
    const { userInfo, navigation } = this.props;
    const { navigate } = navigation;

    switch (options[index]) {
      case '了解更多':
        navigation.navigate('bannerDetail', {
          target_url: 'https://r-read.dubaner.com/share/build/328.html',
          source: '了解更多',
        });
        break;
      case '已购买':
        navigate('pageRegister', { redirectRouteName, redirectRouteParams });
        break;
      case '切换年级':
        launchMini(userInfo);
        break;
      case '开通全年级权限':
        navigate('order', { defaultIndex: 2 });
        break;
      default:
        break;
    }
  };

  render() {
    const { title, options } = this.state;
    return (
      <ActionSheet
        ref={o => {
          this.actionSheet = o;
        }}
        title={title}
        options={options}
        cancelButtonIndex={options.length - 1}
        destructiveButtonIndex={options.length - 2}
        onPress={this.onPress}
      />
    );
  }
}

export default UserActionSheet;
