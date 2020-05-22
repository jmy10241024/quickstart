import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import moment from 'moment';

import UI from '~/modules/UI';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import { dispatch } from '~/modules/redux-app-config';

const circleIcon = require('./img/circle.png');
const upImg = require('./img/up.png');
const downImg = require('./img/down.png');
const fairImg = require('./img/fair.png');

class HistoryRecord extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '历史记录',
    headerTitleStyle: {
      fontSize: UI.scaleSize(18),
      color: '#000000',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      self: {},
      rank: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.getRankHistory();
  }

  getRankHistory = () => {
    dispatch('GET_RANK_HISTORY', {
      res: res => {
        if (res && res.msg === 'Success') {
          this.setState({
            self: res.result.myRankUserRecord,
            rank: res.result.rankUserRecords,
          });
        }
      },
    });
  };

  getTime = time => {
    if (time <= 0) return '0分0秒';
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

  render() {
    const { self, rank } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.selfCard}>
          <View style={styles.currentWeek}>
            <Image source={circleIcon} />
            <Text style={styles.weekText}>本周</Text>
          </View>
          <View style={UI.style.container}>
            {self.learn_seconds > 0 ? (
              <Text style={styles.noStudy}>
                已学习时长{this.getTime(self.learn_seconds)}
                ，继续这个学习进度，预计会排名第
                <Text style={{ color: '#FFC900' }}>{self.sortindex - 1}</Text>名
              </Text>
            ) : (
              <Text style={styles.noStudy}>本周你还没有学习</Text>
            )}
          </View>
          <MyTouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={styles.studyNow}>马上去学习</Text>
          </MyTouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              {rank.map((item, index) => (
                <View style={styles.card2}>
                  <View style={styles.currentWeek}>
                    <Image source={circleIcon} />
                    <Text style={styles.weekText}>
                      {index === 0
                        ? '上周'
                        : `${moment(item.starttime).format(
                            'YYYY/MM/DD',
                          )}-${moment(item.endtime).format('MM/DD')}`}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.rowItem}>
                      <Text style={styles.studyTime}>学习时长</Text>
                      <Text style={styles.duration}>
                        {this.getTime(item.learn_seconds)}
                      </Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.studyTime}>排名</Text>
                      <Text style={styles.duration}>
                        {item.sortindex === 0
                          ? '未上榜'
                          : `${item.sortindex}名`}
                      </Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.studyTime}>较前一周</Text>
                      <View style={styles.trendView}>
                        <Image
                          source={
                            item.trend === 0
                              ? fairImg
                              : item.trend > 0
                              ? upImg
                              : downImg
                          }
                        />
                        <Text style={styles.trendText}>
                          {item.trend === 0
                            ? '持平'
                            : `${Math.abs(item.trend)}名次`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={{ height: UI.scaleSize(16) }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
  },
  selfCard: {
    width: UI.size.deviceWidth - UI.scaleSize(15) * 2,
    height: UI.scaleSize(168),
    padding: UI.scaleSize(20),
    borderRadius: UI.scaleSize(10),
    backgroundColor: 'white',
    marginTop: UI.scaleSize(15),
  },
  currentWeek: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekText: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
    fontWeight: 'bold',
    marginLeft: UI.scaleSize(10),
  },
  backBtn: {
    width: UI.scaleSize(240),
    height: UI.scaleSize(44),
    backgroundColor: '#FFC819',
    borderRadius: UI.scaleSize(22),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studyNow: {
    fontSize: UI.scaleSize(18),
    color: '#3C2F05',
  },
  noStudy: {
    fontSize: UI.scaleSize(15),
    color: '#666666',
    lineHeight: UI.scaleSize(20),
  },
  card2: {
    width: UI.size.deviceWidth - UI.scaleSize(30),
    height: UI.scaleSize(120),
    paddingHorizontal: UI.scaleSize(20),
    paddingVertical: UI.scaleSize(16),
    borderRadius: UI.scaleSize(10),
    backgroundColor: 'white',
    marginTop: UI.scaleSize(15),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    alignItems: 'center',
  },
  studyTime: {
    fontSize: UI.scaleSize(14),
    color: '#666666',
    marginTop: UI.scaleSize(12),
  },
  duration: {
    fontSize: UI.scaleSize(14),
    color: '#666666',
    marginTop: UI.scaleSize(12),
  },
  trendView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: UI.scaleSize(12),
  },
  trendText: {
    marginLeft: UI.scaleSize(10),
    fontSize: UI.scaleSize(14),
    color: '#666666',
  },
});

export default HistoryRecord;
