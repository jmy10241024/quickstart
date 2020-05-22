import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import FastImage from 'react-native-fast-image';
import _ from 'lodash';

import UI from '~/modules/UI';

export default class OverViewClockItem extends Component {
  render() {
    const { source, value, bottomText } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.rowView}>
          <FastImage style={styles.icon} source={source} resizeMode="contain" />
          <Text style={[styles.grayText, styles.weightText]}>{value}</Text>
        </View>
        <View>
          <Text style={styles.grayText}>{bottomText}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: UI.scaleSize(20),
    height: UI.scaleSize(20),
  },
  weightText: {
    marginLeft: UI.scaleSize(5),
    fontWeight: 'bold',
    color: 'black',
  },
  grayText: {
    color: 'gray',
  },
});
