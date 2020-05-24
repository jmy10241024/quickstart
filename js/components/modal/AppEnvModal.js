import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Config from 'react-native-config';
import _ from 'lodash';
import { Overlay } from 'teaset';
import { dispatch } from '~/modules/redux-app-config';

import Global from '~/modules/global';
import UI from '~/modules/UI';
import MyTouchable from '~/components/my-touchable';

class AppEnvModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      env: Config.ENV,
      envList: [
        { env: 'LOCAL', url: 'http://172.16.18.37:8500/api/v1', color: '#00f', title: '本地环境' },
        {
          env: 'DEV',
          url: 'https://test-r-read.dubaner.com/api/v1',
          color: '#0f0',
          title: '测试环境',
        },
        { env: 'PROD', url: 'https://r-read.dubaner.com/api/v1', color: '#f00', title: '生产环境' },
      ],
    };
  }

  press = () => {
    const { envList } = this.state;
    let overlayView = (
      <Overlay.PullView
        side="bottom"
        modal={false}
        containerStyle={{ backgroundColor: 'transparent' }}
      >
        <View style={styles.overlayView}>
          <Text style={styles.selectTitle}>选择环境</Text>
          <View style={{ flex: 1 }}>
            {envList.map((value, index) => {
              return (
                <TouchableOpacity
                  key={_.uniqueId()}
                  style={styles.selectView}
                  onPress={() => {
                    Overlay.hide(this.key);
                    Global.setApiUrl(value.url);
                    Global.setEnv(value.env);
                    this.setState({ env: value.env });
                    dispatch('GET_USERINFO');
                  }}
                >
                  <Text style={styles.gradeText}>{value.title}</Text>
                  {index === envList.length - 1 ? null : <View style={styles.line} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Overlay.PullView>
    );
    this.key = Overlay.show(overlayView);
  };

  render() {
    if (Config.ENV === 'PROD') {
      return null;
    }
    const { env, envList } = this.state;
    return (
      <MyTouchable
        delay={0}
        style={[
          styles.container,
          { backgroundColor: _.find(envList, item => item.env === env).color },
        ]}
        onPress={this.press}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: UI.scaleSize(10),
    top: UI.size.statusBarHeight + UI.scaleSize(10),
    width: UI.scaleSize(20),
    height: UI.scaleSize(20),
    borderRadius: UI.scaleSize(10),
    backgroundColor: 'yellow',
  },
  overlayView: {
    backgroundColor: 'white',
    width: UI.size.deviceWidth,
    height: UI.scaleSize(300),
    borderTopLeftRadius: UI.scaleSize(20),
    borderTopRightRadius: UI.scaleSize(20),
    overflow: 'hidden',
  },
  selectTitle: {
    fontSize: UI.scaleSize(24),
    color: UI.color.text1,
    fontWeight: 'bold',
    marginTop: UI.scaleSize(30),
    marginLeft: UI.scaleSize(20),
    marginBottom: UI.scaleSize(10),
  },
  line: {
    position: 'absolute',
    bottom: 0,
    left: UI.scaleSize(20),
    width: UI.size.deviceWidth - UI.scaleSize(40),
    height: UI.scaleSize(1),
    backgroundColor: '#E6E6EA',
  },
  selectView: {
    width: UI.size.deviceWidth,
    height: UI.scaleSize(60),
    paddingLeft: UI.scaleSize(20),
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: UI.scaleSize(16),
    color: UI.color.text1,
    fontWeight: 'bold',
  },
});

export default AppEnvModal;
