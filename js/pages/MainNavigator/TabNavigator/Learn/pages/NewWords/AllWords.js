import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LargeList } from 'react-native-largelist-v3';
import _ from 'lodash';
import { Overlay } from 'teaset';

import UI from '~/modules/UI';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import WordDetail from '../WordDetail';

const noneImg = require('./img/none.jpg');

class AllWords extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderSection = section => (
    <View style={styles.section}>
      <Text style={styles.sectionName}>{this.data[section].name}</Text>
    </View>
  );

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
    const data = this.data[section].items[row];
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

  getData() {
    const { words } = this.props.words;
    const { word_list } = words;
    if (word_list.length === 0) {
      return [];
    }
    this.before = '';
    const wordList = _.cloneDeep(word_list);
    wordList.push('END');
    const data = [];
    let sContent = { items: [], name: '' };
    for (let i = 0; i < wordList.length; i++) {
      if (wordList[i] === 'END') {
        data.push(sContent);
        continue;
      }
      const wordFirst = wordList[i].word.substr(0, 1);
      if (wordFirst !== this.before) {
        if (i !== 0) {
          data.push(sContent);
        }
        this.before = wordFirst;
        sContent = { items: [], name: '' };
        sContent.name = wordFirst;
        sContent.items.push(wordList[i]);
      } else {
        sContent.items.push(wordList[i]);
      }
    }
    this.data = data;
    return data;
  }

  render() {
    const data = this.getData();
    return (
      <View style={styles.container}>
        {data.length === 0 ? (
          <View style={UI.style.container}>
            <Image source={noneImg} style={styles.noneImg} resizeMode="contain" />
            <Text style={styles.noneText}>快去图书内添加不认识的单词吧~</Text>
          </View>
        ) : (
          <LargeList
            style={styles.container}
            data={data}
            heightForSection={() => UI.scaleSize(44)}
            renderSection={this._renderSection}
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
    backgroundColor: 'white',
  },
  noneText: {
    marginTop: UI.scaleSize(20),
    fontSize: UI.scaleSize(14),
    color: '#5B5B5B',
  },
  section: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionName: {
    fontSize: UI.scaleSize(20),
    color: '#FF8811',
    marginLeft: UI.scaleSize(28),
    fontWeight: 'bold',
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
    width: UI.size.deviceWidth - UI.scaleSize(32),
    backgroundColor: '#E6E6EA',
  },
  noneImg: {
    width: UI.scaleSize(200),
    height: UI.scaleSize(200),
  },
});

export default AllWords;
