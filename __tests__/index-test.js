import 'react-native';
import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import {
  NativeModules
} from 'react-native';

import FittedText from '../index';

let savedRaf, savedMeasure;

const mockLayoutHelpers = (computeHeight) => {
  global.requestAnimationFrame = fn => fn();
  NativeModules.UIManager.measureLayoutRelativeToParent =
      (node, onError, onSuccess) => {
        onSuccess(0, 0, 0, computeHeight());
      };
};

describe('<FittedText />', () => {
  it('renders correctly with just targetHeight', () => {
    const tree = renderer.create(
      <FittedText targetHeight={100}>foo</FittedText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with initialFontSize', () => {
    const tree = renderer.create(
      <FittedText targetHeight={100} initialFontSize={50}>foo</FittedText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
    NativeModules.UIManager.measureLayoutRelativeToParent = jest.fn();
  });

  it('finds a fitting fontSize, starting from a high initialFontSize', () => {
    const wrapper = shallow(
      <FittedText targetHeight={100}>foo</FittedText>);
    const instance = wrapper.instance();

    mockLayoutHelpers(() => instance.state.fontSize * 3);

    expect(instance.state.fontSize).toBe(100);
    return instance.componentDidMount().then(() => {
      expect(instance.state.fontSize).toBe(25);
    })
  });

  it('finds a fitting fontSize, starting from a low initialFontSize', () => {
    const instance = shallow(
      <FittedText targetHeight={100} initialFontSize={5}>
        foo
      </FittedText>).instance();

    mockLayoutHelpers(() => instance.state.fontSize * 3);

    expect(instance.state.fontSize).toBe(5);
    return instance.componentDidMount().then(() => {
      expect(instance.state.fontSize).toBe(28.125);
    })
  });

  beforeEach(() => {
    savedRaf = requestAnimationFrame;
    savedMeasure = NativeModules.UIManager.measureLayoutRelativeToParent;
  });

  afterEach(() => {
    requestAnimationFrame = savedRaf;
    NativeModules.UIManager.measureLayoutRelativeToParent = savedMeasure;
  });
});