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
      interval: 0
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
    return (
      <Text ref={component => this._text = component}
            style={{
              backgroundColor: 'transparent',
              fontSize: this.state.fontSize,
              color: this.state.isFitted ? 'black' : 'transparent'
            }}>
        {this.props.children}
      </Text>
    )
  }

  findFit() {
    return this.getComputedHeightPromise().then(height => {
      // Binary search to find a fitting fontSize.
      let newFontSize;
      if (height < this.props.targetHeight * this.props.minFillRatio) {
        newFontSize = this.state.fontSize + this.state.interval;
      } else if (height > this.props.targetHeight) {
        newFontSize = this.state.fontSize - this.state.interval;
      }

      // TODO: check epsilon to avoid infinite recursion. 
      if (!newFontSize) {
        this.setState({isFitted: true});
        return;
      }

      this.setState({
        fontSize: newFontSize,
        interval: this.state.interval / 2
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
      // Double until the targetHeight is exceeded.
      if (height < this.props.targetHeight) {
        this.setState({fontSize: height * 2});
        return this.findUpperBound();
      }

      // Then initialize the adjustment interval.
      this.setState({interval: this.state.fontSize / 2});
    })
  }

  getComputedHeightPromise() {
    return this.createPromise(resolve => {
      requestAnimationFrame(() => resolve());
    }).then(() => {
      return this.createPromise(resolve => {
        UIManager.measureLayoutRelativeToParent(
          findNodeHandle(this._text),
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
  minFillRatio: React.PropTypes.number,
  initialFontSize: React.PropTypes.number
};


FittedText.defaultProps = {
  minFillRatio: .75,
  initialFontSize: 100
};