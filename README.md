# react-native-fittedtext

A React Native text component that sets its `fontSize` to fill a target height.

## Installation

```
npm install react-native-fittedtext --save
```

## Usage

```jsx
<FittedText targetHeight={height}>
  I will expand to fill the specified height!
</FittedText>
```

## Full example


```js
import React, { Component } from 'react';
import { AppRegistry, Dimensions, Text, View } from 'react-native';
import FittedText from 'react-native-fittedtext';

export default FittedExample = () => {
  var {height, width} = Dimensions.get('window');
  return (
    <View style={{flex: 1}}>
      <FittedText targetHeight={height}>
        I will expand to fill the window!
      </FittedText>
    </View>
  );
}

AppRegistry.registerComponent('FittedExample', () => FittedExample);
```

### Screenshot


![iOS Screenshot](/ios-screenshot.png)