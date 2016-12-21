import React, { Component } from 'react';
import {
  findNodeHandle,
  NativeModules,
  Text,
  View
} from 'react-native';

const UIManager = NativeModules.UIManager;


const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};


export default class FittedText extends Component {
  constructor(props) {
    super(props);
    this.findUpperBound = this.findUpperBound.bind(this);
    this.findFit = this.findFit.bind(this);
    this.state = {
      promises: [],
      isFitted: false,
      fontSize: props.initialFontSize,
      step: 0,
      bestSeenFontSize: 0,
      bestSeenHeight: 0
    };
  }

  componentDidMount() {
    return this.findUpperBound().then(this.findFit);
  }

  componentWillUnmount() {
    this.state.promises.forEach(promise => promise.cancel());
    this.setState({promises: []});
  }

  render() {
    const color = (this.props.style && this.props.style.color) || 'black';
    const styleOverrides = {
      backgroundColor: 'transparent',
      fontSize: this.state.fontSize,
      color: this.state.isFitted ? color : 'transparent'
    };
    return (
      <Text ref={component => this.innerText = component}
            style={[this.props.style, styleOverrides]}>
        {this.props.children}
      </Text>
    )
  }

  findFit() {
    return this.getComputedHeightPromise().then(height => {
      if (height <= this.props.targetHeight &&
          height > this.state.bestSeenHeight) {
        this.setState({
          bestSeenHeight: height,
          bestSeenFontSize: this.state.fontSize
        });
      }

      // Test for the base case.
      if (this.state.step < this.props.epsilon) {
        this.setState({
          fontSize: this.state.bestSeenFontSize,
          isFitted: true
        });
        return;
      }

      // Binary search for the best fontSize.
      const direction = height < this.props.targetHeight ? 1 : -1;
      const newFontSize = this.state.fontSize + this.state.step * direction;
      this.setState({
        fontSize: newFontSize,
        step: this.state.step / 2
      });
      return this.findFit();
    }).catch(e => {
      if (!e.isCanceled) {
        console.error(e);  // Unexpected error.
      }
    });
  }

  findUpperBound() {
    return this.getComputedHeightPromise().then(height => {
      if (height > this.props.targetHeight) {
        this.setState({step: this.state.fontSize / 2});
        return;
      }

      // Double the fontSize until the targetHeight is exceeded.
      this.setState({fontSize: this.state.fontSize * 2});
      return this.findUpperBound();
    })
  }

  getComputedHeightPromise() {
    return this.createPromise(resolve => {
      requestAnimationFrame(() => resolve());
    }).then(() => {
      return this.createPromise(resolve => {
        UIManager.measureLayoutRelativeToParent(
          findNodeHandle(this.innerText),
          (e) => console.error(e),
          (x, y, w, h) => {
            resolve(h);
          },
        );
      });
    });
  }

  createPromise(fn) {
    const cancelable = makeCancelable(
      new Promise(r => fn(r))
    );
    cancelable.promise
      .then(() => this.removePromise(cancelable))
      .catch(e => {
        if (!e.isCanceled) {
          console.error(e);  // Unexpected error.
        }
      });
    this.addPromise(cancelable);
    return cancelable.promise;
  }

  removePromise(promise) {
    const promises = this.state.promises;
    const index = promises.indexOf(promise);
    this.setState({
      promises: [
        ...promises.slice(0, index),
        ...promises.slice(index + 1)
      ]
    })
  }

  addPromise(promise) {
    this.setState({
      promises: [...this.state.promises, promise]
    })
  }
}


FittedText.propTypes = {
  targetHeight: React.PropTypes.number.isRequired,
  epsilon: React.PropTypes.number,
  initialFontSize: React.PropTypes.number
};


FittedText.defaultProps = {
  epsilon: .1,
  initialFontSize: 100
};