import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import AudioManager from '~/modules/services/audio-manager';

/**
 * 1. 点击播放铃声功能
 */
class MyTouchableOpacity extends Component {
  constructor(props) {
    super(props);
    this.state = { waiting: false };
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    const { children, onPress, delay = 500, playSound = true } = this.props;
    const { waiting } = this.state;
    return (
      <TouchableOpacity
        disabled={waiting}
        {...this.props}
        onPress={() => {
          this.setState({ waiting: true });
          if (playSound) {
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

export default MyTouchableOpacity;
