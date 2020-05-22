import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';
import { dispatch } from '~/modules/redux-app-config';

import SplashScreen from 'react-native-splash-screen';

@connect(R.pick(['userInfo']))
class AuthLoadingScreen extends React.Component {
  UNSAFE_componentWillMount() {
    dispatch('GET_USERINFO', {
      callback: res => {
        SplashScreen.hide();
        this.props.navigation.navigate('main', { transition: 'forFade' });
      },
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AuthLoadingScreen;
