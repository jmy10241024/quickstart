import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

import UI from '~/modules/UI';
import { dispatch } from '~/modules/redux-app-config';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import CustomNav from '~/components/CustomNav';

const readBookImg = require('./img/readBook.png');
const wordIcon = require('./img/word_icon.png');
const timeIcon = require('./img/time_icon.png');
const wordsIcon = require('./img/words_icon.png');
const readIcon = require('./img/read_icon.png');

// 一到日星期几数组
const chineseWeekL = ['一', '二', '三', '四', '五', '六', '日'];

class StudyReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment()
        .startOf('day')
        .unix(),
      today: moment()
        .startOf('day')
        .unix(),
      list: [],
      report: {},
    };
    this.courseInfo = {
      reading_book: {
        img: readBookImg,
        title: '读书',
        content: [
          { type: 'book_number', unit: '本', title: '阅读' },
          { type: 'word_count', unit: '词', title: '阅读量' },
          { type: 'word_count_dis', unit: '个', title: '词汇' },
          { type: 'learn_times', unit: '分钟', title: '时长' },
        ],
      },
      dancibao: { img: wordIcon, title: '学习' },
    };
    this.reportAll = [
      { img: timeIcon, unit: '分钟', content: '时长', type: 'learn_times' },
      { img: readIcon, unit: '本', content: '读书', type: 'book_number' },
      { img: wordsIcon, unit: '字', content: '阅读量', type: 'word_count' },
    ];
  }

  static navigationOptions = {
    header: null,
  };

  UNSAFE_componentWillMount = () => {
    this.getDailyReport(this.state.today);
    this.getAllReport();
  };

  /**
   * @description: 获取学习日报
   */
  getDailyReport(unix) {
    dispatch('GET_DAILY_REPORT', {
      day: moment.unix(unix).format('YYYY-MM-DD'),
      res: res => {
        if (res && res.msg === 'Success') {
          this.setState({ list: res.result.report[0].course_list });
        }
      },
    });
  }

  getAllReport = () => {
    dispatch('GET_ALL_REPORT', {
      res: res => {
        if (res && res.msg === 'Success') {
          this.setState({ report: res.result.report });
        }
      },
    });
  };

  selectOneDay = selectedDate => {
    this.setState({ selectedDate });
    this.getDailyReport(selectedDate);
  };

  render() {
    const { selectedDate, today, list, report } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={{ flex: 1 }}>
            <CustomNav
              title="学习报告"
              titleColor="#3C3C5C"
              imgType="gray"
              containerStyle={{ backgroundColor: 'white' }}
              navigation={this.props.navigation}
            />
            <View style={styles.dayReportView}>
              <Text style={styles.dayReportText}>日报</Text>
              <View style={styles.chineseWeekView}>
                {chineseWeekL.map((item, index) => (
                  <View style={styles.chineseItemView} key={_.uniqueId()}>
                    <Text key={item} style={styles.chineseText}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.dividerView} />
              <View style={styles.numberWeekView}>
                {Array.from({ length: 7 }).map((item, index) => {
                  const dayOfWeek = moment()
                    .startOf('week')
                    .add(index, 'd')
                    .unix();
                  return (
                    <MyTouchableOpacity
                      key={dayOfWeek}
                      disabled={dayOfWeek > today}
                      style={[
                        styles.numberItemTouch,
                        selectedDate === dayOfWeek && styles.activeTouch,
                      ]}
                      onPress={() => {
                        this.selectOneDay(dayOfWeek);
                      }}
                    >
                      <Text
                        style={[
                          styles.numberText,
                          selectedDate === dayOfWeek && styles.activeNumber,
                          dayOfWeek > today && styles.disabledNumber,
                        ]}
                      >
                        {moment.unix(dayOfWeek).format('D')}
                      </Text>
                    </MyTouchableOpacity>
                  );
                })}
              </View>
              {list.map(course => {
                let isEmpty = true;
                course.data_list.forEach((item, index) => {
                  const value = item[this.courseInfo[course.course_type].content[index].type];
                  if (value > 0) {
                    isEmpty = false;
                  }
                });
                if (isEmpty) {
                  return (
                    <View style={styles.emptyView}>
                      <FastImage
                        source={readBookImg}
                        style={styles.emptyImg}
                        resizeMode="contain"
                      />
                      <Text style={styles.emptyText}>
                        你今天没有{this.courseInfo[course.course_type].title}
                        哦~
                      </Text>
                    </View>
                  );
                }
                return (
                  <View key={course.course_type} style={styles.readView}>
                    <View style={styles.readImgView}>
                      <FastImage
                        resizeMode="contain"
                        style={styles.readImg}
                        source={this.courseInfo[course.course_type].img}
                      />
                    </View>

                    {isEmpty ? (
                      <View style={UI.style.container}>
                        <Text style={styles.emptyText}>
                          你今天没有{this.courseInfo[course.course_type].title}
                          哦~
                        </Text>
                      </View>
                    ) : (
                      course.data_list.map((item, index) => {
                        const { title, type, unit } = this.courseInfo[course.course_type].content[
                          index
                        ];
                        return (
                          <View key={_.uniqueId()} style={styles.itemView}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.type}>
                              {type === 'learn_times'
                                ? item[type] < 60
                                  ? '<1'
                                  : parseInt(item[type] / 60)
                                : item[type]}
                              <Text style={styles.unit}>{unit}</Text>
                            </Text>
                          </View>
                        );
                      })
                    )}
                  </View>
                );
              })}
              <View style={{ height: UI.scaleSize(24) }} />
            </View>
            <Text style={styles.totalTitle}>累计概览</Text>
            <View style={styles.totalList}>
              {this.reportAll.map((reportItem, index) => (
                // const
                <View key={_.uniqueId()} style={styles.reportItem}>
                  <FastImage source={this.reportAll[index].img} style={styles.reportImg} />
                  <Text style={[styles.reportContent]}>{reportItem.content}</Text>
                  <Text style={[styles.type, { color: '#FFFFFF', fontSize: UI.scaleSize(18) }]}>
                    {reportItem.type === 'learn_times'
                      ? report.learn_times < 60
                        ? '<1'
                        : parseInt(report.learn_times / 60)
                      : report[reportItem.type]}
                    <Text style={[styles.unit, { color: '#FFFFFF', fontSize: UI.scaleSize(18) }]}>
                      {reportItem.unit}
                    </Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomView} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  dayReportView: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: UI.scaleSize(30),
    width: UI.size.deviceWidth - UI.scaleSize(32),
    borderRadius: UI.scaleSize(10),
    backgroundColor: '#FFFFFF',
  },
  dayReportText: {
    alignSelf: 'flex-start',
    fontSize: UI.scaleSize(18),
    color: '#3C3C5C',
    fontWeight: 'bold',
  },
  chineseWeekView: {
    marginTop: UI.scaleSize(18),
    width: UI.size.deviceWidth - UI.scaleSize(30),
    height: UI.scaleSize(40),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  chineseItemView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: UI.scaleSize(44),
    height: UI.scaleSize(44),
  },
  chineseText: {
    fontSize: UI.scaleSize(14),
    color: '#CECED6',
    fontWeight: 'bold',
  },
  dividerView: {
    width: UI.size.deviceWidth - UI.scaleSize(40),
    height: UI.scaleSize(1),
    backgroundColor: '#E6E6EA',
    marginTop: UI.scaleSize(20),
  },
  numberWeekView: {
    marginTop: UI.scaleSize(18),
    width: UI.size.deviceWidth - UI.scaleSize(30),
    height: UI.scaleSize(40),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  numberItemTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    width: UI.scaleSize(44),
    height: UI.scaleSize(44),
  },
  activeTouch: {
    borderRadius: UI.scaleSize(22),
    backgroundColor: '#FF8811',
  },
  numberText: {
    color: '#3C3C5C',
    fontSize: UI.scaleSize(16),
    fontWeight: 'bold',
  },
  activeNumber: {
    color: '#FFFFFF',
  },
  disabledNumber: {
    color: '#CECED6',
  },
  readView: {
    marginTop: UI.scaleSize(18),
    width: UI.size.deviceWidth - UI.scaleSize(40),
    height: UI.scaleSize(93),
    borderRadius: UI.scaleSize(10),
    borderWidth: UI.scaleSize(1),
    borderColor: '#FFE24A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: UI.scaleSize(6),
  },
  readImgView: {
    marginLeft: UI.scaleSize(10),
    width: UI.scaleSize(61),
    height: UI.scaleSize(61),
  },
  readImg: {
    width: UI.scaleSize(61),
    height: UI.scaleSize(61),
  },
  emptyText: {
    marginTop: UI.scaleSize(20),
    color: '#9D9DAD',
    fontSize: UI.scaleSize(16),
    fontWeight: 'bold',
  },
  itemView: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: UI.scaleSize(12),
    color: '#5B5B5B',
  },
  type: {
    fontSize: UI.scaleSize(18),
    fontWeight: 'bold',
    color: 'black',
    marginTop: UI.scaleSize(8),
  },
  unit: {
    fontSize: UI.scaleSize(18),
    fontWeight: 'bold',
    color: 'black',
    marginTop: UI.scaleSize(8),
  },
  totalView: {
    width: UI.size.deviceWidth - UI.scaleSize(40),
    borderRadius: UI.scaleSize(10),
    padding: UI.scaleSize(20),
    marginTop: UI.scaleSize(20),
    alignItems: 'center',
    alignSelf: 'center',
  },
  totalTitle: {
    fontSize: UI.scaleSize(18),
    color: '#3C3C5C',
    fontWeight: 'bold',
    marginTop: UI.scaleSize(40),
    marginLeft: UI.scaleSize(20),
  },
  totalList: {
    backgroundColor: '#3AAFFF',
    borderRadius: UI.scaleSize(10),
    height: UI.scaleSize(140),
    marginTop: UI.scaleSize(30),
    marginHorizontal: UI.scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  reportItem: {
    alignItems: 'center',
  },
  reportImg: {
    width: UI.scaleSize(26),
    height: UI.scaleSize(26),
  },
  reportContent: {
    marginTop: UI.scaleSize(5),
    fontSize: UI.scaleSize(12),
    color: '#FFFFFF',
    fontWeight: '300',
  },
  bottomView: {
    height: UI.scaleSize(20),
  },
  emptyView: {
    marginTop: UI.scaleSize(30),
    alignItems: 'center',
  },
  emptyImg: {
    width: UI.scaleSize(75),
    height: UI.scaleSize(56),
  },
});

export default StudyReport;
