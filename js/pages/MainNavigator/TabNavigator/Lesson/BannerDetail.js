import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { WebView } from 'react-native-webview';

import UI from '~/modules/UI';
import NavigationHeader from '~/components/NavigationHeader';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import EventTracking from '~/modules/services/event-tracking';

const backImg = require('~/images/back2.png');

class BannerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadEnd: false,
    };
  }

  static navigationOptions = () => ({
    header: null,
  });

  press = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { source } = params;
    let index;
    let reqName;
    switch (source) {
      case '轮播图':
        index = params.index;
        console.log('navigateindex: ', index);
        break;
      case '活动购买按钮':
        index = 0;
        break;
      case '图书会员':
        index = 2;
        break;
      case '了解更多':
        index = 2;
        break;
      default:
        break;
    }
    if (source === '活动购买按钮') {
      EventTracking.track('t0105', 'r0136');
    } else if (source === '轮播图') {
      if (params.index === 0) {
        reqName = 'r0503';
      } else if (params.index === 1) {
        reqName = 'r0505';
      } else {
        reqName = 'r0507';
      }
      EventTracking.track('t0101', reqName);
      EventTracking.track('t0105', reqName);
    }
    navigation.replace('order', { defaultIndex: index });
  };

  render() {
    const { navigation } = this.props;
    const { loadEnd } = this.state;
    return (
      <View style={styles.container}>
        <NavigationHeader
          leftIcon={backImg}
          navigation={navigation}
          containerStyle={{ backgroundColor: 'white' }}
        />
        {/* <View style={{ flex: 1 }}> */}
        {/* <ScrollView style={{ flex: 1 }}> */}
        {/* <View style={{ height: navigation.state.params.height }}> */}
        {/* <FastImage
                source={navigation.state.params.info}
                style={{
                  width: UI.size.deviceWidth,
                  height: (400 * navigation.state.params.height) / UI.size.deviceWidth,
                }}
                // resizeMode="stretch"
                resizeMode={FastImage.resizeMode.stretch}
              /> */}

        <WebView
          ref={o => {
            this.webView = o;
          }}
          source={{ uri: navigation.state.params.target_url }}
          // onNavigationStateChange={newestState => {
          //   this.setState({ state: newestState });
          // }}
          // onLoadEnd={() => {
          //   this.setState({ loadEnd: true });
          // }}
          onLoadEnd={() => {
            this.setState({ loadEnd: true });
          }}
        />
        {/* </View> */}
        {/* </ScrollView> */}
        {!loadEnd && (
          <View style={styles.absolute}>
            <ActivityIndicator size="large" color={UI.color.primary2} />
          </View>
        )}
        {/* </View> */}
        <MyTouchableOpacity style={styles.btnView} onPress={this.press}>
          <Text style={styles.btnText}>立即购买</Text>
        </MyTouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnView: {
    position: 'absolute',
    bottom: UI.scaleSize(30),
    left: (UI.size.deviceWidth - UI.scaleSize(250)) / 2,
    width: UI.scaleSize(250),
    height: UI.scaleSize(60),
    backgroundColor: UI.color.primary2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: UI.scaleSize(30),
  },
  btnText: {
    color: 'white',
    fontSize: UI.scaleSize(18),
    fontWeight: 'bold',
  },
});

export default BannerDetail;
