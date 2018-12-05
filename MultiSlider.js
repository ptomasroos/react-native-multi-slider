// @flow
import * as React from 'react';
import {
  StyleSheet,
  PanResponder,
  View,
  Platform,
  I18nManager,
} from 'react-native';

import DefaultMarker from './DefaultMarker';
import { createArray, valueToPosition, positionToValue } from './converters';

type ViewProps = React.ElementProps<typeof View>;
type ViewStyleProp = $PropertyType<ViewProps, 'style'>;

type MarkerProps = React.ElementProps<typeof DefaultMarker>;

type Props = MarkerProps & {
  values: Array<number>,
  optionsArray: Array<number>,
  onValuesChangeStart: Function,
  onValuesChange: Function,
  onValuesChangeFinish: Function,
  step: number,
  min: number,
  max: number,
  touchDimensions: Object,
  customMarker: any,
  customMarkerLeft: any,
  customMarkerRight: any,
  markerOffsetX: number,
  markerOffsetY: number,
  onToggleOne: Function,
  onToggleTwo: Function,
  enabledOne: boolean,
  enabledTwo: boolean,
  allowOverlap: boolean,
  snapped: boolean,
  isMarkersSeparated: boolean,
  trackStyle: ViewStyleProp,
  containerStyle: ViewStyleProp,
  selectedStyle: ViewStyleProp,
  unselectedStyle: ViewStyleProp,
  sliderLength: number,
  markerContainerStyle: ViewStyleProp,
};

type State = {
  onePressed: boolean,
  twoPressed: boolean,
  valueOne: number,
  valueTwo: number,
  pastOne: number,
  pastTwo: number,
  positionOne: number,
  positionTwo: number,
  sliderLength: number,
};

class MultiSlider extends React.Component<Props, State> {
  optionsArray: Array<number>;
  stepLength: number;
  panResponderOne: Object;
  panResponderTwo: Object;

  static defaultProps = {
    values: [0],
    onValuesChangeStart: () => {},
    onValuesChange: (values: number) => {},
    onValuesChangeFinish: (values: number) => {},
    step: 1,
    min: 0,
    max: 10,
    touchDimensions: {
      borderRadius: 15,
      slipDisplacement: 200,
    },
    customMarker: DefaultMarker,
    customMarkerLeft: DefaultMarker,
    customMarkerRight: DefaultMarker,
    markerOffsetX: 0,
    markerOffsetY: 0,
    onToggleOne: undefined,
    onToggleTwo: undefined,
    enabledOne: true,
    enabledTwo: true,
    allowOverlap: false,
    snapped: false,
    sliderLength: 0,
  };

  constructor(props: Props) {
    super(props);

    this.optionsArray =
      this.props.optionsArray ||
      createArray(this.props.min, this.props.max, this.props.step);
    this.stepLength = this.props.sliderLength / this.optionsArray.length;

    const initialValues = this.props.values.map(value =>
      valueToPosition(value, this.optionsArray, this.props.sliderLength),
    );

    this.state = {
      onePressed: false,
      twoPressed: false,
      valueOne: this.props.values[0],
      valueTwo: this.props.values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1],
      sliderLength: 0,
    };

