import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  PanResponder,
  View,
  Platform,
  I18nManager,
  ImageBackground,
} from 'react-native';

import { DefaultMarker } from './DefaultMarker';
import { DefaultLabel } from './DefaultLabel';
import { createArray, valueToPosition, positionToValue } from './converters';

function MultiSlider({
  values = [0],
  onValuesChangeStart = () => {},
  onValuesChange = () => {},
  onValuesChangeFinish = () => {},
  onMarkersPosition = () => {},
  step = 1,
  min = 0,
  max = 10,
  touchDimensions = {
    height: 50,
    width: 50,
    borderRadius: 15,
    slipDisplacement: 200,
  },
  customMarker = DefaultMarker,
  customMarkerLeft = DefaultMarker,
  customMarkerRight = DefaultMarker,
  customLabel = DefaultLabel,
  markerOffsetX = 0,
  markerOffsetY = 0,
  sliderLength = 280,
  onToggleOne = () => {},
  onToggleTwo = () => {},
  enabledOne = true,
  enabledTwo = true,
  allowOverlap = false,
  snapped = false,
  vertical = false,
  minMarkerOverlapDistance = 0,
}) {
  let [onePressed, setOnePressed] = useState(false);
  let [twoPressed, setTwoPressed] = useState(false);
  let [valueOne, setValueOne] = useState(values[0]);
  let [valueTwo, setValueTwo] = useState(values[1]);
  let [pastOne, setPastOne] = useState(initialValues[0]);
  let [pastTwo, setPastTwo] = useState(initialValues[1]);
  let [positionOne, setPositionOne] = useState(initialValues[0]);
  let [positionTwo, setPositionTwo] = useState(initialValues[1]);

  let optionsArray = optionsArray || createArray(min, max, step);
  let stepLength = sliderLength / optionsArray.length;
  let initialValues = values.map(value =>
    valueToPosition(value, optionsArray, sliderLength),
  );
  let customPanResponder = (start, move, end) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => start(),
      onPanResponderMove: (undefined, gestureState) => move(gestureState),
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (undefined, gestureState) => end(gestureState),
      onPanResponderTerminate: (undefined, gestureState) => end(gestureState),
      onShouldBlockNativeResponder: () => true,
    });

  let startOne = () => {
    if (enabledOne) {
      onValuesChangeStart();
      setOnePressed(!onePressed);
    }
  };

  let startTwo = () => {
    if (enabledTwo) {
      onValuesChangeStart();
      setTwoPressed(!twoPressed);
    }
  };

  let moveOne = gestureState => {
    if (enabledOne) {
      return;
    }

    let accumulatedDistance = vertical ? -gestureState.dy : gestureState.dx;
    let accumulatedDistanceDisplacement = vertical
      ? gestureState.dx
      : gestureState.dy;
    let unconfined = I18nManager.isRTL
      ? pastOne - accumulatedDistance
      : accumulatedDistance + pastOne;
    let bottom = 0;
    let trueTop =
      positionTwo -
      (allowOverlap
        ? 0
        : minMarkerOverlapDistance > 0
        ? minMarkerOverlapDistance
        : stepLength);
    let top = trueTop === 0 ? 0 : trueTop || sliderLength;
    let confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    let slipDisplacement = touchDimensions.slipDisplacement;

    if (
      Math.abs(accumulatedDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      let value = positionToValue(confined, optionsArray, sliderLength);
      let snapped = valueToPosition(value, optionsArray, sliderLength);

      setPositionOne(snapped ? snapped : confined);

      if (value !== valueOne) {
        this.setState(
          {
            valueOne: value,
          },
          () => {
            let change = [valueOne];
            if (valueTwo) {
              change.push(valueTwo);
            }
            onValuesChange(change);

            onMarkersPosition([positionOne, positionTwo]);
          },
        );
      }
    }
  };

  let moveTwo = gestureState => {
    if (!enabledTwo) {
      return;
    }

    const accumulatedDistance = vertical ? -gestureState.dy : gestureState.dx;
    const accumulatedDistanceDisplacement = vertical
      ? gestureState.dx
      : gestureState.dy;

    const unconfined = I18nManager.isRTL
      ? pastTwo - accumulatedDistance
      : accumulatedDistance + pastTwo;
    let bottom =
      positionOne +
      (allowOverlap
        ? 0
        : minMarkerOverlapDistance > 0
        ? minMarkerOverlapDistance
        : stepLength);
    let top = sliderLength;
    let confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    let slipDisplacement = touchDimensions.slipDisplacement;

    if (
      Math.abs(accumulatedDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      let value = positionToValue(confined, optionsArray, sliderLength);
      let snapped = valueToPosition(value, optionsArray, sliderLength);

      setPositionTwo(snapped ? snapped : confined);

      if (value !== valueTwo) {
        this.setState(
          {
            valueTwo: value,
          },
          () => {
            onValuesChange([valueOne, valueTwo]);

            onMarkersPosition([positionOne, positionTwo]);
          },
        );
      }
    }
  };

  let endOne = gestureState => {
    if (gestureState.moveX === 0 && onToggleOne) {
      onToggleOne();
      return;
    }

    this.setState(
      {
        pastOne: positionOne,
        onePressed: !onePressed,
      },
      () => {
        var change = [valueOne];
        if (valueTwo) {
          change.push(valueTwo);
        }
        onValuesChangeFinish(change);
      },
    );
  };

  let endTwo = gestureState => {
    if (gestureState.moveX === 0 && onToggleTwo) {
      onToggleTwo();
      return;
    }

    this.setState(
      {
        twoPressed: !twoPressed,
        pastTwo: positionTwo,
      },
      () => {
        onValuesChangeFinish([valueOne, valueTwo]);
      },
    );
  };

  let _panResponderBetween = customPanResponder(
    gestureState => {
      startOne(gestureState);
      startTwo(gestureState);
    },
    gestureState => {
      moveOne(gestureState);
      moveTwo(gestureState);
    },
    gestureState => {
      endOne(gestureState);
      endTwo(gestureState);
    },
  );

  let _panResponderOne = customPanResponder(startOne, moveOne, endOne);

  let _panResponderTwo = customPanResponder(startTwo, moveTwo, endTwo);

  useEffect(() => {
    if (
      typeof positionOne === 'undefined' &&
      typeof positionTwo !== 'undefined'
    ) {
      return;
    }

    onMarkersPosition([positionOne, positionTwo]);

    if (onePressed || twoPressed) {
      return;
    }

    optionsArray = optionsArray || createArray(min, max, step);
    stepLength = sliderLength / optionsArray.length;

    let newPositionOne = valueToPosition(values[0], optionsArray, sliderLength);

    setValueOne(values[0]);
    setPastOne(newPositionOne);
    setPositionOne(newPositionOne);

    let newPositionTwo = valueToPosition(values[1], optionsArray, sliderLength);

    setValueTwo(values[1]);
    setPastTwo(newPositionTwo);
    setPositionTwo(newPositionTwo);
  }, [min, max, step, values, sliderLength, positionOne, positionTwo]);

  let twoMarkers = values.length == 2; // when allowOverlap, positionTwo could be 0, identified as string '0' and throwing 'RawText 0 needs to be wrapped in <Text>' error
  let trackOneLength = positionOne;
  let trackOneStyle = twoMarkers
    ? this.props.unselectedStyle
    : this.props.selectedStyle || styles.selectedTrack;
  let trackThreeLength = twoMarkers ? sliderLength - positionTwo : 0;
  let trackThreeStyle = this.props.unselectedStyle;
  let trackTwoLength = sliderLength - trackOneLength - trackThreeLength;
  let trackTwoStyle = twoMarkers
    ? this.props.selectedStyle || styles.selectedTrack
    : this.props.unselectedStyle;

  let Marker = customMarker;
  let MarkerLeft = customMarkerLeft;
  let MarkerRight = customMarkerRight;
  let isMarkersSeparated = this.props.isMarkersSeparated || false;
  let Label = customLabel;

  let { borderRadius } = touchDimensions;
  let touchStyle = {
    borderRadius: borderRadius || 0,
  };
  let markerContainerOne = {
    top: markerOffsetY - 24,
    left: trackOneLength + markerOffsetX - 24,
  };

  let markerContainerTwo = {
    top: markerOffsetY - 24,
    right: trackThreeLength - markerOffsetX - 24,
  };

  let containerStyle = [styles.container, this.props.containerStyle];

  if (vertical) {
    containerStyle.push({
      transform: [{ rotate: '-90deg' }],
    });
  }

  let body = (
    <React.Fragment>
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
          {...(twoMarkers ? _panResponderBetween.panHandlers : {})}
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
          style={[
            styles.markerContainer,
            markerContainerOne,
            this.props.markerContainerStyle,
            positionOne > sliderLength / 2 && styles.topMarkerContainer,
          ]}
        >
          <View
            style={[styles.touch, touchStyle]}
            {..._panResponderOne.panHandlers}
          >
            {isMarkersSeparated === false ? (
              <Marker
                enabled={enabledOne}
                pressed={onePressed}
                markerStyle={this.props.markerStyle}
                pressedMarkerStyle={this.props.pressedMarkerStyle}
                disabledMarkerStyle={this.props.disabledMarkerStyle}
                currentValue={valueOne}
                valuePrefix={this.props.valuePrefix}
                valueSuffix={this.props.valueSuffix}
              />
            ) : (
              <MarkerLeft
                enabled={enabledOne}
                pressed={onePressed}
                markerStyle={this.props.markerStyle}
                pressedMarkerStyle={this.props.pressedMarkerStyle}
                disabledMarkerStyle={this.props.disabledMarkerStyle}
                currentValue={valueOne}
                valuePrefix={this.props.valuePrefix}
                valueSuffix={this.props.valueSuffix}
              />
            )}
          </View>
        </View>

        {twoMarkers && positionOne !== sliderLength && (
          <View
            style={[
              styles.markerContainer,
              markerContainerTwo,
              this.props.markerContainerStyle,
            ]}
          >
            <View
              style={[styles.touch, touchStyle]}
              {..._panResponderTwo.panHandlers}
            >
              {isMarkersSeparated === false ? (
                <Marker
                  pressed={twoPressed}
                  markerStyle={this.props.markerStyle}
                  pressedMarkerStyle={this.props.pressedMarkerStyle}
                  disabledMarkerStyle={this.props.disabledMarkerStyle}
                  currentValue={valueTwo}
                  enabled={enabledTwo}
                  valuePrefix={this.props.valuePrefix}
                  valueSuffix={this.props.valueSuffix}
                />
              ) : (
                <MarkerRight
                  pressed={twoPressed}
                  markerStyle={this.props.markerStyle}
                  pressedMarkerStyle={this.props.pressedMarkerStyle}
                  disabledMarkerStyle={this.props.disabledMarkerStyle}
                  currentValue={valueTwo}
                  enabled={enabledTwo}
                  valuePrefix={this.props.valuePrefix}
                  valueSuffix={this.props.valueSuffix}
                />
              )}
            </View>
          </View>
        )}
      </View>
    </React.Fragment>
  );

  return (
    <View>
      {this.props.enableLabel && (
        <Label
          leftDiff={leftDiff}
          oneMarkerValue={valueOne}
          twoMarkerValue={valueTwo}
          oneMarkerLeftPosition={positionOne}
          twoMarkerLeftPosition={positionTwo}
          oneMarkerPressed={onePressed}
          twoMarkerPressed={twoPressed}
        />
      )}
      {this.props.imageBackgroundSource && (
        <ImageBackground
          source={this.props.imageBackgroundSource}
          style={[{ width: '100%', height: '100%' }, containerStyle]}
        >
          {body}
        </ImageBackground>
      )}
      {!this.props.imageBackgroundSource && (
        <View style={containerStyle}>{body}</View>
      )}
    </View>
  );
}

MultiSlider.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number),
  onValuesChangeStart: PropTypes.func,
  onValuesChange: PropTypes.func,
  onValuesChangeFinish: PropTypes.func,
  onMarkersPosition: PropTypes.func,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  touchDimensions: PropTypes.objectOf(PropTypes.number),
  customMarker: PropTypes.elementType,
  customMarkerLeft: PropTypes.elementType,
  customMarkerRight: PropTypes.elementType,
  customLabel: PropTypes.elementType,
  markerOffsetX: PropTypes.number,
  markerOffsetY: PropTypes.number,
  sliderLength: PropTypes.number,
  onToggleOne: PropTypes.func,
  onToggleTwo: PropTypes.func,
  enabledOne: PropTypes.bool,
  enabledTwo: PropTypes.bool,
  allowOverlap: PropTypes.bool,
  snapped: PropTypes.bool,
  vertical: PropTypes.bool,
  minMarkerOverlapDistance: PropTypes.number,
};

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
      web: {
        height: 2,
        borderRadius: 2,
        backgroundColor: '#A7A7A7',
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
      web: {
        backgroundColor: '#095FFF',
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
