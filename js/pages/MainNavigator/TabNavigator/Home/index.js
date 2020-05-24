import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';

import i18n from '~/i18n';
import UI from '~/modules/UI';
import PrivacyModal from '~/components/modal/privacy-modal';
import actions, { dispatch } from '~/modules/redux-app-config';

const accountImg = require('~/images/account.png');

@connect(
  R.pick(['userInfo', 'deviceInfo']),
  actions,
)
class Home extends Component {
  static navigationOptions = () => ({
    tabBarLabel: i18n.t('tab.home'),
    tabBarIcon: ({ focused }) => (
      <Image
        style={[styles.icon, { tintColor: focused ? UI.color.primary : '#666666' }]}
        source={accountImg}
      />
    ),
    tabBarOnPress: ({ navigation }) => {
      // do other things
      const { navigate, state } = navigation;
      navigate(state.routeName);
    },
  });
  constructor(props) {
    super(props);
    this.state = {
      privacyVisible: false, // 隐私协议弹窗
    };
  }

  setPrivacyVisible = () => {
    this.setState({ privacyVisible: false });
    dispatch('SET_ACCEPT_PRIVACY_STATUS', true);
  };

  componentDidMount() {
    const { deviceInfo } = this.props;
    if (!deviceInfo.acceptPrivacy) {
      this.setState({ privacyVisible: true });
    }
  }

  render() {
    const { privacyVisible } = this.state;
    const { navigation } = this.props;
    console.log('navigation: ', navigation);
    return (
      <View style={styles.container}>
        <Text>Home</Text>
        <PrivacyModal
          visible={privacyVisible}
          navigation={this.props.navigation}
          setVisible={this.setPrivacyVisible}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: UI.scaleSize(28),
    height: UI.scaleSize(28),
  },
});

export default Home;
