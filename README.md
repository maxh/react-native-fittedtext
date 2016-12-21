A React Native text component that sets its fontSize to fill a target height.

    const Example = () => {
      var {height, width} = Dimensions.get('window');
      return (
        <View style={{flex: 1}}>
          <FittedText targetHeight={height}>
            I will expand to fill the window!
          </FittedText>
        </View>
      );
    }