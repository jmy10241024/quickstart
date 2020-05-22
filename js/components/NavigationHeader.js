import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';

import UI from '~/modules/UI';

class NavigationHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getRightComponent = (rightIcon, rightComponent) => {
    if (rightComponent) {
      return rightComponent;
    }
    if (rightIcon) {
      const { rightIconPress, rightIconStyle } = this.props;
      return (
        <TouchableOpacity style={{ padding: UI.scaleSize(5) }} onPress={rightIconPress}>
          <Image
            source={rightIcon}
            style={[styles.leftIcon, rightIconStyle]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
    return <View style={{ width: UI.scaleSize(29) }} />;
  };

  render() {
    const {
      containerStyle = {},
      navigation,
      leftIcon,
      rightIcon,
      leftIconPress,
      rightIconPress,
      leftIconStyle = {},
      rightIconStyle = {},
      rightComponent,
      title,
      titleStyle = {},
      isPosition = false,
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            height: UI.size.statusBarHeight + UI.scaleSize(50),
          },
          containerStyle,
          isPosition ? styles.position : {},
        ]}
      >
        <View style={{ flex: 1 }} />
        <View style={styles.header}>
          {leftIcon ? (
            <TouchableOpacity
              style={{ padding: UI.scaleSize(5) }}
              onPress={() => {
                if (leftIconPress) {
                  leftIconPress();
                } else {
                  navigation && navigation.goBack();
                }
              }}
            >
              <Image source={leftIcon} style={[styles.leftIcon, leftIconStyle]} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: UI.scaleSize(29) }} />
          )}
          <View style={UI.style.container}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          </View>
          {this.getRightComponent(rightIcon, rightComponent)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: UI.size.deviceWidth,
    backgroundColor: UI.color.primary,
  },
  position: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  header: {
    width: UI.size.deviceWidth,
    height: UI.scaleSize(50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: UI.scaleSize(15),
  },
  title: {
    fontSize: UI.scaleSize(20),
    color: UI.color.black,
    fontWeight: 'bold',
  },
  leftIcon: {
    width: UI.scaleSize(24),
    height: UI.scaleSize(24),
  },
});

export default NavigationHeader;
