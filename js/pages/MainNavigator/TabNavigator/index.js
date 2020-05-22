import React, { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { Platform, View, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';

import UI from '~/modules/UI';
import i18n from '~/i18n';
import { dispatch } from '~/modules/redux-app-config';
import TabBar from '~/components/TabBar';
import UserActionSheet from '~/components/UserActionSheet';

import Lesson from './Lesson/index.js';
import Book from './Book/index.js';
import Learn from './Learn';
import Parental from './Parental/index.js';
import PrivacyModal from './Lesson/PrivacyModal';
import Menu from '~/components/Menu';

const tabConfig = {
  initialRouteName: 'lesson',
  // backBehavior: 'none',
  tabBarComponent: TabBar,
  defaultNavigationOptions: {
    headerStyle: {
      height: UI.size.statusBarHeight + UI.scaleSize(50),
      paddingTop: UI.size.statusBarHeight,
    },
  },
  tabBarOptions: {
    showIcon: true,
    style: {
      height: UI.scaleSize(50),
    },
    activeTintColor: UI.color.black,
    inactiveTintColor: UI.color.text1,
    labelStyle: {
      fontSize: UI.scaleSize(12),
      marginRight: UI.isPad ? UI.scaleSize(10) : 0,
    },
    tabStyle: {
      height: UI.scaleSize(50),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
};

const TabNavigator = createBottomTabNavigator(
  {
    lesson: { screen: Lesson },
    book: { screen: Book },
    learn: { screen: Learn },
    parental: { screen: Parental },
  },
  tabConfig,
);

TabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  return { header: null };
  if (routeName === 'lesson') {
    return { header: null };
  }
  return {
    headerTitle: i18n.t(`tab.${routeName}`),
    headerTitleStyle: {
      flex: 1,
      fontSize: UI.scaleSize(20),
      fontWeight: 'bold',
      alignSelf: 'center',
      textAlign: Platform.OS === 'ios' ? 'center' : UI.isRTL ? 'right' : 'left',
      marginRight: Platform.OS === 'ios' ? 0 : UI.isRTL ? UI.scaleSize(20) : 0,
      color: UI.color.black,
    },
    headerStyle: {
      height: UI.scaleSize(50),
      marginTop: UI.size.statuBarHeight,
    },
    headerForceInset: { top: 'never', bottom: 'never' },
  };
};

@connect(R.pick(['userInfo', 'deviceInfo']))
class TabNavigatorComponent extends Component {
  static router = TabNavigator.router;

  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.privacyListener = DeviceEventEmitter.addListener('privacy', this.onPrivacyLoad);
  }

  componentWillUnmount() {
    this.privacyListener && this.privacyListener.remove();
  }

  onPrivacyLoad = () => {
    const isFirstOpen = this.props.deviceInfo.isFirstOpen;
    if (isFirstOpen || isFirstOpen === undefined) {
      this.setState({ visible: true });
    }
  };

  setVisible = () => {
    this.setState({ visible: false });
    dispatch('SET_FIRST_OPEN_STATE', false);
  };

  render() {
    const { visible } = this.state;
    const { userInfo } = this.props;
    const { user } = userInfo;
    return (
      <View style={{ flex: 1, backgroundColor: '#EAEAEB' }}>
        <View
          style={{
            height: this.props.navigation.state.index >= 2 ? 0 : UI.size.statusBarHeight,
          }}
        />
        <TabNavigator navigation={this.props.navigation} />
        <UserActionSheet userInfo={this.props.userInfo} navigation={this.props.navigation} />
        <PrivacyModal
          visible={visible}
          navigation={this.props.navigation}
          setVisible={this.setVisible}
        />
        <Menu user={user} navigation={this.props.navigation} />
      </View>
    );
  }
}

export default TabNavigatorComponent;
