// @flow

import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  PanResponder,
  View,
  TouchableHighlight,
  Platform,
  I18nManager,
  Text,
} from 'react-native';

import DefaultMarker from './DefaultMarker';
import { createArray, valueToPosition, positionToValue } from './converters';

const ViewPropTypes = require('react-native').ViewPropTypes || View.propTypes;

export default class MultiSlider extends React.Component {
  static propTypes = {
    values: PropTypes.arrayOf(PropTypes.number),

    onValuesChangeStart: PropTypes.func,
    onValuesChange: PropTypes.func,
    onValuesChangeFinish: PropTypes.func,

    sliderLength: PropTypes.number,
    touchDimensions: PropTypes.object,

    customMarker: PropTypes.func,

    customMarkerLeft: PropTypes.func,
    customMarkerRight: PropTypes.func,
    isMarkersSeparated: PropTypes.bool,

    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,

    optionsArray: PropTypes.array,

    containerStyle: ViewPropTypes.style,
    trackStyle: ViewPropTypes.style,
    selectedStyle: ViewPropTypes.style,
    unselectedStyle: ViewPropTypes.style,
    markerContainerStyle: ViewPropTypes.style,
    markerStyle: ViewPropTypes.style,
    pressedMarkerStyle: ViewPropTypes.style,
    valuePrefix: PropTypes.string,
    valueSuffix: PropTypes.string,
    enabledOne: PropTypes.bool,
    enabledTwo: PropTypes.bool,
    onToggleOne: PropTypes.func,
    onToggleTwo: PropTypes.func,
    allowOverlap: PropTypes.bool,
    snapped: PropTypes.bool,
    markerOffsetX: PropTypes.number,
    markerOffsetY: PropTypes.number,
  };

  static defaultProps = {
    values: [0],
    onValuesChangeStart: () => {},
    onValuesChange: values => {},
    onValuesChangeFinish: values => {},
    step: 1,
    min: 0,
    max: 10,
    touchDimensions: {
      height: 50,
      width: 50,
      borderRadius: 15,
      slipDisplacement: 200,
    },
    customMarker: DefaultMarker,

    customMarkerLeft: DefaultMarker,
    customMarkerRight: DefaultMarker,

    markerOffsetX: 0,
    markerOffsetY: 0,
    sliderLength: 280,
    onToggleOne: undefined,
    onToggleTwo: undefined,
    enabledOne: true,
    enabledTwo: true,
    allowOverlap: false,
    snapped: false,
  };

