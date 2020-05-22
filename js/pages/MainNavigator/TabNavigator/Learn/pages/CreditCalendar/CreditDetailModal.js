import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, Image, ImageBackground } from 'react-native';

import UI from '~/modules/UI';
import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import moment from 'moment';

const calendarBg = require('./img/calendar_bg.png');
const popupBg = require('./img/popup_bg.png');
const popupClosed = require('./img/popup_closed.png');
const cutImg = require('~/images/cut.png');

class CreditDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, detail, setVisible, navigation } = this.props;
    return (
      <Modal visible={visible} onRequestClose={() => {}} transparent animationType="fade">
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.imageView}>
              <Image source={popupBg} style={styles.popupBg} />
              <ImageBackground source={calendarBg} style={styles.calendarBg}>
                <Text style={styles.date}>
                  {detail && moment.unix(detail.currentUnix).format('MM月DD日')}
                </Text>
              </ImageBackground>
            </View>
            {detail && detail.id ? (
              <View style={styles.item}>
                <Text style={styles.typeName}>{detail.type_name}</Text>
                <View style={{ flex: 1 }} />
                <Image source={cutImg} style={styles.cut} resizeMode="contain" />
                <Text style={styles.golds}>+{detail.golds}</Text>
              </View>
            ) : (
              <View style={styles.item2}>
                <Text style={styles.toStudyText}>还没有积分呢，快去学习吧！</Text>
                <MyTouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    setVisible();
                    setTimeout(() => {
                      navigation.goBack();
                    }, 200);
                  }}
                >
                  <Text style={styles.toStudyText2}>去学习</Text>
                </MyTouchableOpacity>
              </View>
            )}
          </View>
          <MyTouchableOpacity onPress={setVisible}>
            <Image source={popupClosed} style={styles.popupClosed} />
          </MyTouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  card: {
    width: UI.size.deviceWidth - UI.scaleSize(58) * 2,
    paddingHorizontal: UI.scaleSize(24),
    paddingVertical: UI.scaleSize(24),
    minHeight: UI.scaleSize(140),
    backgroundColor: 'white',
    borderRadius: UI.scaleSize(10),
    overflow: 'visible',
  },
  imageView: {
    position: 'absolute',
    width: UI.scaleSize(UI.size.deviceWidth - UI.scaleSize(58) * 2),
    alignItems: 'center',
    top: -UI.scaleSize(105),
    left: 0,
    height: UI.scaleSize(105),
    overflow: 'visible',
  },
  calendarBg: {
    position: 'absolute',
    bottom: -UI.scaleSize(16),
    width: UI.scaleSize(145),
    height: UI.scaleSize(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: UI.scaleSize(16),
    color: '#FFFFFF',
  },
  popupBg: {
    width: UI.scaleSize(197),
    height: UI.scaleSize(105),
  },
  popupClosed: {
    width: UI.scaleSize(26),
    height: UI.scaleSize(26),
    alignSelf: 'center',
    marginTop: UI.scaleSize(30),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: UI.scaleSize(20),
  },
  typeName: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
  },
  cut: {
    width: UI.scaleSize(19),
    height: UI.scaleSize(20),
  },
  golds: {
    marginLeft: UI.scaleSize(6),
    fontSize: UI.scaleSize(16),
    color: '#FFC819',
  },
  item2: {
    marginTop: UI.scaleSize(20),
  },
  toStudyText: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
    lineHeight: UI.scaleSize(20),
  },
  btn: {
    width: UI.scaleSize(100),
    height: UI.scaleSize(44),
    borderRadius: UI.scaleSize(22),
    backgroundColor: '#FFC819',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: UI.scaleSize(10),
  },
  toStudyText2: {
    fontSize: UI.scaleSize(16),
    color: '#333333',
  },
});

export default CreditDetailModal;
