import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import UI from '~/modules/UI';

class TextKaraoke extends Component {
  render() {
    const { text, activeColor, disabled, onPress, percentage } = this.props;

    return (
      <TouchableOpacity
        style={{ marginLeft: 5 }}
        // disabled={disabled}
        onPress={() => {
          onPress(text);
        }}
      >
        <Text
          style={{
            fontSize: UI.scaleSize(20),
            color: UI.color.text1,
            fontWeight: 'bold',
          }}
        >
          {text}
        </Text>
        <Text
          style={{
            fontSize: UI.scaleSize(20),
            position: 'absolute',
            top: 0,
            left: 0,
            minWidth: 0,
            // maxWidth: '100%',
            width: `${percentage}%`,
            color: activeColor,
            overflow: 'hidden',
            fontWeight: 'bold',
          }}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default TextKaraoke;
