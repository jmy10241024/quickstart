import React, { Component } from 'react';
import { StatusBar, Platform, View } from 'react-native';
import { Provider } from 'react-redux';
import Config from 'react-native-config';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '~/modules/redux-app-config';
import * as WeChat from 'react-native-wechat';
import AppContent from './AppContent';
import codePush from 'react-native-code-push';
import NetInfoManager from '~/modules/services/netInfo';

class App extends Component {
  UNSAFE_componentWillMount() {
    codePush.disallowRestart();
  }

  componentDidMount() {
    console.log('============= Config ============= ', Config);
    WeChat.registerApp(Config.WECHAT_ID);
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('dark-content');
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    );
  }
}
App = codePush({ installMode: codePush.InstallMode.ON_NEXT_RESTART })(App);

export default App;
