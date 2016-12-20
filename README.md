A text component that automatically sets its `fontSize` so that the text expands to fit the `targetHeight` property.


    import React, { Component } from 'react';
    import { AppRegistry, Dimensions, StyleSheet, View } from 'react-native';
    import FittedText from 'react-native-fittedtext';

    export default class FullWindowText extends Component {
      render() {
        var {height, width} = Dimensions.get('window');
        return (
          <View style={styles.view}>
            <FittedText targetHeight={height} style={styles.text}>
              I will expand to fill the window!
            </FittedText>
          </View>
        );
      }
    }

    const styles = StyleSheet.create({
      view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
      text: {
        textAlign: 'center'
      }
    });

    AppRegistry.registerComponent('FullWindowText', () => FullWindowText);