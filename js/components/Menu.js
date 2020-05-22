import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Alert,
  Platform,
} from 'react-native';
import UI from '~/modules/UI';
import i18n from '~/i18n';
import panResponderHandlers from '~/components/panResponder';
import AudioManager from '~/modules/services/audio-manager';
import EventTracking from '~/modules/services/event-tracking';
import FastImage from 'react-native-fast-image';

const addImg = require('~/images/limitTimePurchase.jpg');

class Menu extends Component {
  constructor(props) {
    super(props);
    const top =
      UI.size.deviceHeight -
      UI.scaleSize(90) -
      (Platform.OS === 'android'
        ? UI.scaleSize(30) + ((UI.size.deviceWidth - UI.scaleSize(30)) * 160) / 345
        : UI.scaleSize(40) + ((UI.size.deviceWidth - UI.scaleSize(30)) * 160) / 345);
    // 定义悬浮按钮四点坐标
    this.menuCoordinate = [
      {
        // 左上
        top: UI.scaleSize(100),
        left: UI.scaleSize(5),
      },
      {
        // 右上
        top: UI.scaleSize(100),
        left: UI.size.deviceWidth - UI.scaleSize(95),
      },
      {
        // 左下
        top: top,
        left: UI.scaleSize(5),
      },
      {
        // 右下
        top: top,
        left: UI.size.deviceWidth - UI.scaleSize(95),
      },
    ];

    this.state = {
      coordinateIndex: 3,
      menuAnim: new Animated.ValueXY({
        x: this.menuCoordinate[3].left,
        y: this.menuCoordinate[3].top,
      }),
      opacityAnim: new Animated.Value(0),
      menuOpened: false,
    };
  }

  componentWillMount() {
    this.canMove = true;
    this.panHandlers = panResponderHandlers({
      moveStart: this.moveStart,
      moving: this.moving,
      moveRelease: this.moveRelease,
      click: this.click,
    }).panHandlers;
  }

  startMenuAnim(index) {
    this.canMove = false;
    Animated.spring(this.state.menuAnim, {
      toValue: {
        x: this.menuCoordinate[index].left,
        y: this.menuCoordinate[index].top,
      },
      useNativeDriver: true,
    }).start(() => {
      this.canMove = true;
      this.setState({ coordinateIndex: index });
    });
  }

  startOpacityAnim() {
    Animated.timing(this.state.opacityAnim, {
      toValue: 1,
      easing: Easing.linear,
      duration: 200,
    }).start(() => {});
  }

  endOpacityAnim() {
    Animated.timing(this.state.opacityAnim, {
      toValue: 0,
      easing: Easing.linear,
      duration: 200,
    }).start(() => {});
  }
  navigate = () => {
    EventTracking.track('t0105', 'r0135');
    const { navigation } = this.props;
    navigation.navigate('bannerDetail', {
      target_url: 'https://r-read.dubaner.com/share/build/9.9.promo.html',
      source: '活动购买按钮',
    });
  };

  click = () => {
    if (!this.canMove) {
      return;
    }
    AudioManager.click();
    this.navigate();
  };

  closeMenu() {
    this.setState({ menuOpened: false });
    this.endOpacityAnim();
  }

  moveStart = () => {
    this.dx = 0;
    this.dy = 0;
  };

  moving = ({ dx, dy }) => {
    if (!this.canMove || this.state.menuOpened) {
      return;
    }
    this.dx = dx;
    this.dy = dy;
    const coordinate = this.menuCoordinate[this.state.coordinateIndex];
    this.state.menuAnim.setValue({
      x: dx + coordinate.left,
      y: dy + coordinate.top,
    });
  };

  moveRelease = () => {
    const { coordinateIndex } = this.state;
    const { dx, dy } = this;
    switch (coordinateIndex) {
      case 0:
        if (dx >= 100 && dy >= 100) {
          this.startMenuAnim(3);
        } else if (dx > dy && dx > 0) {
          this.startMenuAnim(1);
        } else if (dx < dy && dy > 0) {
          this.startMenuAnim(2);
        } else {
          this.startMenuAnim(0);
        }
        break;
      case 1:
        if (dx <= -100 && dy >= 100) {
          this.startMenuAnim(2);
        } else if (dx + dy < 0 && dx < 0) {
          this.startMenuAnim(0);
        } else if (dx + dy > 0 && dy > 0) {
          this.startMenuAnim(3);
        } else {
          this.startMenuAnim(1);
        }
        break;
      case 2:
        if (dx >= 100 && dy <= -100) {
          this.startMenuAnim(1);
        } else if (dx + dy > 0 && dx > 0) {
          this.startMenuAnim(3);
        } else if (dx + dy < 0 && dy < 0) {
          this.startMenuAnim(0);
        } else {
          this.startMenuAnim(2);
        }
        break;
      case 3:
        if (dx <= -100 && dy <= -100) {
          this.startMenuAnim(0);
        } else if (dy < dx && dy < 0) {
          this.startMenuAnim(1);
        } else if (dx < dy && dx < 0) {
          this.startMenuAnim(2);
        } else {
          this.startMenuAnim(3);
        }
        break;
      default:
        break;
    }
  };

  play = () => {
    const { data, index } = this.props;
    if (!data[index].sound) {
      return Alert.alert(i18n.t('warn.error'));
    }
    this.props.play(data[index].sound, 'PLAY', true);
  };

  clickRecording = () => {
    this.props.recording();
  };

  render() {
    const { menuAnim, opacityAnim, coordinateIndex, menuOpened } = this.state;
    const { user } = this.props;
    if (user.is_member === 'true' || user.activity === '1') {
      return null;
    }
    const coordinate = this.menuCoordinate[coordinateIndex];
    return (
      <View
        style={[
          styles.container,
          {
            // backgroundColor: menuOpened ? '#00000011' : 'transparent',
          },
        ]}
        // pointerEvents={menuOpened ? 'auto' : 'box-none'}
        pointerEvents="box-none"
        // onStartShouldSetResponder={() => true}
        // onResponderGrant={() => {
        //   this.closeMenu();
        // }}
      >
        <Animated.View
          style={[
            styles.menuView,
            {
              zIndex: 100,
              transform: [
                { translateX: menuAnim.x },
                { translateY: menuAnim.y },
                {
                  rotateZ: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
              ],
            },
          ]}
          {...this.panHandlers}
        >
          <FastImage source={addImg} style={styles.img} />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuView: {
    position: 'absolute',
    width: 90,
    height: 90,
  },
  img: {
    width: 91,
    height: 81,
  },
});

export default Menu;
