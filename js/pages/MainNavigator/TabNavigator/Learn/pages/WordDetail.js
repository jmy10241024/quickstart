import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';

import UI from '~/modules/UI';
import { dispatch } from '~/modules/redux-app-config';
import SoundManager from '~/modules/services/sound-manager';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';

const playImg = require('~/images/playaudio.png');
const playGif = require('~/images/playingaudio.gif');
const closeImg = require('../img/close.png');

class WordDetail extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      word: {},
      hosts: {},
      status: '',
    };
  }

  UNSAFE_componentWillMount() {
    const { data } = this.state;
    dispatch('ADD_WORDS_TO_LOCAL', { ...data });
    dispatch('GET_WORDDETAIL', {
      word: data.word,
      callback: res => {
        if (res && res.msg === 'Success') {
          this.setState({
            word: res.result.word,
            hosts: res.result.word_hosts,
          });
        }
      },
    });
  }

  play = () => {
    const { word, hosts } = this.state;
    const { audio } = word;

    if (!audio) {
      return;
    }
    const start = () => {
      this.setState({ status: 'PLAY' });
    };
    const end = () => {
      this.setState({ status: '' });
    };
    SoundManager.play(hosts.audio + audio, '', start, end);
  };

  onClosePress = () => {
    this.props.close && this.props.close();
  };

  render() {
    const { word, hosts, status } = this.state;
    return (
      <View style={[styles.container]}>
        <MyTouchableOpacity onPress={this.onClosePress.bind(this)} style={styles.closeTouch}>
          <FastImage style={styles.closeImg} source={closeImg} resizeMode="contain" />
        </MyTouchableOpacity>
        <View style={styles.header}>
          <View style={styles.header2}>
            <View>
              <View style={styles.wordView}>
                <Text style={styles.word}>{word.word}</Text>
                {word.word ? (
                  <TouchableOpacity onPress={this.play}>
                    <Image
                      source={status ? playGif : playImg}
                      style={styles.playImg}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text style={styles.symbol}>{word.symbol}</Text>
            </View>
            <View style={{ flex: 1 }} />
            {hosts.image ? (
              <FastImage style={styles.wordImg} source={{ uri: hosts.image + word.image }} />
            ) : null}
          </View>
          <View style={styles.divider} />
        </View>

        <View style={{ flex: 1, marginHorizontal: UI.scaleSize(30) }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingLeft: UI.scaleSize(16) }}>
              <Text style={styles.translation}>
                {word.translation && word.translation.replace(/<br>/g, '\n').replace(/↵/g, '\n')}
              </Text>
              <Text style={styles.discription}>
                {word.discription && word.discription.replace(/<br>/g, '\n').replace(/↵/g, '\n')}
              </Text>
            </View>
          </ScrollView>
        </View>
        <View style={{ height: UI.scaleSize(32) }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: UI.size.deviceWidth,
    height: UI.size.deviceHeight - UI.size.statusBarHeight - UI.scaleSize(50 + 100),
    borderTopLeftRadius: UI.scaleSize(30),
    borderTopRightRadius: UI.scaleSize(30),
  },
  closeTouch: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: UI.scaleSize(50),
    height: UI.scaleSize(50),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  closeImg: {
    width: UI.scaleSize(29),
    height: UI.scaleSize(29),
  },
  header: {
    marginLeft: UI.scaleSize(30),
    // backgroundColor: '#FFC819',
    width: UI.size.deviceWidth - UI.scaleSize(30),
    height: UI.scaleSize(135),
    paddingTop: UI.scaleSize(10),
    marginTop: UI.scaleSize(50),
  },
  backImg: {
    width: UI.scaleSize(30),
    height: UI.scaleSize(30),
  },
  header2: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: UI.scaleSize(15),
    paddingRight: UI.scaleSize(24),
  },
  wordView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: UI.scaleSize(15),
  },
  word: {
    fontSize: UI.scaleSize(30),
    lineHeight: UI.scaleSize(35),
    color: '#3C3C5C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playImg: {
    width: UI.scaleSize(24),
    height: UI.scaleSize(24),
    marginLeft: UI.scaleSize(10),
  },
  symbol: {
    fontSize: UI.scaleSize(16),
    color: '#9D9DAD',
    marginTop: UI.scaleSize(5),
    fontWeight: 'bold',
  },
  divider: {
    alignSelf: 'flex-start',
    height: UI.scaleSize(1),
    width: UI.size.deviceWidth - UI.scaleSize(60),
    backgroundColor: '#E6E6EA',
  },
  wordImg: {
    width: UI.scaleSize(70),
    height: UI.scaleSize(70),
    borderRadius: UI.scaleSize(35),
    marginTop: UI.scaleSize(13),
  },
  translation: {
    marginTop: UI.scaleSize(20),
    fontSize: UI.scaleSize(16),
    color: '#3C3C5C',
    fontWeight: 'bold',
    lineHeight: UI.scaleSize(22),
  },
  discription: {
    marginTop: UI.scaleSize(20),
    fontSize: UI.scaleSize(14),
    color: '#3C3C5C',
    fontWeight: '300',
    lineHeight: UI.scaleSize(20),
  },
});

export default WordDetail;
