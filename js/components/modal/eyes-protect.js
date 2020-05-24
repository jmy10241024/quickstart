import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';

import actions, { dispatch, store } from '~/modules/redux-app-config';
import UI from '~/modules/UI';

@connect(
  R.pick(['settings']),
  actions,
)
class EyesProtect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { eyesProtect } = this.props.settings;
    if (!eyesProtect) {
      return null;
    }
    return <View style={styles.container} pointerEvents="box-none" />;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'yellow',
    opacity: 0.1,
  },
});

export default EyesProtect;