  constructor(props) {
    super(props);

    this.optionsArray =
      this.props.optionsArray ||
      createArray(this.props.min, this.props.max, this.props.step);
    this.stepLength = this.props.sliderLength / this.optionsArray.length;

    const initialValues = this.props.values.map(value =>
      valueToPosition(value, this.optionsArray, this.props.sliderLength)
    );

    this.state = {
      pressedOne: true,
      valueOne: this.props.values[0],
      valueTwo: this.props.values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1],
      labelEndWidth: 0,
      labelStartWidth: 0,
    };
  }

  componentWillMount() {
    const customPanResponder = (start, move, end) =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => start(),
        onPanResponderMove: (evt, gestureState) => move(gestureState),
        onPanResponderTerminationRequest: (evt, gestureState) => false,
        onPanResponderRelease: (evt, gestureState) => end(gestureState),
        onPanResponderTerminate: (evt, gestureState) => end(gestureState),
        onShouldBlockNativeResponder: (evt, gestureState) => true,
      });

    this._panResponderOne = customPanResponder(
      this.startOne,
      this.moveOne,
      this.endOne
    );
    this._panResponderTwo = customPanResponder(
      this.startTwo,
      this.moveTwo,
      this.endTwo
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.onePressed || this.state.twoPressed) {
      return;
    }

    const nextState = {};
    if (
      nextProps.min !== this.props.min ||
      nextProps.max !== this.props.max ||
      nextProps.values[0] !== this.state.valueOne ||
      nextProps.sliderLength !== this.props.sliderLength ||
      nextProps.values[1] !== this.state.valueTwo ||
      (nextProps.sliderLength !== this.props.sliderLength &&
        nextProps.values[1])
    ) {
      this.optionsArray =
        this.props.optionsArray ||
        createArray(nextProps.min, nextProps.max, nextProps.step);

      this.stepLength = this.props.sliderLength / this.optionsArray.length;

      const positionOne = valueToPosition(
        nextProps.values[0],
        this.optionsArray,
        nextProps.sliderLength
      );
      nextState.valueOne = nextProps.values[0];
      nextState.pastOne = positionOne;
      nextState.positionOne = positionOne;

      const positionTwo = valueToPosition(
        nextProps.values[1],
        this.optionsArray,
        nextProps.sliderLength
      );
      nextState.valueTwo = nextProps.values[1];
      nextState.pastTwo = positionTwo;
      nextState.positionTwo = positionTwo;
    }

    if (nextState != {}) {
      this.setState(nextState);
    }
  }

  startOne = () => {
    if (this.props.enabledOne) {
      this.props.onValuesChangeStart();
      this.setState({
        onePressed: !this.state.onePressed,
      });
    }
  };

  startTwo = () => {
    if (this.props.enabledTwo) {
      this.props.onValuesChangeStart();
      this.setState({
        twoPressed: !this.state.twoPressed,
      });
    }
  };

  moveOne = gestureState => {
    if (!this.props.enabledOne) {
      return;
    }
    const unconfined = I18nManager.isRTL
      ? this.state.pastOne - gestureState.dx
      : gestureState.dx + this.state.pastOne;
    const bottom = 0;
    const trueTop =
      this.state.positionTwo - (this.props.allowOverlap ? 0 : this.stepLength);
    const top = trueTop === 0 ? 0 : trueTop || this.props.sliderLength;
    const confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (Math.abs(gestureState.dy) < slipDisplacement || !slipDisplacement) {
      const value = positionToValue(
        confined,
        this.optionsArray,
        this.props.sliderLength
      );
      const snapped = valueToPosition(
        value,
        this.optionsArray,
        this.props.sliderLength
      );
      this.setState({
        positionOne: this.props.snapped ? snapped : confined,
      });

      if (value !== this.state.valueOne) {
        this.setState(
          {
            valueOne: value,
          },
          () => {
            const change = [this.state.valueOne];
            if (this.state.valueTwo) {
              change.push(this.state.valueTwo);
            }
            this.props.onValuesChange(change);
          }
        );
      }
    }
  };

  moveTwo = gestureState => {
    if (!this.props.enabledTwo) {
      return;
    }
    const unconfined = I18nManager.isRTL
      ? this.state.pastTwo - gestureState.dx
      : gestureState.dx + this.state.pastTwo;
    const bottom =
      this.state.positionOne + (this.props.allowOverlap ? 0 : this.stepLength);
    const top = this.props.sliderLength;
    const confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (Math.abs(gestureState.dy) < slipDisplacement || !slipDisplacement) {
      const value = positionToValue(
        confined,
        this.optionsArray,
        this.props.sliderLength
      );
      const snapped = valueToPosition(
        value,
        this.optionsArray,
        this.props.sliderLength
      );

      this.setState({
        positionTwo: this.props.snapped ? snapped : confined,
      });

      if (value !== this.state.valueTwo) {
        this.setState(
          {
            valueTwo: value,
          },
          () => {
            this.props.onValuesChange([
              this.state.valueOne,
              this.state.valueTwo,
            ]);
          }
        );
      }
    }
  };

  endOne = gestureState => {
    if (gestureState.moveX === 0 && this.props.onToggleOne) {
      this.props.onToggleOne();
      return;
    }

    this.setState(
      {
        pastOne: this.state.positionOne,
        onePressed: !this.state.onePressed,
      },
      () => {
        const change = [this.state.valueOne];
        if (this.state.valueTwo) {
          change.push(this.state.valueTwo);
        }
        this.props.onValuesChangeFinish(change);
      }
    );
  };

  endTwo = gestureState => {
    if (gestureState.moveX === 0 && this.props.onToggleTwo) {
      this.props.onToggleTwo();
      return;
    }

    this.setState(
      {
        twoPressed: !this.state.twoPressed,
        pastTwo: this.state.positionTwo,
      },
      () => {
        this.props.onValuesChangeFinish([
          this.state.valueOne,
          this.state.valueTwo,
        ]);
      }
    );
  };

  getTranslateOne = () => {
    const {
      positionOne,
      positionTwo,
      labelEndWidth,
      labelStartWidth,
    } = this.state;

    const twoEndCondition =
      positionTwo + labelEndWidth / 2 > this.props.sliderLength;

    if (positionOne - labelStartWidth / 2 < 0) {
      return 0;
    }

    const defaultPosition = positionOne - labelStartWidth / 2;

    const markersGap = positionTwo - positionOne;
    const diff = twoEndCondition
      ? markersGap - (labelEndWidth + labelStartWidth / 2) - 10
      : markersGap - (labelEndWidth / 2 + labelStartWidth / 2) - 10;

    if (twoEndCondition && diff < 0) {
      // collision with marker one stick to left
      return defaultPosition + diff;
    }

    if (diff < 0) {
      // collision
      return defaultPosition + diff / 2;
    }

    return defaultPosition;
  };

  getTranslateTwo = () => {
    const {
      positionOne,
      positionTwo,
      labelEndWidth,
      labelStartWidth,
    } = this.state;

    const oneEndCondition = positionOne - labelStartWidth / 2 < 0;

    if (positionTwo + labelEndWidth / 2 > this.props.sliderLength) {
      return (
        positionTwo -
        labelEndWidth / 2 -
        (positionTwo + labelEndWidth / 2 - this.props.sliderLength)
      );
    }

    const defaultPosition = positionTwo - labelEndWidth / 2;

    const markersGap = positionTwo - positionOne;
    const diff = oneEndCondition
      ? markersGap - (labelEndWidth + labelStartWidth / 2) - 20
      : markersGap - (labelEndWidth / 2 + labelStartWidth / 2) - 20;

    if (oneEndCondition && diff < 0) {
      // collision with marker one stick to left
      return defaultPosition - diff;
    }

    if (diff < 0) {
      // collision
      return defaultPosition - diff / 2;
    }

    return defaultPosition;
  };

  saveLabelEndWidth = (e: OnLayout) => {
    this.setState({ labelEndWidth: Math.floor(e.nativeEvent.layout.width) });
  };

  saveLabelStartWidth = (e: OnLayout) => {
    this.setState({ labelStartWidth: Math.floor(e.nativeEvent.layout.width) });
  };

  render() {
    const { positionOne, positionTwo } = this.state;
    const {
      selectedStyle,
      unselectedStyle,
      sliderLength,
      markerOffsetX,
      markerOffsetY,
    } = this.props;
    const twoMarkers = this.props.values.length == 2; // when allowOverlap, positionTwo could be 0, identified as string '0' and throwing 'RawText 0 needs to be wrapped in <Text>' error

    const trackOneLength = positionOne;
    const trackOneStyle = twoMarkers
      ? unselectedStyle
      : selectedStyle || styles.selectedTrack;
    const trackThreeLength = twoMarkers ? sliderLength - positionTwo : 0;
    const trackThreeStyle = unselectedStyle;
    const trackTwoLength = sliderLength - trackOneLength - trackThreeLength;
    const trackTwoStyle = twoMarkers
      ? selectedStyle || styles.selectedTrack
      : unselectedStyle;
    const Marker = this.props.customMarker;

    const MarkerLeft = this.props.customMarkerLeft;
    const MarkerRight = this.props.customMarkerRight;
    const isMarkersSeparated = this.props.isMarkersSeparated || false;

    const {
      slipDisplacement,
      height,
      width,
      borderRadius,
    } = this.props.touchDimensions;
    const touchStyle = {
      borderRadius: borderRadius || 0,
    };

    const markerContainerOne = {
      top: markerOffsetY - 24,
      left: trackOneLength + markerOffsetX - 24,
    };

    const markerContainerTwo = {
      top: markerOffsetY - 24,
      right: trackThreeLength + markerOffsetX - 24,
    };

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.fullTrack, { width: sliderLength }]}>
          <View
            style={[
              styles.track,
              this.props.trackStyle,
              trackOneStyle,
              { width: trackOneLength },
            ]}
          />
          <View
            style={[
              styles.track,
              this.props.trackStyle,
              trackTwoStyle,
              { width: trackTwoLength },
            ]}
          />
          {twoMarkers && (
            <View
              style={[
                styles.track,
                this.props.trackStyle,
                trackThreeStyle,
                { width: trackThreeLength },
              ]}
            />
          )}
          <View
            style={{
              position: 'absolute',
              bottom: 18,
              transform: [
                {
                  translateX: this.getTranslateOne(),
                },
              ],
            }}
            onLayout={this.saveLabelStartWidth}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                color: '#0176D2',
              }}
            >
              {this.state.startLabel || this.state.valueOne}
            </Text>
          </View>
          {this.state.valueTwo !== undefined && (
            <View
              style={{
                bottom: 18,
                position: 'absolute',
                transform: [
                  {
                    translateX: this.getTranslateTwo(),
                  },
                ],
              }}
              onLayout={this.saveLabelEndWidth}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: '#0176D2',
                }}
              >
                {this.props.endLabel || this.state.valueTwo}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.markerContainer,
              markerContainerOne,
              this.props.markerContainerStyle,
              positionOne > sliderLength / 2 && styles.topMarkerContainer,
            ]}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={[styles.touch, touchStyle]}
                ref={component => (this._markerOne = component)}
                {...this._panResponderOne.panHandlers}
              >
                {isMarkersSeparated === false ? (
                  <Marker
                    enabled={this.props.enabledOne}
                    pressed={this.state.onePressed}
                    markerStyle={[styles.marker, this.props.markerStyle]}
                    pressedMarkerStyle={this.props.pressedMarkerStyle}
                    currentValue={this.state.valueOne}
                    valuePrefix={this.props.valuePrefix}
                    valueSuffix={this.props.valueSuffix}
                  />
                ) : (
                  <MarkerLeft
                    enabled={this.props.enabledOne}
                    pressed={this.state.onePressed}
                    markerStyle={[styles.marker, this.props.markerStyle]}
                    pressedMarkerStyle={this.props.pressedMarkerStyle}
                    currentValue={this.state.valueOne}
                    valuePrefix={this.props.valuePrefix}
                    valueSuffix={this.props.valueSuffix}
                  />
                )}
              </View>
            </View>
          </View>
          {twoMarkers && positionOne !== this.props.sliderLength && (
            <View>
              <View
                style={[
                  styles.markerContainer,
                  markerContainerTwo,
                  this.props.markerContainerStyle,
                ]}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={[styles.touch, touchStyle]}
                    ref={component => (this._markerTwo = component)}
                    {...this._panResponderTwo.panHandlers}
                  >
                    {isMarkersSeparated === false ? (
                      <Marker
                        pressed={this.state.twoPressed}
                        markerStyle={this.props.markerStyle}
                        pressedMarkerStyle={this.props.pressedMarkerStyle}
                        currentValue={this.state.valueTwo}
                        enabled={this.props.enabledTwo}
                        valuePrefix={this.props.valuePrefix}
                        valueSuffix={this.props.valueSuffix}
                      />
                    ) : (
                      <MarkerRight
                        pressed={this.state.twoPressed}
                        markerStyle={this.props.markerStyle}
                        pressedMarkerStyle={this.props.pressedMarkerStyle}
                        currentValue={this.state.valueTwo}
                        enabled={this.props.enabledTwo}
                        valuePrefix={this.props.valuePrefix}
                        valueSuffix={this.props.valueSuffix}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
  },
  fullTrack: {
    flexDirection: 'row',
  },
  track: {
    ...Platform.select({
      ios: {
        height: 2,
        borderRadius: 2,
        backgroundColor: '#A7A7A7',
      },
      android: {
        height: 2,
        backgroundColor: '#CECECE',
      },
    }),
  },
  selectedTrack: {
    ...Platform.select({
      ios: {
        backgroundColor: '#095FFF',
      },
      android: {
        backgroundColor: '#0D8675',
      },
    }),
  },
  markerContainer: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMarkerContainer: {
    zIndex: 1,
  },
  touch: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});
