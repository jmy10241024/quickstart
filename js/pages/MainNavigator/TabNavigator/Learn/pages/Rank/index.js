import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ImageBackground } from 'react-native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import { Avatar } from 'react-native-elements';

import CustomNav from '~/components/CustomNav';
import UI from '~/modules/UI';
import { dispatch } from '~/modules/redux-app-config';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';

const bgImg = require('./img/bg.png');
const noneImg = require('./img/none.jpg');
const firstImg = require('./img/first.png');
const secondImg = require('./img/second.png');
const thirdImg = require('./img/third.png');
const firstBgImg = require('./img/first_bg.png');
const secondBgImg = require('./img/second_bg.png');
const thirdBgImg = require('./img/third_bg.png');
const selfImg = require('./img/self.png');
const recordIcon = require('./img/record_icon.png');
const backImg = require('~/images/back.png');
const rankBg = require('./img/rankBg.png');

// 排行榜
class Rank extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      size: 100,
      ranks: [],
      myRank: {},
      head_url: '',
    };
    this.page = 1;
    this.colors = ['#FF8811', '#FD6363', '#3AAFFF', '#3C3C5C'];
  }

  UNSAFE_componentWillMount() {
    this.getRankList();
  }

  getRankList = () => {
    const { size } = this.state;
    const { page } = this;
    dispatch('SET_LOADING', { visible: true });
    dispatch('GET_RANK_LIST', {
      size,
      page,
      res: res => {
        dispatch('SET_LOADING', { visible: false });
        if (res && res.msg === 'Success') {
          this.setState({
            head_url: res.result.head_url,
            ranks: [...this.state.ranks, ...res.result.rankUserRecords],
            myRank: res.result.myRankUserRecord,
          });
        }
      },
    });
  };

  renderItem = ({ item, index }) => {
    const { head_url } = this.state;
    const { learn_seconds } = item;
    let { div_header, nick } = item;
    if (!div_header) {
      div_header = 'user/header/headicon0.png';
    }
    if (!nick) {
      nick = `游客${_.uniqueId()}`;
    }
    return (
      <View height={UI.scaleSize(101)}>
        <View style={styles.itemView}>
          <Text style={[styles.titleText, { color: this.colors[index] }]}>{index + 1}</Text>
          <Avatar
            containerStyle={styles.avatarImg}
            rounded
            size={UI.scaleSize(60)}
            source={{ uri: head_url + div_header }}
          />
          <Text style={styles.nickText}>{nick}</Text>
          <View style={{ flex: 1 }} />
          <View style={styles.timeView}>
            <Text style={styles.timeText}>{this.getTime(learn_seconds)}</Text>
          </View>
        </View>
        <View style={styles.lineView} />
      </View>
      //   <View style={styles.item}>
      //     {index < 3 ? (
      //       <ImageBackground
      //         style={styles.imgView}
      //         source={index === 0 ? firstImg : index === 1 ? secondImg : thirdImg}
      //       >
      //         <FastImage style={styles.img1} source={{ uri: head_url + div_header }} />
      //       </ImageBackground>
      //     ) : (
      //       <FastImage style={styles.img2} source={{ uri: head_url + div_header }} />
      //     )}
      //     <View style={{ flex: 1, marginLeft: UI.scaleSize(8) }}>
      //       {index < 3 ? (
      //         <ImageBackground
      //           style={styles.imgBg}
      //           source={index === 0 ? firstBgImg : index === 1 ? secondBgImg : thirdBgImg}
      //         >
      //           <Text style={styles.noText1}>No.{index + 1}</Text>
      //         </ImageBackground>
      //       ) : (
      //         <Text style={styles.noText2}>No.{index + 1}</Text>
      //       )}
      //       <Text style={styles.nick}>{nick}</Text>
      //     </View>
      //     <Text style={styles.durationText}>{this.getTime(learn_seconds)}</Text>
      //   </View>
    );
  };

  renderSelf = () => {
    const { head_url } = this.state;
    const { div_header, nick, learn_seconds, id, sortindex } = this.state.myRank;
    return (
      <View style={styles.item2}>
        <FastImage style={styles.img2} source={{ uri: head_url + div_header }} />
        <View style={{ flex: 1, marginLeft: UI.scaleSize(8) }}>
          <Text style={styles.noText2}>{id === '0' ? '未上榜' : `No.${sortindex}`}</Text>
          <Text style={styles.nick}>{nick}</Text>
        </View>
        <View style={styles.goStudyView}>
          <Text style={styles.duration2}>{this.getTime(learn_seconds)}</Text>
          <MyTouchableOpacity style={styles.goStudyBtn} onPress={this.goBack}>
            <Text style={styles.goStudyText}>马上去学习</Text>
          </MyTouchableOpacity>
        </View>
      </View>
    );
  };

  ItemSeparatorComponent = () => <View style={styles.line} />;

  getTime = time => {
    if (time <= 0) {
      return '0分0秒';
    }
    let value = `${moment.duration(time * 1000).seconds()}秒`;
    const minutes = moment.duration(time * 1000).minutes();
    if (minutes > 0) {
      value = `${minutes}分${value}`;
    }
    const hours = moment.duration(time * 1000).hours();
    if (hours > 0) {
      value = `${hours}小时${value}`;
    }
    return value;
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { ranks, myRank } = this.state;
    if (ranks.length === 0) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.topView}>
            <CustomNav title="排行榜" navigation={this.props.navigation} />
          </View>
          <View style={[styles.container, { marginBottom: UI.scaleSize(50) }]}>
            <Image source={noneImg} style={styles.noneImg} resizeMode="contain" />
            <Text style={styles.noneText}>光荣榜空空如也，等你来战哦！</Text>
            <MyTouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Text style={styles.now}>马上去挑战</Text>
            </MyTouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={rankBg} resizeMode="contain" style={styles.rankBg}>
          <MyTouchableOpacity style={styles.backTouch} onPress={this.goBack}>
            <FastImage source={backImg} style={styles.backImg} resizeMode="contain" />
          </MyTouchableOpacity>
          <Text style={styles.title}>排行榜</Text>
        </ImageBackground>
        <View style={styles.header}>
          <Text style={styles.rankText}>名次</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.durationText}>学习时长</Text>
        </View>
        <FlatList
          style={styles.list}
          data={ranks}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.ItemSeparatorComponent}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          key={_.uniqueId()}
        />
        {this.renderSelf()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBg: {
    width: UI.size.deviceWidth,
    height: UI.size.deviceWidth * (200 / 375),
  },
  backTouch: {
    position: 'absolute',
    left: UI.scaleSize(20),
    bottom: UI.scaleSize(80),
    width: UI.scaleSize(50),
    height: UI.scaleSize(50),
  },
  backImg: {
    width: UI.scaleSize(25),
    height: UI.scaleSize(25),
  },
  title: {
    position: 'absolute',
    left: UI.scaleSize(20),
    bottom: UI.scaleSize(40),
    lineHeight: UI.scaleSize(42),
    color: UI.color.white,
    fontSize: UI.scaleSize(30),
    fontWeight: '600',
  },
  headerRight: {
    width: UI.scaleSize(40),
    height: UI.scaleSize(40),
    marginRight: UI.scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: UI.size.deviceWidth,
    height: (UI.size.deviceWidth * UI.scaleSize(276)) / UI.scaleSize(750),
  },
  topView: {
    backgroundColor: '#FFD033',
    width: UI.size.deviceWidth,
    height: UI.size.deviceWidth * (160 / 375),
  },

  header: {
    marginTop: UI.scaleSize(-20),
    width: UI.size.deviceWidth,
    height: UI.scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9FA',
    borderTopLeftRadius: UI.scaleSize(30),
    borderTopRightRadius: UI.scaleSize(30),
  },
  rankText: {
    marginLeft: UI.scaleSize(78),
    fontSize: UI.scaleSize(16),
    color: '#3C3C5C',
    fontWeight: 'bold',
  },
  durationText: {
    marginRight: UI.scaleSize(78),
    fontSize: UI.scaleSize(16),
    color: '#3C3C5C',
    fontWeight: 'bold',
  },
  noneImg: {
    width: UI.scaleSize(200),
    height: UI.scaleSize(200),
  },
  noneText: {
    fontSize: UI.scaleSize(18),
    color: '#333333',
    marginTop: UI.scaleSize(18),
  },
  btn: {
    width: UI.scaleSize(240),
    height: UI.scaleSize(44),
    borderRadius: UI.scaleSize(22),
    backgroundColor: '#FFC819',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: UI.scaleSize(36),
    marginBottom: UI.scaleSize(20),
  },
  list: {
    backgroundColor: 'rgb(253, 253, 253)',
  },
  now: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
  },
  item: {
    width: UI.size.deviceWidth,
    height: UI.scaleSize(92),
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgView: {
    width: UI.scaleSize(77),
    height: UI.scaleSize(76),
    marginLeft: UI.scaleSize(22),
  },
  img1: {
    position: 'absolute',
    right: UI.scaleSize(2),
    bottom: UI.scaleSize(2),
    width: UI.scaleSize(61),
    height: UI.scaleSize(61),
    borderRadius: UI.scaleSize(61) / 2,
  },
  img2: {
    width: UI.scaleSize(60),
    height: UI.scaleSize(60),
    marginLeft: UI.scaleSize(36),
    borderRadius: UI.scaleSize(60) / 2,
  },
  imgBg: {
    width: UI.scaleSize(48),
    height: UI.scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noText1: {
    fontSize: UI.scaleSize(14),
    color: 'white',
    fontWeight: 'bold',
  },
  noText2: {
    fontSize: UI.scaleSize(14),
    color: '#FFC819',
    fontWeight: 'bold',
  },
  nick: {
    fontSize: UI.scaleSize(14),
    color: '#333333',
    marginTop: UI.scaleSize(6),
  },
  duration: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
    marginRight: UI.scaleSize(18),
  },
  duration2: {
    fontSize: UI.scaleSize(12),
    color: '#3C3C5C',
    fontWeight: 'bold',
  },
  line: {
    width: UI.size.deviceWidth - UI.scaleSize(122),
    height: UI.scaleSize(1),
    backgroundColor: '#F7F7F7',
    marginLeft: UI.scaleSize(106),
  },
  item2: {
    backgroundColor: 'rgb(255,255,255)',
    width: UI.size.deviceWidth,
    height: UI.scaleSize(100),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
    borderTopLeftRadius: UI.scaleSize(30),
    borderTopRightRadius: UI.scaleSize(30),
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: UI.color.black,
    elevation: 12,
  },
  goStudyView: {
    alignItems: 'center',
    marginRight: UI.scaleSize(16),
  },
  goStudyBtn: {
    width: UI.scaleSize(100),
    height: UI.scaleSize(34),
    backgroundColor: '#FF8811',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: UI.scaleSize(17),
    marginTop: UI.scaleSize(7),
  },
  goStudyText: {
    fontSize: UI.scaleSize(12),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selfImg: {
    position: 'absolute',
    left: 0,
    top: -UI.scaleSize(5),
    width: UI.scaleSize(28),
    height: UI.scaleSize(32),
  },
  itemView: {
    height: UI.scaleSize(100),
    width: UI.size.deviceWidth - UI.scaleSize(84),
    marginLeft: UI.scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: UI.scaleSize(16),
    fontWeight: 'bold',
  },
  lineView: {
    height: UI.scaleSize(1),
    marginHorizontal: UI.scaleSize(20),
    backgroundColor: '#E6E6EA',
  },
  avatarImg: {
    marginLeft: UI.scaleSize(11),
  },
  nickText: {
    fontSize: UI.scaleSize(16),
    color: '#3C3C5C',
    fontWeight: 'bold',
    marginLeft: UI.scaleSize(10),
  },
  timeView: {
    marginRight: UI.scaleSize(10),
    height: UI.scaleSize(40),
    width: UI.scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: UI.scaleSize(16),
    color: '#3C3C5C',
    fontWeight: 'bold',
  },
});

export default Rank;
