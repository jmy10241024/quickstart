import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

import Toast from 'react-native-root-toast';
import moment from 'moment';
import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import { dispatch, actions } from '~/modules/redux-app-config';
import R from 'ramda';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import UI from '~/modules/UI';

import CustomNav from '~/components/CustomNav';

@connect(
  R.pick(['userInfo']),
  actions,
)
class ExchangeCode extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      exchange: '',
      code: '',
      countdown: 61,
      endTime: 0,
      sendText: '获取验证码',
      studyYear: props.userInfo.user.study_year,
    };
  }

  UNSAFE_componentWillMount() {
    this.options = ['确认', '取消', '更改年级'];
  }

  toast(msg) {
    Toast.show(msg, { position: Toast.positions.CENTER });
  }

  sendCode = () => {
    if (this.interval) {
      return;
    }
    const { exchange } = this.state;
    const { userInfo } = this.props;
    let phone = '';
    if (userInfo && userInfo.user && userInfo.user.mobile) {
      phone = userInfo.user.mobile;
    }
    if (!exchange) {
      return this.toast('请输入兑换码');
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

  checkRedeem = async () => {
    const { phone, code, exchange } = this.state;
    if (!exchange) {
      return this.toast('请输入兑换码');
    }
    if (!code) {
      return this.toast('请输入验证码');
    }
    dispatch('SET_LOADING', { visible: true });
    dispatch('REDEEM_CODE_CHECK', {
      code: exchange,
      res: res => {
        if (res && res.msg === 'Success' && res.result.status) {
          this.actionSheet.show();
        } else {
          this.toast((res && res.msg) || '兑换失败，请联系客服');
        }
      },
    });

    dispatch('SET_LOADING', { visible: false });
  };

  redeem = () => {
    const { exchange, studyYear, code } = this.state;
    dispatch('REDEEM_VIP', {
      code: exchange,
      grade: studyYear,
      sms_code: code,
      res: res => {
        if (res && res.msg === 'Success' && res.result.status) {
          this.toast('兑换成功!');
          dispatch('UPDATE_USER_WITHOUT_TOKEN', { user: res.result.user });
          this.props.navigation.goBack();
        } else {
          this.toast((res && res.msg) || '兑换失败，请联系客服');
        }
      },
    });
  };

  onSelect = index => {
    if (index === 1) {
      return;
    }
    if (index === 0) {
      this.redeem();
      return;
    }
    const { navigate } = this.props.navigation;
    navigate('grade', {
      noNeedRatingTest: true,
      noNeedUpdateUser: true,
      callback: grade => {
        this.setState({ studyYear: grade });
        setTimeout(() => {
          this.redeem();
        }, 200);
      },
    });
  };

  onExchangeChange = exchange => {
    this.setState({ exchange: exchange.replace(/ /g, '') });
  };

  onCodeChange = code => {
    this.setState({ code: code.replace(/ /g, '') });
  };

  clearInterval() {
    this.interval && clearInterval(this.interval);
    this.interval = null;
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  componentWillUnmount() {
    this.clearInterval();
  }

  render() {
    const { code, sendText, endTime, exchange, studyYear } = this.state;
    const { userInfo } = this.props;
    let phone = '';
    if (userInfo && userInfo.user && userInfo.user.mobile) {
      phone = userInfo.user.mobile;
    }
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
          <CustomNav
            containerStyle={{ backgroundColor: 'white' }}
            title="兑换"
            titleColor="#3C3C5C"
            imgType="gray"
            navigation={this.props.navigation}
          />

          <View style={styles.phoneView}>
            <Text style={styles.phonePlaceholder}>{exchange ? '' : '请输入兑换码'}</Text>
            <View style={{ flex: 1 }} />
            <TextInput
              maxLength={12}
              keyboardType="numeric"
              style={[styles.phone, { fontSize: UI.scaleSize(16) }]}
              value={exchange}
              autoCorrect={false}
              onChangeText={this.onExchangeChange}
            />
          </View>
          <View style={styles.line} />
          <View style={styles.codeView}>
            <Text style={styles.phonePlaceholder}>{phone ? '' : '请输入手机号码'}</Text>
            <View style={{ flex: 1 }} />
            <TextInput
              editable={false}
              maxLength={11}
              style={[styles.phone, styles.fixPhoneInput]}
              value={phone}
              keyboardType="numeric"
              autoCorrect={false}
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

          <TouchableOpacity
            disabled={!exchange && !code && true}
            onPress={this.checkRedeem.bind(this)}
            style={[styles.btnView, exchange && phone && code && { backgroundColor: '#FFC819' }]}
          >
            <Text style={[styles.loginText, exchange && phone && code && { color: '#503F03' }]}>
              兑换
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        <ActionSheet
          ref={o => {
            this.actionSheet = o;
          }}
          title={`您当前的年级为${studyYear}年级，请确认是否正确`}
          options={this.options}
          cancelButtonIndex={1}
          onPress={index => {
            this.onSelect(index);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
  },
  backView: {
    height: UI.scaleSize(46),
    marginTop: UI.scaleSize(20),
    width: UI.size.deviceWidth - UI.scaleSize(24),
  },
  backImg: {
    width: UI.scaleSize(46),
    height: UI.scaleSize(46),
  },
  welcome: {
    fontSize: UI.scaleSize(30),
    color: '#333333',
    fontWeight: 'bold',
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    marginTop: UI.scaleSize(40),
    marginBottom: UI.scaleSize(50),
  },
  phoneView: {
    alignSelf: 'center',
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    height: UI.scaleSize(60),
    marginTop: UI.scaleSize(40),
  },
  phonePlaceholder: {
    fontSize: UI.scaleSize(18),
    color: '#CBCBCB',
    position: 'absolute',
    bottom: UI.scaleSize(8),
    left: UI.scaleSize(4),
  },
  line: {
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    height: UI.scaleSize(1),
    backgroundColor: '#E7E7E7',
  },
  codeView: {
    alignSelf: 'center',

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
    color: '#FFC819',
    fontSize: UI.scaleSize(18),
  },
  btnView: {
    alignSelf: 'center',
    width: UI.size.deviceWidth - UI.scaleSize(24 * 2),
    height: UI.scaleSize(44),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: UI.scaleSize(22),
    marginTop: UI.scaleSize(50),
  },
  loginText: {
    fontSize: UI.scaleSize(20),
    color: '#B8B8B8',
  },
});

export default ExchangeCode;
