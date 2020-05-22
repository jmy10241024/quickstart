import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Orientation from 'react-native-orientation-locker';

import StudyTimeChart from '~/components/StudyTimeChart';
import UI from '~/modules/UI';

class LandspaceStudyTimeChart extends Component {
  static navigationOptions = {
    title: '学习时长',
  };

  componentDidMount() {
    Orientation.lockToLandscape();
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <StudyTimeChart
          // zoomDomain={{ x: [-0.5, 9] }}
          width={UI.size.deviceHeight - UI.scaleSize(20)}
          height={UI.scaleSize(250)}
          allowPan={false}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LandspaceStudyTimeChart;
