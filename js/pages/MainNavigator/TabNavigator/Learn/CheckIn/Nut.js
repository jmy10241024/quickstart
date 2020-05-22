import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  ImageBackground,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import UI from '~/modules/UI';
import { random } from '~/modules/services/utils';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';

const cutImg = require('../img/cut.png');

class Nut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: 0,
      left: 0,
      iterationCount: 'infinite',
    };
  }

  UNSAFE_componentWillMount() {
    this.getRandomPosition();
    this.transform = {
      from: {
        transform: [{ translateY: 0 }],
      },
      to: {
        transform: [{ translateY: 10 }],
      },
    };
  }

  getRandomPosition() {
    this.setState({
      left: random(UI.size.deviceWidth - UI.scaleSize(40), 0),
      top: random(this.props.safeHeight - UI.scaleSize(70), UI.scaleSize(52)),
    });
  }

  onPress = () => {
    this.setState({ iterationCount: 1 });
    this.props.checkIn(this.props.data, res => {
      if (res && res.msg === 'Success') {
        this.animate.bounceOut(800).then();
      }
    });
  };

  render() {
    const { data } = this.props;
    if (!data.title) {
      return null;
    }
    if (data.title !== '签到') {
      return null;
    }
    const { left, top, iterationCount } = this.state;
    return (
      <Animatable.View
        ref={o => (this.animate = o)}
        style={[styles.container, { top, left }]}
        animation={this.transform}
        iterationCount={iterationCount}
        direction="alternate"
        useNativeDriver
      >
        <MyTouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={this.onPress}
          activeOpacity={1}
        >
          <Text style={styles.title}>{data.title}</Text>
          <ImageBackground source={cutImg} style={styles.cutImg}>
            <Text style={styles.gold}>+{data.gold}</Text>
          </ImageBackground>
        </MyTouchableOpacity>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    height: UI.scaleSize(70),
  },
  title: {
    fontSize: UI.scaleSize(12),
    color: '#2C4100',
  },
  cutImg: {
    width: UI.scaleSize(34),
    height: UI.scaleSize(37),
    marginTop: UI.scaleSize(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gold: {
    fontSize: UI.scaleSize(14),
    color: '#FFEBD8',
    marginTop: UI.scaleSize(16),
  },
});

export default Nut;
