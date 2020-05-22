import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';

import { dispatch } from '~/modules/redux-app-config';
import UI from '~/modules/UI';
import EventTracking from '~/modules/services/event-tracking';

class RatingTestActionSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    this.title = '参加定级测试';
    this.options = ['进入测试', '先用用看'];
  }

  onSelect = index => {
    const { navigation, grade } = this.props;
    if (index === 0) {
      EventTracking.track('t0105', 'r0133');
      navigation.navigate('practice', { grade: grade });
    } else if (index === 1) {
      EventTracking.track('t0105', 'r0134');
      dispatch('REMIND_LATER', {
        laterUnix: moment(new Date()),
      });
      this.goBack();
    }
  };

  goBack = () => {
    const { navigation, grade } = this.props;
    navigation.goBack();
    navigation.state.params && navigation.state.params.callback(grade);
  };

  show = () => {
    this.actionSheet.show();
  };

  render() {
    return (
      <ActionSheet
        ref={o => (this.actionSheet = o)}
        title={this.title}
        options={this.options}
        // cancelButtonIndex={2}
        onPress={index => {
          this.onSelect(index);
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RatingTestActionSheet;
