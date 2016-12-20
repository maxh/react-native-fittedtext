A text component that automatically sets its `fontSize` so that the text expands to fit the `targetHeight` property.

    const Example() {
      var {height, width} = Dimensions.get('window');
      return (
        <View style={{flex: 1}}>
          <FittedText targetHeight={height}>
            I will expand to fill the window!
          </FittedText>
        </View>
      );
    }