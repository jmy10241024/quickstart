import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import RNExitApp from 'react-native-exit-app';

import UI from '~/modules/UI';

class PrivacyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  userAgreePress = () => {
    this.navigateToWeb(0);
  };

  privacyPress = () => {
    this.navigateToWeb(1);
  };

  navigateToWeb = index => {
    this.props.navigation.navigate('myWeb', {
      url:
        index === 0
          ? 'https://r-read.dubaner.com/wechat/static/protocol.htm'
          : 'https://guoshuyu.cn/home/index/privacy.html',
    });
  };

  render() {
    const { visible, navigation, setVisible } = this.props;
    if (!visible) {
      return null;
    }
    return (
      <View style={styles.position}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>xxx用户协议及隐私政策</Text>
            <View style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }}>
                <View style={styles.contentView}>
                  <Text style={styles.content}>
                    感谢您下载并使用xxx应用程序，我们非常重视您的个人信息和隐私保护。在您使用xxx产品和服务前，<Text
                      style={styles.content2}
                    >
                      请您仔细阅读、充分理解协议中的条款内容再点击同意（尤其是以粗体标识的条款，因为这些条款可能会明确您应履行的义务或对您的权利有所限制）：{
                        '\n'
                      }
                    </Text>
                    <Text style={styles.content3} onPress={this.userAgreePress}>
                      《用户协议》{'\n'}
                    </Text>
                    <Text style={styles.content3} onPress={this.privacyPress}>
                      《隐私政策》{'\n'}
                    </Text>
                    <Text style={styles.content2}>
                      如果您是未满18周岁的未成年人，请通知您的监护人共同阅读以上协议并特别关注未成年人信息保护部分，并在使用我们的产品、服务或提交个人信息之前，寻求他们的同意和指导。{
                        '\n'
                      }如您使用产品和服务，请您点击同意后使用。
                    </Text>如您对以上协议有任何疑问，您可以随时与客服联系。
                  </Text>
                </View>
              </ScrollView>
            </View>
            <View style={{ height: UI.scaleSize(10) }} />
            <View style={styles.line1} />
            <View style={styles.bottom}>
              <TouchableOpacity
                style={UI.style.container}
                onPress={() => {
                  RNExitApp.exitApp();
                }}
              >
                <Text style={styles.btText1}>不同意</Text>
              </TouchableOpacity>
              <View style={styles.line2} />
              <TouchableOpacity
                style={UI.style.container}
                onPress={() => {
                  setVisible && setVisible();
                }}
              >
                <Text style={styles.btText2}>同意</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: (UI.size.deviceWidth / 3) * 2,
    height: UI.scaleSize(300),
    backgroundColor: UI.color.white,
    borderRadius: UI.scaleSize(20),
  },
  title: {
    marginTop: UI.scaleSize(20),
    marginBottom: UI.scaleSize(10),
    fontSize: UI.scaleSize(18),
    color: UI.color.text1,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  contentView: {
    paddingHorizontal: UI.scaleSize(16),
  },
  content: {
    fontSize: UI.scaleSize(14),
    lineHeight: UI.scaleSize(20),
    color: UI.color.text2,
  },
  content2: {
    color: UI.color.text1,
    fontWeight: 'bold',
  },
  content3: {
    color: UI.color.primary2,
    fontWeight: 'bold',
    fontSize: UI.scaleSize(16),
    lineHeight: UI.scaleSize(24),
  },
  line1: {
    height: UI.scaleSize(1),
    width: (UI.size.deviceWidth / 3) * 2,
    backgroundColor: UI.color.text4,
  },
  line2: {
    height: UI.scaleSize(40),
    width: UI.scaleSize(1),
    backgroundColor: UI.color.text4,
  },
  bottom: {
    height: UI.scaleSize(40),
    width: (UI.size.deviceWidth / 3) * 2,
    flexDirection: 'row',
  },
  btText1: {
    fontSize: UI.scaleSize(16),
    color: UI.color.text2,
  },
  btText2: {
    fontSize: UI.scaleSize(16),
    color: UI.color.primary2,
  },
});

export default PrivacyModal;
