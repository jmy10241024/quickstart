import React, { Component } from 'react';
import { SafeAreaView, Image, Text, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { dispatch } from '~/modules/redux-app-config';
import UI from '~/modules/UI';
import { Toast } from 'teaset';
import CustomNav from '~/components/CustomNav';

import { LargeList } from 'react-native-largelist-v3';
import { ChineseWithLastDateHeader } from 'react-native-spring-scrollview/Customize';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';

// 内容为空的图片
const nullImg = require('~/images/none.jpg');

class PurchaseRecording extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allLoaded: true,
      imgHost: 'https://dubaner-reading.oss-cn-beijing.aliyuncs.com/resource/',
      data: [{ items: [] }],
    };
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  largeList;

  index = 0;

  /**
   * @description:获取购买记录
   * @param :
   * @return:
   */
  getPurchaseListTrade = async () => {
    dispatch('SET_LOADING', { visible: true });
    const ret = await new Promise(res => {
      dispatch('GET_PURCHASE_LIST_TRADE', {
        minId: '-1',
        res,
      });
    }).catch(error => {});
    dispatch('SET_LOADING', { visible: false });
    if (ret && ret.code === 0) {
      if (ret.result.member_img_host) {
        this.setState({ imgHost: ret.result.member_img_host });
      }
      if (ret.result.trade_ext && ret.result.trade_ext.length > 0) {
        this.setState({ data: [{ items: ret.result.trade_ext }] });
      }
    } else {
      Toast.fail(ret.msg);
    }
  };

  /**
   * @description: 下拉刷新
   * @param :
   * @return:
   */
  _onRefresh = () => {
    setTimeout(() => {
      this.largeList.endRefresh();
      this.index = 0;
      this.setState({});
    }, 2000);
  };

  /**
   * @description: 上拉加载
   * @param :
   * @return:
   */
  _onLoading = () => {
    setTimeout(() => {
      this.largeList.endLoading();
      this.setState({});
    }, 2000);
  };

  /**
   * @description: 渲染item
   * @param :
   * @return:
   */
  _renderItem = ({ section, row }) => {
    const { data, imgHost } = this.state;
    const contact = data[section].items[row];
    const res = contact.context;
    return (
      <View style={styles.rowView}>
        <MyTouchableOpacity activeOpacity={0.7} style={styles.row}>
          <FastImage
            source={{ uri: `${imgHost}${res.img_url}` }}
            resizeMode="contain"
            style={styles.image}
          />
          <View style={styles.rContainer}>
            <Text style={styles.text}>{res.title}</Text>
            <View style={styles.validView}>
              <Text style={styles.text}>有效期: </Text>
              <Text style={styles.redText}>{res.duration}天</Text>
            </View>
            <Text style={[styles.redText, { marginTop: UI.scaleSize(10) }]}>
              ¥{(res.price / 100).toFixed(2)}
            </Text>
          </View>
        </MyTouchableOpacity>
      </View>
    );
  };

  componentDidMount() {
    this.getPurchaseListTrade();
  }

  render() {
    const { allLoaded, data } = this.state;
    return (
      <View style={styles.container}>
        <CustomNav
          containerStyle={{ backgroundColor: 'white' }}
          title="购买记录"
          titleColor="#3C3C5C"
          imgType="gray"
          navigation={this.props.navigation}
        />

        {data[0].items.length === 0 ? (
          <View style={styles.nullContainer}>
            <FastImage source={nullImg} style={styles.nullImg} />
            <Text style={styles.nullText}>你还没有任何购买记录哦~</Text>
          </View>
        ) : (
          <LargeList
            ref={ref => {
              this.largeList = ref;
            }}
            data={data}
            heightForSection={() => 0}
            heightForIndexPath={() => 115}
            renderIndexPath={this._renderItem}
            allLoaded={allLoaded}
          />
        )}
        <View height={20} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nullContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nullImg: {
    width: UI.scaleSize(136),
    height: UI.scaleSize(110),
  },
  nullText: {
    marginTop: UI.scaleSize(20),
    fontSize: UI.scaleSize(14),
    color: '#5B5B5B',
  },
  rowView: {
    width: UI.size.deviceWidth,
    height: UI.scaleSize(125),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    borderRadius: UI.scaleSize(10),
    marginVertical: UI.scaleSize(16),
    marginLeft: UI.scaleSize(16),
    width: UI.scaleSize(80),
    height: UI.scaleSize(80),
  },
  rContainer: {
    marginLeft: 20,
  },
  validView: {
    flexDirection: 'row',
    marginTop: UI.scaleSize(10),
    alignItems: 'center',
  },
  text: {
    fontSize: UI.scaleSize(14),
    color: '#333333',
  },
  redText: {
    fontSize: UI.scaleSize(14),
    color: '#FC6E51',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default PurchaseRecording;
