import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import actions, { dispatch } from '~/modules/redux-app-config';
import UI from '~/modules/UI';
import CustomNav from '~/components/CustomNav';

import AllWords from './AllWords';
import LearnedWords from './LearnedWords';

// 生词本
@connect(
  R.pick(['words']),
  actions,
)
class NewWords extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: '全部', index: 0 },
        { key: 'second', title: '全部已学', index: 1 },
      ],
    };
  }

  UNSAFE_componentWillMount() {
    dispatch('GET_NEW_WORDS');
  }

  renderScene = ({ route }) => {
    const { index } = this.state;
    const { words, navigation } = this.props;
    switch (route.key) {
      case 'first':
        return <AllWords route={route} index={index} words={words} navigation={navigation} />;
      case 'second':
        return <LearnedWords route={route} index={index} words={words} navigation={navigation} />;
      default:
        return null;
    }
  };

  render() {
    const { index } = this.state;
    return (
      <View style={styles.container}>
        <CustomNav
          title="生词本"
          titleColor="#3C3C5C"
          imgType="gray"
          containerStyle={{ backgroundColor: 'white' }}
          navigation={this.props.navigation}
        />
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={styles.indicator}
              renderLabel={({ route, focused, color }) => (
                <Text style={[styles.title, focused && { color: '#FF8811' }]}>{route.title}</Text>
              )}
            />
          )}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: UI.size.deviceWidth }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: '#3C3C5C',
    fontSize: UI.scaleSize(20),
    width: UI.scaleSize(100),
    textAlign: 'center',
    margin: UI.scaleSize(8),
    fontWeight: 'bold',
  },
  tabBar: {
    marginTop: UI.scaleSize(30),
    backgroundColor: 'transparent',
  },
  indicator: {
    backgroundColor: '#FF8811',
    borderRadius: UI.scaleSize(2),
    height: UI.scaleSize(2),
  },
});

export default NewWords;
