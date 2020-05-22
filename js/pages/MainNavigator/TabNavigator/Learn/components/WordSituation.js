import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import _ from 'lodash';

import UI from '~/modules/UI';

export default class WordSituation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    this.sizeScale = 70 / 360;
    this.widthScale = 8 / 360;
  }
  render() {
    const { learnNum, title, totalNum, containerWidth, onPress } = this.props;
    const percentInt = _.toSafeInteger((learnNum / totalNum) * 100);
    return (
      <View style={[styles.container, { width: containerWidth }]}>
        <View pointerEvents="none">
          <AnimatedCircularProgress
            // Duration of animation in ms
            duration={1000}
            // Angle from which the progress starts from, default 90
            rotation={0}
            // Width and height of circle
            size={this.sizeScale * UI.size.deviceWidth}
            // Thickness of the progress line
            width={this.widthScale * UI.size.deviceWidth}
            // Current progress / fill
            fill={percentInt}
            // onAnimationComplete={() => console.log('onAnimationComplete')}
            // Color of the progress line
            tintColor="tomato"
            // If unspecified, no background line will be rendered
            backgroundColor="gray"
          >
            {fill => <Text style={styles.points}>{learnNum}</Text>}
          </AnimatedCircularProgress>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.touch} />
        <Text>{title}</Text>
        <Text>{totalNum}个</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  points: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: 16,
    // fontWeight: '100',
  },
  pieView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  absPie: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  touch: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
