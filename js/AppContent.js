import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, BackHandler, ToastAndroid } from 'react-native';

import { store } from '~/modules/redux-app-config';
import { getRouteName } from '~/modules/services/utils';
import AppLoading from '~/components/modal/AppLoading';
import AppEnvModal from '~/components/modal/AppEnvModal';
import EyesProtect from '~/components/modal/eyes-protect';

import AppWithNavigationState from './AppRouter';

let lastBackPressed;
const onBackAndroid = () => {
  const routeName = getRouteName(store.getState().nav);
  if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
    // 最近2秒内按过back键，可以退出应用。
    return false;
  }
  lastBackPressed = Date.now();
  ToastAndroid.show('再按一次退出程序', ToastAndroid.SHORT);
  return true;
};

function AppContent() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onBackAndroid);
    }
    return () => {
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <AppWithNavigationState />
      </View>
      <AppLoading />
      <AppEnvModal />
      <EyesProtect />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppContent;
