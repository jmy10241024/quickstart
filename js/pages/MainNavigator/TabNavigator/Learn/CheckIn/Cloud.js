import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

import UI from '~/modules/UI';

const cloudImg = require('../img/cloud.png');

class Cloud extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    this.transform = {
      from: {
        transform: [{ translateX: 0 }],
      },
      to: {
        transform: [{ translateX: -UI.size.deviceWidth - UI.scaleSize(142) }],
      },
    };
  }

  render() {
    const { size, top, duration } = this.props;
    return (
      <Animatable.View
        ref={o => (this.animate = o)}
        style={[
          styles.container,
          { top },
          size === 'large' ? styles.large : styles.default,
        ]}
        animation={this.transform}
        iterationCount="infinite"
        direction="normal"
        duration={duration}
        iterationDelay={size === 'large' ? 5000 : 3000}
        useNativeDriver
      >
        <Image
          source={cloudImg}
          style={size === 'large' ? styles.large : styles.default}
          resizeMode="contain"
        />
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: UI.size.deviceWidth,
  },
  large: {
    width: UI.scaleSize(141),
    height: UI.scaleSize(53),
  },
  default: {
    width: UI.scaleSize(94),
    height: UI.scaleSize(35),
  },
});

export default Cloud;
