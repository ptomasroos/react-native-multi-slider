import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  StyleSheet,
  PanResponder,
  View,
  Platform,
  I18nManager,
  ImageBackground
} from "react-native";

import { DefaultMarker } from "./DefaultMarker";
import { DefaultLabel } from "./DefaultLabel";
import { createArray, valueToPosition, positionToValue } from "./converters";

function MultiSlider({
  values = [0],
  onValuesChangeStart = () => {},
  onValuesChange = () => {},
  onValuesChangeFinish = () => {},
  sliderLength = 280,
  touchDimensions = {
    height: 50,
    width: 50,
    borderRadius: 15,
    slipDisplacement: 200
  },
  enableLabel,
  customLabel = DefaultLabel,
  customMarker = DefaultMarker,
  customMarkerLeft = DefaultMarker,
  customMarkerRight = DefaultMarker,
  areMarkersSeparated = false,
  min = 0,
  max = 10,
  step = 1,
  optionsArray = undefined,
  containerStyle = {},
  markerContainerStyle = {},
  markerStyle = {},
  pressedMarkerStyle = {},
  selectedStyle = {},
  trackStyle = {},
  unselectedStyle = {},
  valuePrefix = "",
  valueSuffix = "",
  enabledOne = true,
  enabledTwo = true,
  onToggleOne = undefined,
  onToggleTwo = undefined,
  allowOverlap = false,
  snapped = false,
  markerOffsetX = 0,
  markerOffsetY = 0,
  minMarkerOverlapDistance = 0,
  imageBackgroundSource = undefined,
  onMarkersPosition = () => {},
  disabledMarkerStyle = {},
  vertical = false
}) {
  let optionsArray;
  let stepLength;
  let initialValues;

  let _panResponderBetween;
  let _panResponderOne;
  let _panResponderTwo;  

  const [onePressed, setOnePressed] = useState(false);
  const [twoPressed, setTwoPressed] = useState(false);
  const [valueOne, setValueOne] = useState([]);
  const [valueTwo, setValueTwo] = useState([]);
  const [pastOne, setPastOne] = useState([]);
  const [pastTwo, setPastTwo] = useState([]);
  const [positionOne, setPositionOne] = useState([]);
  const [positionTwo, setPositionTwo] = useState([]);

  const startOne = () => {
    if (enabledOne) {
      onValuesChangeStart();
      setOnePressed(!onePressed);
    }
  };

  const startTwo = () => {
    if (enabledTwo) {
      onValuesChangeStart();
      setTwoPressed(!twoPressed);
    }
  };

  const moveOne = gestureState => {
    if (enabledOne) {
      return;
    }

    const accumulatedDistance = vertical ? -gestureState.dy : gestureState.dx;
    const accumulatedDistanceDisplacement = vertical
      ? gestureState.dx
      : gestureState.dy;
    const unconfined = I18nManager.isRTL
      ? pastOne - accumulatedDistance
      : accumulatedDistance + pastOne;
    const bottom = 0;
    const trueTop =
      positionTwo -
      (allowOverlap
        ? 0
        : minMarkerOverlapDistance > 0
        ? minMarkerOverlapDistance
        : stepLength);
    const top = trueTop === 0 ? 0 : trueTop || sliderLength;
    const confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const slipDisplacement = touchDimensions.slipDisplacement;

    if (
      Math.abs(accumulatedDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      const value = positionToValue(confined, optionsArray, sliderLength);
      const snappedOne = valueToPosition(value, optionsArray, sliderLength);

      setPositionOne(snapped ? snappedOne : confined);

      if (value !== valueOne) {
        this.setState(
          {
            valueOne: value
          },
          () => {
            const change = [valueOne];
            if (valueTwo) {
              change.push(valueTwo);
            }
            onValuesChange(change);

            onMarkersPosition([positionOne, positionTwo]);
          }
        );
      }
    }
  };

  const moveTwo = gestureState => {
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
    const bottom =
      positionOne +
      (allowOverlap
        ? 0
        : minMarkerOverlapDistance > 0
        ? minMarkerOverlapDistance
        : stepLength);
    const top = sliderLength;
    const confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const slipDisplacement = touchDimensions.slipDisplacement;

    if (
      Math.abs(accumulatedDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      const value = positionToValue(confined, optionsArray, sliderLength);
      const snappedTwo = valueToPosition(value, optionsArray, sliderLength);

      setPositionTwo(snapped ? snappedTwo : confined);

      if (value !== valueTwo) {
        this.setState(
          {
            valueTwo: value
          },
          () => {
            onValuesChange([valueOne, valueTwo]);

            onMarkersPosition([positionOne, positionTwo]);
          }
        );
      }
    }
  };

  const endOne = gestureState => {
    if (gestureState.moveX === 0 && onToggleOne) {
      onToggleOne();
      return;
    }

    this.setState(
      {
        pastOne: positionOne,
        onePressed: !onePressed
      },
      () => {
        const change = [valueOne];
        if (valueTwo) {
          change.push(valueTwo);
        }
        onValuesChangeFinish(change);
      }
    );
  };

  const endTwo = gestureState => {
    if (gestureState.moveX === 0 && onToggleTwo) {
      onToggleTwo();
      return;
    }

    this.setState(
      {
        twoPressed: !twoPressed,
        pastTwo: positionTwo
      },
      () => {
        onValuesChangeFinish([valueOne, valueTwo]);
      }
    );
  };

  useEffect(function subscribePanResponder() {
    const customPanResponder = (start, move, end) =>
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
        onShouldBlockNativeResponder: () => true
      });

    _panResponderBetween = customPanResponder(
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
      }
    );

    _panResponderOne = customPanResponder(startOne, moveOne, endOne);

    _panResponderTwo = customPanResponder(startTwo, moveTwo, endTwo);
  });

  useEffect(() => {
    optionsArray = optionsArray || createArray(min, max, step);
    stepLength = sliderLength / optionsArray.length;
    initialValues = values.map(value =>
      valueToPosition(value, optionsArray, sliderLength)
    );

    setValueOne(values[0]);
    setValueTwo(values[1]);
    setPastOne(initialValues[0]);
    setPastTwo(initialValues[1]);
    setPositionOne(initialValues[0]);
    setPositionTwo(initialValues[1]);

    if (
      typeof positionOne === "undefined" &&
      typeof positionTwo !== "undefined"
    ) {
      return;
    }

    onMarkersPosition([positionOne, positionTwo]);

    if (onePressed || twoPressed) {
      return;
    }

    optionsArray = optionsArray || createArray(min, max, step);
    stepLength = sliderLength / optionsArray.length;

    const newPositionOne = valueToPosition(
      values[0],
      optionsArray,
      sliderLength
    );

    setValueOne(values[0]);
    setPastOne(newPositionOne);
    setPositionOne(newPositionOne);

    const newPositionTwo = valueToPosition(
      values[1],
      optionsArray,
      sliderLength
    );

    setValueTwo(values[1]);
    setPastTwo(newPositionTwo);
    setPositionTwo(newPositionTwo);
  }, [
    min,
    max,
    optionsArray,
    positionOne,
    positionTwo,
    sliderLength,
    step,
    values
  ]);

  const twoMarkers = values.length == 2; // when allowOverlap, positionTwo could be 0, identified as string '0' and throwing 'RawText 0 needs to be wrapped in <Text>' error
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

  const Marker = customMarker;
  const MarkerLeft = customMarkerLeft;
  const MarkerRight = customMarkerRight;
  const Label = customLabel;

  const { borderRadius } = touchDimensions;
  const touchStyle = {
    borderRadius: borderRadius || 0
  };
  const markerContainerOne = {
    top: markerOffsetY - 24,
    left: trackOneLength + markerOffsetX - 24
  };

  const markerContainerTwo = {
    top: markerOffsetY - 24,
    right: trackThreeLength - markerOffsetX - 24
  };

  const allContainerStyle = [styles.container, containerStyle];

  if (vertical) {
    allContainerStyle.push({
      transform: [{ rotate: "-90deg" }]
    });
  }

  const body = (
    <React.Fragment>
      <View style={[styles.fullTrack, { width: sliderLength }]}>
        <View
          style={[
            styles.track,
            trackStyle,
            trackOneStyle,
            { width: trackOneLength }
          ]}
        />
        <View
          style={[
            styles.track,
            trackStyle,
            trackTwoStyle,
            { width: trackTwoLength }
          ]}
          {...(twoMarkers ? _panResponderBetween.panHandlers : {})}
        />
        {twoMarkers && (
          <View
            style={[
              styles.track,
              trackStyle,
              trackThreeStyle,
              { width: trackThreeLength }
            ]}
          />
        )}
        <View
          style={[
            styles.markerContainer,
            markerContainerOne,
            markerContainerStyle,
            positionOne > sliderLength / 2 && styles.topMarkerContainer
          ]}
        >
          <View
            style={[styles.touch, touchStyle]}
            {..._panResponderOne.panHandlers}
          >
            {!areMarkersSeparated ? (
              <Marker
                enabled={enabledOne}
                pressed={onePressed}
                markerStyle={markerStyle}
                pressedMarkerStyle={pressedMarkerStyle}
                disabledMarkerStyle={disabledMarkerStyle}
                currentValue={valueOne}
                valuePrefix={valuePrefix}
                valueSuffix={valueSuffix}
              />
            ) : (
              <MarkerLeft
                enabled={enabledOne}
                pressed={onePressed}
                markerStyle={markerStyle}
                pressedMarkerStyle={pressedMarkerStyle}
                disabledMarkerStyle={disabledMarkerStyle}
                currentValue={valueOne}
                valuePrefix={valuePrefix}
                valueSuffix={valueSuffix}
              />
            )}
          </View>
        </View>

        {twoMarkers && positionOne !== sliderLength && (
          <View
            style={[
              styles.markerContainer,
              markerContainerTwo,
              markerContainerStyle
            ]}
          >
            <View
              style={[styles.touch, touchStyle]}
              {..._panResponderTwo.panHandlers}
            >
              {!areMarkersSeparated ? (
                <Marker
                  pressed={twoPressed}
                  markerStyle={markerStyle}
                  pressedMarkerStyle={pressedMarkerStyle}
                  disabledMarkerStyle={disabledMarkerStyle}
                  currentValue={valueTwo}
                  enabled={enabledTwo}
                  valuePrefix={valuePrefix}
                  valueSuffix={valueSuffix}
                />
              ) : (
                <MarkerRight
                  pressed={twoPressed}
                  markerStyle={markerStyle}
                  pressedMarkerStyle={pressedMarkerStyle}
                  disabledMarkerStyle={disabledMarkerStyle}
                  currentValue={valueTwo}
                  enabled={enabledTwo}
                  valuePrefix={valuePrefix}
                  valueSuffix={valueSuffix}
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
      {enableLabel && (
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
      {imageBackgroundSource ? (
        <ImageBackground
          source={imageBackgroundSource}
          style={[{ width: "100%", height: "100%" }, allContainerStyle]}
        >
          {body}
        </ImageBackground>
      ) : (
        <View style={allContainerStyle}>{body}</View>
      )}
    </View>
  );
}

MultiSlider.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number),
  onValuesChangeStart: PropTypes.func,
  onValuesChange: PropTypes.func,
  onValuesChangeFinish: PropTypes.func,
  sliderLength: PropTypes.number,
  touchDimensions: PropTypes.objectOf(PropTypes.number),
  enableLabel: PropTypes.func,
  customLabel: PropTypes.elementType,
  customMarker: PropTypes.elementType,
  customMarkerLeft: PropTypes.elementType,
  customMarkerRight: PropTypes.elementType,
  areMarkersSeparated: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  optionsArray: PropTypes.array,
  containerStyle: PropTypes.object,
  markerContainerStyle: PropTypes.object,
  markerStyle: PropTypes.object,
  pressedMarkerStyle: PropTypes.object,
  selectedStyle: PropTypes.object,
  trackStyle: PropTypes.object,
  unselectedStyle: PropTypes.object,
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
  minMarkerOverlapDistance: PropTypes.number,
  imageBackgroundSource: PropTypes.string,
  onMarkersPosition: PropTypes.func,
  disabledMarkerStyle: PropTypes.object,
  vertical: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 50,
    justifyContent: "center"
  },
  fullTrack: {
    flexDirection: "row"
  },
  track: {
    ...Platform.select({
      ios: {
        height: 2,
        borderRadius: 2,
        backgroundColor: "#A7A7A7"
      },
      android: {
        height: 2,
        backgroundColor: "#CECECE"
      },
      web: {
        height: 2,
        borderRadius: 2,
        backgroundColor: "#A7A7A7"
      }
    })
  },
  selectedTrack: {
    ...Platform.select({
      ios: {
        backgroundColor: "#095FFF"
      },
      android: {
        backgroundColor: "#0D8675"
      },
      web: {
        backgroundColor: "#095FFF"
      }
    })
  },
  markerContainer: {
    position: "absolute",
    width: 48,
    height: 48,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  topMarkerContainer: {
    zIndex: 1
  },
  touch: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch"
  }
});
