import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

import { dispatch } from '~/modules/redux-app-config';
import UI from '~/modules/UI';
import { checkReadingPermission, sendEvent2Sheet, getBookBgColors } from '~/modules/services/utils';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';

const readedImg = require('./img/yidu.png');
const unreadImg = require('./img/unread.png');
// 图书锁住图标
const lockImg = require('~/images/book_lock.png');

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grade: props.grade,
      page: 1,
      size: 24,
      read_flag: 0,
      loading: false,
      clickGrade: '',
    };
    this.ITEM_HEIGHT =
      (UI.scaleSize(140) * ((UI.size.deviceWidth - UI.scaleSize(60)) / 3)) / UI.scaleSize(105);
    this.SEPARATOR_HEIGHT = UI.scaleSize(15);
  }

  // 会员选择年级后, 进行网络请求
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { grade } = this.props;
    const { page, size, read_flag } = this.state;
    if (nextProps.grade !== grade) {
      const nextGrade = nextProps.grade;
      this.getBookShelf({
        page,
        size,
        grade: nextGrade,
        read_flag,
        isRefresh: true,
      });
    }
  }

  UNSAFE_componentWillMount() {
    this.gradeL = [
      { index: 1, name: '一年级' },
      { index: 2, name: '二年级' },
      { index: 3, name: '三年级' },
      { index: 4, name: '四年级' },
      { index: 5, name: '五年级' },
      { index: 6, name: '六年级' },
    ];
    const { data, userInfo } = this.props;
    const { page, size, grade, read_flag } = this.state;
    if (data.length > 0) {
      // 检验已经存在的图书年级是否和当前年级符合（同步登录之后的用户年级）
      if (data[0].grade.split('')[1] != userInfo.user.study_year) {
        this.getBookShelf({
          page,
          size,
          grade,
          read_flag,
          isRefresh: true,
        });
      }
      return;
    }
    this.getBookShelf({
      page,
      size,
      grade,
      read_flag,
      isRefresh: true,
    });
  }

  getBookShelf({ page, size, grade, read_flag, isRefresh = false }) {
    if (page > 1) {
      this.setState({ loading: true });
    } else {
      dispatch('SET_LOADING', { visible: true });
    }
    dispatch('GET_BOOKSHELF', {
      page,
      size: size,
      grade,
      read_flag,
      isRefresh,
      callback: () => {
        if (page > 1) {
          this.setState({ loading: false });
        } else {
          dispatch('SET_LOADING', { visible: false });
        }
      },
    });
  }

  ItemSeparatorComponent = () => <View style={{ height: this.SEPARATOR_HEIGHT }} />;

  ListFooterComponent() {
    const { loading, page, size } = this.state;
    const { data, current_level_count } = this.props;
    if (!loading && data.length > 0 && Math.ceil(current_level_count / size) === page) {
      return (
        <View style={styles.footView}>
          <Text style={styles.footerText}>已加载该年级所有图书</Text>
        </View>
      );
    }
    if (loading) {
      return (
        <View style={styles.footView}>
          <ActivityIndicator size="small" color="#DCDCDC" />
          <Text style={[styles.footerText, { marginLeft: UI.scaleSize(10) }]}>
            正在加载下一页...
          </Text>
        </View>
      );
    }
    return <View style={styles.footView} />;
  }

  onEndReached = () => {
    if (this.state.page * this.state.size >= this.props.current_level_count) {
      return;
    }
    this.page = this.state.page;
    this.setState({ page: this.page + 1 });
    const { grade } = this.props;
    const { page, size, read_flag } = this.state;
    this.getBookShelf({
      page: this.page + 1,
      size,
      grade,
      read_flag,
    });
  };

  getItemLayout = (data, index) => ({
    length: this.ITEM_HEIGHT,
    offset: (this.ITEM_HEIGHT + this.SEPARATOR_HEIGHT) * index,
    index,
  });

  pressItem = async (item, index) => {
    const { userInfo, navigation } = this.props;
    const data = checkReadingPermission(userInfo, item);
    if (data.status === 'fail') {
      sendEvent2Sheet({
        msg: data.msg,
        userInfo,
        book: item,
        redirectRouteName: 'book',
      });
      return;
    }
    navigation.navigate('cover', {
      item,
      index,
      UPDATE_READOVER_ACTION: 'UPDATE_BOOK_STATUS',
    });
  };

  renderItem = ({ item, index }) => {
    const { userInfo, hosts } = this.props;
    const msg = checkReadingPermission(userInfo, item);
    let isShow;
    if (msg.status === 'fail') {
      isShow = 'true';
    }
    return (
      <MyTouchableOpacity
        style={[
          styles.item,
          {
            marginLeft: index % 3 === 0 ? 0 : UI.scaleSize(15),
          },
        ]}
        activeOpacity={0.8}
        onPress={this.pressItem.bind(this, item, index)}
      >
        <FastImage
          source={{ uri: hosts.book_cover + item.cover }}
          style={styles.cover}
          resizeMode="stretch"
        />

        <View style={[styles.bottomView]}>
          <Text numberOfLines={1} style={styles.bookName}>
            {item.name}
          </Text>
          <View style={styles.readView}>
            <Image
              style={styles.readedImgStyle}
              source={item.read_over === 'true' ? readedImg : unreadImg}
              resizeMode="contain"
            />
            <Text style={styles.readText}>{item.read_over === 'true' ? '已读' : '未读'}</Text>
          </View>
        </View>
        {isShow === 'true' && (
          <View style={styles.lockView}>
            <FastImage source={lockImg} resizeMode="contain" style={styles.lockImg} />
          </View>
        )}
      </MyTouchableOpacity>
    );
  };

  render() {
    const { userInfo } = this.props;
    let { data } = this.props;
    data = _.drop(data, 5);
    const { clickGrade } = this.state;
    const study_year = userInfo.user.study_year || 1;
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          columnWrapperStyle={styles.columnStyle}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.ItemSeparatorComponent}
          ListFooterComponent={this.ListFooterComponent.bind(this)}
          getItemLayout={this.getItemLayout}
          initialNumToRender={12}
          numColumns={3}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: UI.scaleSize(15),
  },
  item: {
    width: (UI.size.deviceWidth - UI.scaleSize(60)) / 3,
    height:
      (UI.scaleSize(140) * ((UI.size.deviceWidth - UI.scaleSize(60)) / 3)) / UI.scaleSize(105),
    borderRadius: UI.scaleSize(5),
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: UI.color.black,
    elevation: 2,
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: UI.scaleSize(35),
    backgroundColor: 'white',
    justifyContent: 'space-around',
    paddingHorizontal: UI.scaleSize(5),
  },
  subBottomView: {
    marginBottom: UI.scaleSize(2),
  },
  lockView: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: (UI.size.deviceWidth - UI.scaleSize(60)) / 3,
    height:
      (UI.scaleSize(140) * ((UI.size.deviceWidth - UI.scaleSize(60)) / 3)) / UI.scaleSize(105),
    borderRadius: UI.scaleSize(5),
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockImg: {
    width: UI.scaleSize(32),
    height: UI.scaleSize(34),
  },
  cover: {
    width: (UI.size.deviceWidth - UI.scaleSize(60)) / 3,
    height:
      (UI.scaleSize(140) * ((UI.size.deviceWidth - UI.scaleSize(60)) / 3)) / UI.scaleSize(105),
  },
  readView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readText: {
    fontSize: UI.scaleSize(9),
    color: '#999999',
    fontWeight: '300',
  },
  readedImgStyle: {
    marginRight: UI.scaleSize(2),
    width: UI.scaleSize(10),
    height: UI.scaleSize(10),
  },
  freeView: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: UI.scaleSize(58),
    height: UI.scaleSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: UI.scaleSize(10),
    backgroundColor: '#FF9900',
  },
  freeText: {
    fontSize: UI.scaleSize(14),
    color: 'white',
  },
  bookName: {
    fontSize: UI.scaleSize(11),
    color: UI.color.text5,
    fontWeight: '300',
  },

  columnStyle: {
    flexDirection: 'row',
  },

  footView: {
    width: UI.size.deviceWidth - UI.scaleSize(45),
    height: UI.scaleSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerText: {
    fontSize: UI.scaleSize(16),
    color: UI.color.text1,
  },
});

export default BookList;
