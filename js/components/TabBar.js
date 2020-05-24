import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import UI from '~/modules/UI';
import posed from 'react-native-pose';

const SpotLight = posed.View({
  route0: { x: 0 },
  route1: { x: UI.size.deviceWidth / 2 },
  route2: { x: (UI.size.deviceWidth / 4) * 2 },
  route3: { x: (UI.size.deviceWidth / 4) * 3 },
});

const Scaler = posed.View({
  active: { scale: 1 },
  inactive: { scale: 0.75 },
});

const S = StyleSheet.create({
  container: {
    paddingBottom: UI.isIphoneX() || UI.isIphoneXR() ? UI.scaleSize(20) : 0,
    flexDirection: 'row',
    height: Platform.OS === 'android' ? UI.scaleSize(50) : UI.scaleSize(60),
    // backgroundColor: '#0ff',
    backgroundColor: 'white',
    overflow: 'visible',
    borderTopLeftRadius: UI.scaleSize(20),
    borderTopRightRadius: UI.scaleSize(20),
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.5,
    // shadowRadius: 5,
    // shadowColor: UI.color.black,
    // elevation: 12,
  },
  tabButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  spotLight: {
    width: UI.size.deviceWidth / 4,
    height: '100%',
    backgroundColor: 'rgba(0,255,0,0.5)',
    // backgroundColor: 'white',
    borderRadius: 8,
  },
});

const TabBar = props => {
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation,
  } = props;
  const { routes, index: activeRouteIndex } = navigation.state;
  return (
    <View style={S.container}>
      {/* <View style={StyleSheet.absoluteFillObject}>
        <SpotLight style={S.spotLight} pose={`route${activeRouteIndex}`} />
      </View> */}
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

        return (
          <TouchableOpacity
            key={routeIndex}
            style={S.tabButton}
            onPress={() => {
              onTabPress({ route });
            }}
            onLongPress={() => {
              onTabLongPress({ route });
            }}
            accessibilityLabel={getAccessibilityLabel({ route })}
          >
            <Scaler pose={isRouteActive ? 'active' : 'inactive'}>
              {renderIcon({ route, focused: isRouteActive, tintColor })}
            </Scaler>
            {/* {isRouteActive && <Text style={{ color: 'white' }}> {getLabelText({ route })} </Text>} */}
            <Text
              style={{ color: isRouteActive ? '#FF9900' : '#9D9DAD', fontSize: UI.scaleSize(10) }}
            >
              {getLabelText({ route })}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
