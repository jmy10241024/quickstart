import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import UI from '~/modules/UI';

const backImg = require('~/images/back.png');

class MyWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: {
        loadEnd: false,
      },
    };
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    const { loadEnd } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: UI.size.statusBarHeight + UI.scaleSize(6) }} />
        <WebView
          ref={o => {
            this.webView = o;
          }}
          source={{ uri: navigation.state.params.url }}
          onNavigationStateChange={newestState => {
            this.setState({ state: newestState });
          }}
          onLoadEnd={() => {
            this.setState({ loadEnd: true });
          }}
        />
        {!loadEnd && (
          <View style={styles.position}>
            <ActivityIndicator size="large" color={UI.color.primary2} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: UI.scaleSize(50),
    height: UI.scaleSize(50),
  },
  position: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyWeb;
