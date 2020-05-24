import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import AudioManager from '~/modules/services/audio-manager';
import { store } from '~/modules/redux-app-config';

/**
 * 1. 点击播放铃声功能
 */
class MyTouchable extends Component {
  constructor(props) {
    super(props);
    this.state = { waiting: false };
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    const { children, onPress, delay = 500, playSound = true, disabled } = this.props;
    const { waiting } = this.state;
    return (
      <TouchableOpacity
        disabled={waiting || disabled}
        activeOpacity={1}
        {...this.props}
        onPress={() => {
          this.setState({ waiting: true });
          if (playSound && store.getState().settings.sound) {
            AudioManager.click();
          }
          onPress && onPress();
          this.timer = setTimeout(() => {
            this.setState({ waiting: false });
          }, delay);
        }}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

export default MyTouchable;
