import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  BackHandler,
  ToastAndroid,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import Promise from 'bluebird';

import UI from '~/modules/UI';
import { store, dispatch } from '~/modules/redux-app-config';
import i18n from '~/i18n';
import { getRouteName, checkPermission } from '~/modules/services/utils';
import AppWithNavigationState from './AppRouter';
import AppLoading from './AppLoading';
import AppEnv from './AppEnvModal';
import ContentLoader from '~/components/ContentLoader';
import EventTracking from '~/modules/services/event-tracking';

class AppContent extends Component {
  UNSAFE_componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }
    this.permissionsTrack();
    // if (!store.getState().userInfo.user) {
    //   asyncAction('USER_LOGIN');
    // }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }
  }

  async permissionsTrack() {
    await Promise.delay(10 * 1000);
    const storagePer = await checkPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    const readPhonePer = await checkPermission(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
    const { readStorage, readPhoneState } = store.getState().permissionsInfo;
    if (!readStorage && storagePer) {
      EventTracking.track('t0101', 'r0130');
      EventTracking.track('t0105', 'r0130');
      dispatch('SET_PERMISSIONS_INFO', { readStorage: true });
    }
    if (!readPhoneState && readPhonePer) {
      EventTracking.track('t0101', 'r0131');
      EventTracking.track('t0105', 'r0131');
      dispatch('SET_PERMISSIONS_INFO', { readPhoneState: true });
    }
  }

  onBackAndroid() {
    // return false;
    const routeName = getRouteName(store.getState().nav);
    if (routeName === 'grade') {
      return true;
    }
    if (routeName !== 'lesson' && routeName !== 'pageRegister') {
      store.dispatch({ type: 'Navigation/BACK' });
      return true;
    }
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      // 最近2秒内按过back键，可以退出应用。
      return false;
    }
    this.lastBackPressed = Date.now();
    ToastAndroid.show('再按一次退出程序', ToastAndroid.SHORT);
    return true;
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <AppWithNavigationState />
        </View>
        <AppLoading />
        <AppEnv />
        <ContentLoader />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppContent;
