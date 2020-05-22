import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Platform } from 'react-native';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import SafeAreaView from 'react-native-safe-area-view';
import Toast from 'react-native-root-toast';
import moment from 'moment';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import { dispatch } from '~/modules/redux-app-config';
import UI from '~/modules/UI';
import i18n from '~/i18n';
import { checkPhone } from '~/modules/services/utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import EventTracking from '~/modules/services/event-tracking';

const backImg = require('~/images/back.png');
const rightImg = require('~/images/right.png');
const loginJson = require('~/animations/login.json');
const loginImg = require('./img/login.png');

class PageRegister extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: '',
      countdown: 61,
      endTime: 0,
      sendText: '获取验证码',
      radio: 0,
    };
  }

  toast(msg) {
    Toast.show(msg, { position: Toast.positions.CENTER });
  }

  sendCode = () => {
    if (this.interval) {
      return;
    }
    const { phone } = this.state;
    if (!phone) {
      return this.toast('请输入手机号');
    }
    if (!checkPhone(phone)) {
      return this.toast('请输入正确的手机号');
    }
    dispatch('SEND_SMS_CODE', {
      mobile: phone,
      sms_type: '4',
      res: res => {
        if (res && res.msg === 'Success') {
          this.toast('验证码发送成功');
          this.setState({ sendText: '重新获取' });
          this.setState({ endTime: moment().unix() + 60 });
          this.interval = setInterval(() => {
            const { endTime, countdown } = this.state;
            if (endTime - moment().unix() < 0) {
              this.clearInterval();
              return;
            }
            this.setState({ countdown: countdown + 1 });
          }, 1000);
        } else {
          this.toast(res && res.msg);
        }
      },
    });
  };

  navigateTo(userInfo) {
    const { navigate, state, goBack } = this.props.navigation;
    navigate(state.params.redirectRouteName, {
      ...state.params.redirectParams,
      loginUser: userInfo,
    });
    state.params.res && state.params.res(userInfo);
  }

  register = async () => {
    const { phone, code, radio } = this.state;
    if (radio !== 1) {
      return this.toast('请阅读并同意《用户协议》和《隐私政策》');
    }
    if (!phone) {
      return this.toast('请输入手机号');
    }
    if (!code) {
      return this.toast('请输入验证码');
    }
    dispatch('REGISTER_LOGIN', {
      mobile: phone,
      code,
      res: res => {
        if (res && res.msg === 'Success') {
          this.navigateTo(res.result);
        } else {
          this.toast(res && res.msg);
        }
      },
    });
  };

  onPhoneChange = phone => {
    this.setState({ phone: phone.replace(/ /g, '') });
  };

  onCodeChange = code => {
    this.setState({ code: code.replace(/ /g, '') });
  };

  clearInterval() {
    this.interval && clearInterval(this.interval);
    this.interval = null;
  }

  goBack = () => {
    const { navigate, state } = this.props.navigation;
    navigate(state.params.redirectRouteName, state.params.redirectParams);
  };

  UNSAFE_componentWillMount() {
    this.clearInterval();
  }
  componentDidMount() {
    const { state } = this.props.navigation;
    const name = state.params.redirectRouteName;
    if (name === 'book' || name === 'lesson') {
      EventTracking.track('t0101', 'r0502');
      EventTracking.track('t0105', 'r0502');
    }
  }

  render() {
    const { navigation } = this.props;
    const { phone, code, sendText, endTime } = this.state;
    return (
      <View style={styles.flex}>
        <KeyboardAwareScrollView style={styles.flex} keyboardShouldPersistTaps="handled">
          <View style={[styles.flex, { alignItems: 'center' }]}>
            <MyTouchableOpacity style={styles.backView} onPress={this.goBack}>
              <Image source={backImg} style={styles.backImg} />
            </MyTouchableOpacity>
            <Text style={styles.welcome}>欢迎登录</Text>
            <View style={styles.imageView}>
              <Image source={loginImg} style={styles.image} resizeMode="contain" />
            </View>
            {/* <View style={styles.lottie}>
              <LottieView
                ref={animation => {
                  this.animation = animation;
                }}
                resizeMode={Platform === 'ios' ? 'contain' : 'cover'}
                source={loginJson}
                autoPlay
                loop={true}
              />
            </View> */}
            <View style={styles.phoneView}>
              <Text style={styles.phonePlaceholder}>{phone ? '' : '请输入手机号'}</Text>
              <View style={{ flex: 1 }} />
              <TextInput
                maxLength={11}
                style={styles.phone}
                value={phone}
                keyboardType="numeric"
                autoCorrect={false}
                onChangeText={this.onPhoneChange}
              />
            </View>
            <View style={styles.line} />
            <View style={styles.codeView}>
              <Text style={styles.phonePlaceholder}>{code ? '' : '请输入验证码'}</Text>
              <View style={{ flex: 1 }} />
              <TextInput
                style={styles.codeInput}
                value={code}
                keyboardType="numeric"
                placeholderTextColor={UI.color.text3}
                autoCorrect={false}
                onChangeText={this.onCodeChange}
              />

              <TouchableOpacity style={styles.codeBtn} onPress={this.sendCode}>
                <Text
                  style={[
                    styles.codeText,
                    endTime - moment().unix() > 0 &&
                    endTime - moment().unix() <= 60 && { color: '#CBCBCB' },
                  ]}
                >
                  {sendText}
                  {endTime - moment().unix() > 0 && endTime - moment().unix() <= 60
                    ? `（${endTime - moment().unix()}s）`
                    : ''}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <View style={styles.privacyView}>
              <RadioForm animation={true}>
                {/* To create radio buttons, loop through your array of options */}
                {[1].map((obj, i) => (
                  <RadioButton labelHorizontal={true} key={i}>
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={this.state.radio === 1}
                      onPress={() => {
                        const { radio } = this.state;
                        this.setState({ radio: radio === 1 ? 0 : 1 });
                      }}
                      borderWidth={1}
                      buttonInnerColor={UI.color.primary2}
                      buttonOuterColor={UI.color.primary2}
                      buttonSize={UI.scaleSize(15)}
                      buttonOuterSize={UI.scaleSize(20)}
                      buttonStyle={{
                        marginTop: UI.scaleSize(5),
                      }}
                    />
                  </RadioButton>
                ))}
              </RadioForm>

              <Text style={styles.privacy}>
                我已同意
                <Text
                  onPress={() => {
                    navigation.navigate('myWeb', {
                      url: 'https://r-read.dubaner.com/wechat/static/protocol.htm',
                    });
                  }}
                  style={{ color: UI.color.primary2 }}
                >
                  《用户协议》
                </Text>和<Text
                  onPress={() => {
                    navigation.navigate('myWeb', {
                      url: 'https://r-read.dubaner.com/wechat/static/privacy.htm',
                    });
                  }}
                  style={{ color: UI.color.primary2 }}
                >
                  《隐私政策》
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={this.register}
              style={[styles.btnView, phone && code && { backgroundColor: '#FFFFFF' }]}
            >
              <Text style={[styles.loginText, phone && code && { color: '#503F03' }]}>
                登录/注册
              </Text>
              <FastImage
                tintColor="#FF8811"
                source={rightImg}
                style={styles.right}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <View height={UI.scaleSize(20)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFD033',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backView: {
    height: UI.scaleSize(50),
    marginTop: UI.scaleSize(20),
    width: UI.scaleSize(50),
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginLeft: UI.scaleSize(20),
  },
  backImg: {
    width: UI.scaleSize(24),
    height: UI.scaleSize(24),
  },
  lottie: {
    width: UI.scaleSize(180),
    height: UI.scaleSize(180),
    overflow: 'visible',
  },
  welcome: {
    fontSize: UI.scaleSize(30),
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: UI.scaleSize(42),
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    marginTop: UI.scaleSize(20),
    marginBottom: UI.scaleSize(50),
  },
  imageView: {
    marginTop: UI.scaleSize(50),
    width: UI.size.deviceWidth * (250 / 375),
    height: UI.size.deviceWidth * (187.5 / 375),
  },
  image: {
    flex: 1,
  },
  phoneView: {
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    height: UI.scaleSize(60),
    marginTop: UI.scaleSize(30),
  },
  phonePlaceholder: {
    fontSize: UI.scaleSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    position: 'absolute',
    lineHeight: UI.scaleSize(22),
    bottom: UI.scaleSize(8),
    left: UI.scaleSize(4),
  },
  line: {
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    height: UI.scaleSize(1),
    backgroundColor: 'rgba(rgba(255, 255, 255, 0.4)',
  },
  codeView: {
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    height: UI.scaleSize(60),
    alignItems: 'center',
  },
  phone: {
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    height: UI.scaleSize(40),
    paddingHorizontal: UI.scaleSize(4),
    fontSize: UI.scaleSize(18),
    paddingTop: UI.scaleSize(10),
  },
  codeInput: {
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    height: UI.scaleSize(40),
    paddingHorizontal: UI.scaleSize(4),
    fontSize: UI.scaleSize(18),
    paddingTop: UI.scaleSize(10),
  },
  codeBtn: {
    position: 'absolute',
    bottom: UI.scaleSize(8),
    right: UI.scaleSize(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    color: '#FF8811',
    fontSize: UI.scaleSize(18),
  },
  btnView: {
    flexDirection: 'row',
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    height: UI.scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI.color.text3,
    borderRadius: UI.scaleSize(30),
    marginTop: UI.scaleSize(10),
  },
  loginText: {
    fontSize: UI.scaleSize(18),
    color: '#FF8811',
    fontWeight: 'bold',
  },
  right: {
    marginLeft: UI.scaleSize(8),
    width: UI.scaleSize(20),
    height: UI.scaleSize(20),
  },
  privacyView: {
    alignItems: 'center',
    marginTop: UI.scaleSize(50),
    flexDirection: 'row',
    justifyContent: 'center',
    height: UI.scaleSize(30),
  },
  privacy: {
    color: UI.color.text2,
    marginLeft: UI.scaleSize(10),
  },
});

export default PageRegister;
