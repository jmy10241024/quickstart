import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { BoxShadow } from 'react-native-shadow';

import MyTouchableOpacity from '~/components/MyTouchableOpacity';
import UI from '~/modules/UI';

class CheckInListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, subTitle, icon, onPress, btnText } = this.props;
    const shadowOpt = {
      width: UI.size.deviceWidth - UI.scaleSize(30),
      height: UI.scaleSize(110),
      color: '#C2C1C1',
      // color: '#f00',
      border: 2,
      radius: UI.scaleSize(10),
      opacity: 0.2,
      x: UI.scaleSize(15),
      y: UI.scaleSize(2),
      style: { marginTop: UI.scaleSize(12) },
    };
    return (
      <MyTouchableOpacity activeOpacity={0.7} style={styles.container} onPress={onPress}>
        <BoxShadow setting={shadowOpt}>
          <View style={styles.container2}>
            <Image source={icon} style={styles.icon} resizeMode="contain" />
            <View style={styles.titleView}>
              <Text style={styles.title}>{title}</Text>
              {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
            </View>
            <View style={styles.btn}>
              <Text style={styles.btnText}>{btnText}</Text>
            </View>
          </View>
        </BoxShadow>
      </MyTouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: UI.size.deviceWidth,
    height: UI.scaleSize(125),
  },
  container2: {
    position: 'relative',
    flex: 1,
    width: UI.size.deviceWidth - UI.scaleSize(32),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: UI.scaleSize(10),
    marginHorizontal: UI.scaleSize(15),
    paddingHorizontal: UI.scaleSize(15),
    backgroundColor: 'white',
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.25,
    // shadowRadius: 5,
    // shadowColor: UI.color.black,
    // elevation: 2,
  },
  icon: {
    width: UI.scaleSize(68),
    height: UI.scaleSize(90),
  },
  titleView: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: UI.scaleSize(12),
    marginRight: UI.scaleSize(12),
  },
  title: {
    fontSize: UI.scaleSize(14),
    color: UI.color.text5,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: UI.scaleSize(12),
    color: '#666666',
    marginTop: UI.scaleSize(4),
  },
  btn: {
    width: UI.scaleSize(90),
    height: UI.scaleSize(34),
    borderRadius: UI.scaleSize(17),
    backgroundColor: '#FD9801',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: UI.scaleSize(12),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  line: {
    width: UI.size.deviceWidth - UI.scaleSize(16) * 2,
    height: UI.scaleSize(1),
    backgroundColor: '#EEEEEE',
  },
});

export default CheckInListItem;
