import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import _ from 'lodash';
import { CommonLottieHeader } from 'react-native-spring-scrollview/Customize/CommonLottieHeader';
import { CommonLottieFooter } from 'react-native-spring-scrollview/Customize/CommonLottieFooter';
import { LargeList } from 'react-native-largelist-v3';
import { Facebook } from 'react-content-loader/native';
import { Promise } from 'bluebird';

import { dispatch } from '~/modules/redux-app-config';
import UI from '~/modules/UI';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';

const MyContentLoader = () => <Facebook />;

export default class VocabularyList extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);
    this.state = {
      level_count: [], // A-Z数组
      data: [], // list数据源
      allLoaded: true, // 是否全部加载完毕
      start: '1', // 开始查询数
      size: '700', // 查询条数size
      level: 'A', // 首字母大写
      word_type: _.toString(this.props.navigation.state.params.word_type), // 1:读伴儿六千词 2:高频词 3:小学必备 4:新概念一 5:KET 6:PET
      count_flag: '1', // 是否获取A-Z每个级别单词总数传入参数1则返回，否则不返回
      learn_flag: '2', // 1:已掌握 2:未掌握 其他值默认为全部单词
    };
  }

  _largeList;
  _index = 0;

  UNSAFE_componentWillMount() {
    // 右侧字母字符串数组
    // this.upperLetterL = _.toArray(generateBig());
  }

  componentDidMount() {
    this.getGpsWordList();
  }

  render() {
    const { level, level_count, data } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {data.length === 0 ? <MyContentLoader /> : null}
        <LargeList
          ref={ref => (this._largeList = ref)}
          data={data}
          heightForSection={() => 40}
          renderSection={this._renderSection}
          heightForIndexPath={() => 60}
          renderIndexPath={this._renderItem}
          refreshHeader={CommonLottieHeader}
          onRefresh={this._onRefresh}
          // loadingFooter={CommonLottieFooter}
          // onLoading={this._onLoading}
          allLoaded={this.state.allLoaded}
          showsVerticalScrollIndicator={false}
        />
        <View height={40} />
        <View style={styles.letterView}>
          {level_count.map(item => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.letterTouch, level === item.level && { backgroundColor: 'orange' }]}
              onPress={() => {
                this._onLetterPress(item);
              }}
              key={_.uniqueId()}
            >
              <Text style={styles.letterText}>{item.level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // GET_GPS_WORD_LIST
  getGpsWordList = async () => {
    const { start, size, level, word_type, count_flag, learn_flag } = this.state;
    const ret = await new Promise(res => {
      dispatch('GET_GPS_WORD_LIST', {
        start,
        size,
        level,
        word_type,
        count_flag,
        learn_flag,
        res,
      });
    }).catch(error => {});
    this._largeList.endRefresh();

    if (ret && ret.msg === 'Success') {
      if (ret && ret.result.level_count) {
        this.setState({
          level_count: ret.result.level_count,
          data: [{ header: level, items: ret.result.word_list }],
        });
      }
    }
  };
  // 右侧字母点击事件
  _onLetterPress = item => {
    this.setState({
      data: [],
      level: item.level,
    });
    Promise.delay(100).then(() => {
      this.getGpsWordList();
    });
  };

  _onRefresh = async () => {
    this.getGpsWordList();
    // this._largeList.endRefresh();
  };

  _onLoading = () => {
    this._largeList.endLoading();
    // setTimeout(() => {
    //   this.setState(p => ({
    //     data: p.data.concat(contacts[++this._index]),
    //     allLoaded: this._index > 2,
    //   }));
    // }, 100);
  };

  _renderSection = (section: number) => {
    const { data } = this.state;
    const obj = data[section];
    return (
      <TouchableOpacity style={styles.section}>
        <Text style={styles.sectionText}>{obj.header}</Text>
      </TouchableOpacity>
    );
  };

  _renderItem = ({ section: section, row: row }) => {
    const obj = this.state.data[section].items[row];
    return (
      <MyTouchableOpacity activeOpacity={0.8} style={styles.itemTouch}>
        <View style={styles.rowView}>
          <View>
            <Text style={styles.title}>{obj.word}</Text>
            <Text style={styles.subTitle}>{obj.trans_short}</Text>
          </View>
          <AnimatedCircularProgress
            duration={1500}
            rotation={0}
            size={40}
            width={8}
            fill={_.toSafeInteger(obj.star) * 20 || 0}
            tintColor="tomato"
            backgroundColor="gray"
          >
            {/* {fill => <Text style={styles.points} />} */}
          </AnimatedCircularProgress>
        </View>
      </MyTouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: UI.scaleSize(20),
  },

  section: {
    flex: 1,
    // backgroundColor: '#EEE',
    justifyContent: 'center',
  },
  sectionText: {
    fontSize: UI.scaleSize(20),
    color: 'orange',
  },
  header: {
    alignSelf: 'center',
    marginVertical: 50,
  },
  itemTouch: {
    marginTop: UI.scaleSize(30),
    marginRight: UI.scaleSize(20),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: UI.scaleSize(1),
  },
  tempView: {
    width: UI.scaleSize(60),
    height: UI.scaleSize(20),
    backgroundColor: 'green',
  },
  title: {
    fontSize: UI.scaleSize(18),
    color: 'rgb(30,30,30)',
  },
  subTitle: {
    fontSize: UI.scaleSize(14),
    color: 'rgba(30,30,30,0.8)',
    marginTop: UI.scaleSize(5),
  },
  letterView: {
    position: 'absolute',
    right: UI.scaleSize(5),
    top: UI.scaleSize(10),
    width: UI.scaleSize(20),
    bottom: UI.scaleSize(100),
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  letterTouch: {
    width: UI.scaleSize(20),
    height: UI.scaleSize(20),
    borderRadius: UI.scaleSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontSize: UI.scaleSize(14),
  },
});