    const customPanResponder = (start, move, end) => {
      return PanResponder.create({
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
    };

    this.panResponderOne = customPanResponder(
      this.startOne,
      this.moveOne,
      this.endOne,
    );

    this.panResponderTwo = customPanResponder(
      this.startTwo,
      this.moveTwo,
      this.endTwo,
    );
  }

  /*  componentDidUpdate(prevProps) {
    if (this.state.onePressed || this.state.twoPressed) {
      return;
    }

    let nextState = {};
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

      var positionOne = valueToPosition(
        nextProps.values[0],
        this.optionsArray,
        nextProps.sliderLength,
      );

      nextState.valueOne = nextProps.values[0];
      nextState.pastOne = positionOne;
      nextState.positionOne = positionOne;

      var positionTwo = valueToPosition(
        nextProps.values[1],
        this.optionsArray,
        nextProps.sliderLength,
      );
      nextState.valueTwo = nextProps.values[1];
      nextState.pastTwo = positionTwo;
      nextState.positionTwo = positionTwo;
    }

    if (nextState != {}) {
      this.setState(nextState);
    }
  }*/

  startOne = (): void => {
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

  moveOne = (gestureState: Object) => {
    if (!this.props.enabledOne) {
      return;
    }

    const accumDistance = gestureState.dx;
    const accumDistanceDisplacement = gestureState.dy;

    const unconfined = I18nManager.isRTL
      ? this.state.pastOne - accumDistance
      : accumDistance + this.state.pastOne;
    const bottom = 0;
    const trueTop =
      this.state.positionTwo - (this.props.allowOverlap ? 0 : this.stepLength);
    const top = trueTop === 0 ? 0 : trueTop || this.props.sliderLength;
    const confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      const value = positionToValue(
        confined,
        this.optionsArray,
        this.props.sliderLength,
      );

      const snapped = valueToPosition(
        value,
        this.optionsArray,
        this.props.sliderLength,
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
          },
        );
      }
    }
  };

  moveTwo = (gestureState: Object) => {
    if (!this.props.enabledTwo) {
      return;
    }

    const accumDistance = gestureState.dx;
    const accumDistanceDisplacement = gestureState.dy;

    const unconfined = I18nManager.isRTL
      ? this.state.pastTwo - accumDistance
      : accumDistance + this.state.pastTwo;
    const bottom =
      this.state.positionOne + (this.props.allowOverlap ? 0 : this.stepLength);
    const top = this.props.sliderLength;
    const confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      const value = positionToValue(
        confined,
        this.optionsArray,
        this.props.sliderLength,
      );

      const snapped = valueToPosition(
        value,
        this.optionsArray,
        this.props.sliderLength,
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
          },
        );
      }
    }
  };

  endOne = (gestureState: Object) => {
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
      },
    );
  };

  endTwo = (gestureState: Object) => {
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
      },
    );
  };

  onContainerLayout = (e: Object) => {
    this.setState({ sliderLength: e.nativeEvent.layout.width });
  };

  render() {
    const { positionOne, positionTwo, sliderLength } = this.state;
    const {
      selectedStyle,
      unselectedStyle,
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

    const { borderRadius } = this.props.touchDimensions;
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
      <View
        style={[styles.container, this.props.containerStyle]}
        onLayout={this.onContainerLayout}
      >
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
            style={[
              styles.markerContainer,
              markerContainerOne,
              this.props.markerContainerStyle,
              positionOne > sliderLength / 2 && styles.topMarkerContainer,
            ]}
          >
            <View
              style={[styles.touch, touchStyle]}
              {...this.panResponderOne.panHandlers}
            >
              {isMarkersSeparated === false ? (
                <Marker
                  enabled={this.props.enabledOne}
                  pressed={this.state.onePressed}
                  markerStyle={[styles.marker, this.props.markerStyle]}
                  pressedMarkerStyle={this.props.pressedMarkerStyle}
                  currentValue={this.state.valueOne}
                />
              ) : (
                <MarkerLeft
                  enabled={this.props.enabledOne}
                  pressed={this.state.onePressed}
                  markerStyle={[styles.marker, this.props.markerStyle]}
                  pressedMarkerStyle={this.props.pressedMarkerStyle}
                  currentValue={this.state.valueOne}
                />
              )}
            </View>
          </View>
          {twoMarkers &&
            positionOne !== this.props.sliderLength && (
              <View
                style={[
                  styles.markerContainer,
                  markerContainerTwo,
                  this.props.markerContainerStyle,
                ]}
              >
                <View
                  style={[styles.touch, touchStyle]}
                  {...this.panResponderTwo.panHandlers}
                >
                  {isMarkersSeparated === false ? (
                    <Marker
                      pressed={this.state.twoPressed}
                      markerStyle={this.props.markerStyle}
                      pressedMarkerStyle={this.props.pressedMarkerStyle}
                      currentValue={this.state.valueTwo}
                      enabled={this.props.enabledTwo}
                    />
                  ) : (
                    <MarkerRight
                      pressed={this.state.twoPressed}
                      markerStyle={this.props.markerStyle}
                      pressedMarkerStyle={this.props.pressedMarkerStyle}
                      currentValue={this.state.valueTwo}
                      enabled={this.props.enabledTwo}
                    />
                  )}
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
  marker: {},
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

export default MultiSlider;
