import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LargeList } from 'react-native-largelist-v3';
import { Overlay } from 'teaset';

import UI from '~/modules/UI';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import WordDetail from '../WordDetail';

const noneImg = require('./img/none.jpg');

class LearnedWords extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _close = () => {
    Overlay.hide(this.key);
  };

  _itemPress = data => {
    let overlayView = (
      <Overlay.PullView
        side="bottom"
        modal={false}
        containerStyle={{ backgroundColor: 'transparent' }}
      >
        <WordDetail close={this._close} data={data} />
      </Overlay.PullView>
    );
    this.key = Overlay.show(overlayView);
  };
  _renderIndexPath = ({ section, row }) => {
    const { words } = this.props;
    const { alreadyReadList } = words;
    const data = alreadyReadList[row];
    if (!data) {
      return null;
    }
    return (
      <MyTouchableOpacity
        style={styles.row}
        onPress={() => {
          this._itemPress(data);
        }}
      >
        <View style={{ width: UI.scaleSize(10) }} />
        <View style={{ marginLeft: UI.scaleSize(10) }}>
          <Text style={styles.word}>{data.word}</Text>
          <Text style={styles.trans_short}>{data.trans_short}</Text>
        </View>
        <View style={styles.line} />
      </MyTouchableOpacity>
    );
  };

  render() {
    const { words } = this.props;
    const { alreadyReadList } = words;
    return (
      <View style={styles.container}>
        {alreadyReadList.length === 0 ? (
          <View style={UI.style.container}>
            <Image source={noneImg} style={styles.noneImg} resizeMode="contain" />
            <Text style={styles.noneText}>您今天还没有学任何单词，快去学习吧~</Text>
          </View>
        ) : (
          <LargeList
            style={styles.container}
            data={[{ items: alreadyReadList }]}
            heightForIndexPath={() => UI.scaleSize(80)}
            renderIndexPath={this._renderIndexPath}
          />
        )}
        <View style={{ height: UI.scaleSize(20) }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noneText: {
    marginTop: UI.scaleSize(20),
    fontSize: UI.scaleSize(14),
    color: '#5B5B5B',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  word: {
    fontSize: UI.scaleSize(20),
    color: '#3C3C5C',
    fontWeight: 'bold',
  },
  trans_short: {
    fontSize: UI.scaleSize(14),
    color: '#9D9DAD',
    marginTop: UI.scaleSize(6),
    fontWeight: '300',
  },
  line: {
    position: 'absolute',
    left: UI.scaleSize(16),
    bottom: 0,
    height: UI.scaleSize(1),
    width: UI.size.deviceWidth,
    backgroundColor: '#EEEEEE',
  },
  noneImg: {
    width: UI.scaleSize(200),
    height: UI.scaleSize(200),
  },
});

export default LearnedWords;
