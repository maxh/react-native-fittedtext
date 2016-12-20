import React, { Component } from 'react';
import { View } from 'react-native';
import FittedText from 'index';

export default class ExampleFittedText extends Component {
  render() {
    var {height, width} = Dimensions.get('window');
    return (
      <View style={{flex: 1}}>
        <FittedText targetHeight={height}>
          I will expand to fill the window!
        </FittedText>
      </View>
    );
  }
}

AppRegistry.registerComponent('ExampleFittedText', () => ExampleFittedText);