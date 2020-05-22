import React, { Component } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { QRScannerRectView } from 'react-native-qrcode-scanner-view';
import { Toast } from 'teaset';
import { RNCamera } from 'react-native-camera';

import UI from '~/modules/UI';
import NavigationHeader from '~/components/NavigationHeader';

const whiteBackImg = require('~/images/close.png');

class CodeScan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  static navigationOptions = {
    // title: '扫一扫',
    header: null,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ active: true });
    }, 200);
  }

  renderTitleBar = () => <Text style={styles.text}>扫一扫</Text>;

  renderMenu = () => <Text style={styles.text} />;

  barcodeReceived = event => {
    const { navigation } = this.props;
    if (event.data.indexOf('http') !== -1 || event.data.indexOf('https') !== -1) {
      navigation.navigate('myWeb', { url: event.data });
    }
  };

  leftIconPress = () => {
    this.setState({
      active: false,
    });
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 100);
  };

  render() {
    const { active } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: UI.color.text3 }}>
        {/* <View style={styles.positionView}>
          <ActivityIndicator size="small" color={UI.color.text1} />
        </View> */}
        {active ? (
          <RNCamera
            style={styles.preview}
            onBarCodeRead={this.barcodeReceived}
            renderFooterView={this.renderMenu}
            scanBarAnimateReverse
          >
            <QRScannerRectView />
          </RNCamera>
        ) : null}
        <NavigationHeader
          leftIcon={whiteBackImg}
          leftIconStyle={{ tintColor: 'white' }}
          navigation={this.props.navigation}
          title="扫一扫"
          titleStyle={{ color: 'white' }}
          containerStyle={{ backgroundColor: 'transparent' }}
          isPosition
          leftIconPress={this.leftIconPress}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    textAlign: 'center',
    padding: UI.scaleSize(16),
  },
  positionView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
  },
});
export default CodeScan;
