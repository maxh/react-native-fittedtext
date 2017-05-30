# react-native-fittedtext [![Build Status](https://travis-ci.org/maxh/react-native-fittedtext.svg?branch=master)](https://travis-ci.org/maxh/react-native-fittedtext) [![npm version](https://badge.fury.io/js/react-native-fittedtext.svg)](https://badge.fury.io/js/react-native-fittedtext)

A React Native text component that sets its `fontSize` to fill a target height.

## Installation

```sh
npm install react-native-fittedtext --save
```

```sh
# Install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash

# This install process configures NVM_DIR in your .bashrc, which is needed for deployment.
# Locally, you'll need the same tools, so add them to your .bash_profile.
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bash_profile
echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.bash_profile
source ~/.bash_profile
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
