import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Immutable { fromJS } from 'immutable';

import { PanResponder, ViewPropTypes, View } from 'react-native';

import DefaultMarker from './DefaultMarker';
import { createArray, positionToValue, valueToPosition } from './helpers/converters';
import getStyles from './styles';

export default class MultiSlider extends PureComponent {
  static propTypes = {
    values: PropTypes.arrayOf(PropTypes.number),
    onValuesChangeStart: PropTypes.func,
    onValuesChange: PropTypes.func,
    onValuesChangeFinish: PropTypes.func,
    sliderLength: PropTypes.number,
    touchDimensions: PropTypes.object,
    customMarker: PropTypes.element,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    optionsArray: PropTypes.array,
    containerStyle: ViewPropTypes.style,
    trackStyle: ViewPropTypes.style,
    markerStyle: ViewPropTypes.style,
    enabledOne: PropTypes.bool,
    enabledTwo: PropTypes.bool,
    onToggleOne: PropTypes.func,
    onToggleTwo: PropTypes.func,
    snapToValue: PropTypes.bool,
    icon: PropTypes.bool,
    iconOneName: PropTypes.string,
    iconTwoName: PropTypes.string,
    iconOneDisabledName: PropTypes.string,
    iconTwoDisabledName: PropTypes.string,
    iconOneColor: PropTypes.string,
    iconTwoColor: PropTypes.string,
    iconOneDisabledColor: PropTypes.string,
    iconTwoDisabledColor: PropTypes.string,
    immutable: PropTypes.bool,
  };

  static defaultProps = {
    values: [0],
    onValuesChangeStart: undefined,
    onValuesChange: undefined,
    onValuesChangeFinish: undefined,
    step: 1,
    min: 0,
    max: 10,
    touchDimensions: {
      borderRadius: 15,
      slipDisplacement: 200,
    },
    customMarker: DefaultMarker,
    sliderLength: 280,
    onToggleOne: undefined,
    onToggleTwo: undefined,
    enabledOne: true,
    enabledTwo: true,
    snapToValue: true,
    icon: false,
    iconOneName: 'check',
    iconTwoName: 'check',
    iconOneDisabledName: 'alarm-off',
    iconTwoDisabledName: 'alarm-off',
    iconOneColor: 'green',
    iconTwoColor: 'green',
    iconOneDisabledColor: 'grey',
    iconTwoDisabledColor: 'grey',
    immutable: false,
  };

  constructor(props) {
    super(props);

    this.optionsArray = props.optionsArray ||
      createArray(props.min, props.max, props.step);
    this.stepLength = props.sliderLength / this.optionsArray.length;
    if (Immutable.isImmutable(props.values)) {
      props.values.toJS();
    }
    const initialValues = props.values.map((value) =>
      valueToPosition(value, this.optionsArray, props.sliderLength));

    this.state = {
      valueOne: props.values[0],
      valueTwo: props.values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1],
    };
  }

  componentWillMount() {
    const customPanResponder = (start, move, end) => PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => start(),
      onPanResponderMove: (evt, gestureState) => move(gestureState),
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => end(gestureState),
      onPanResponderTerminate: (evt, gestureState) => end(gestureState),
      onShouldBlockNativeResponder: () => true,
    });

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

  startOne = () => {
    if (this.props.enabledOne && this.props.onValuesChangeStart) {
      this.props.onValuesChangeStart();
    }
  };

  startTwo = () => {
    if (this.props.enabledTwo && this.props.onValuesChangeStart) {
      this.props.onValuesChangeStart();
    }
  };

  moveOne = (gestureState) => {
    if (!this.props.enabledOne) {
      return;
    }

    const unconfined = gestureState.dx + this.state.pastOne;
    const bottom = 0;
    const trueTop = this.state.positionTwo - this.stepLength;
    const top = trueTop === 0 ? 0 : trueTop || this.props.sliderLength;

    let confined = unconfined;
    if (confined < bottom) {
      confined = bottom;
    } else if (confined > top) {
      confined = top;
    }

    const value = positionToValue(
      this.state.positionOne,
      this.optionsArray,
      this.props.sliderLength,
    );

    if (this.props.onValuesChange) {
      if (this.props.immutable) {
        this.props.onValuesChange(fromJS([value, this.state.valueTwo]));
      } else {
        this.props.onValuesChange([value, this.state.valueTwo]);
      }
    }

    const slipDisplacement = this.props.touchDimensions.slipDisplacement;

    let positionOne = this.state.positionOne;
    if (Math.abs(gestureState.dy) < slipDisplacement || !slipDisplacement) {
      positionOne = confined;
    }

    this.setState({ positionOne, valueOne: value });
  };

  moveTwo = (gestureState) => {
    if (!this.props.enabledTwo) {
      return;
    }

    const unconfined = gestureState.dx + this.state.pastTwo;
    const unconfined = gestureState.dx + this.state.pastTwo;
    const bottom = this.state.positionOne + this.stepLength;
    const top = this.props.sliderLength;

    let confined = unconfined;
    if (confined < bottom) {
      confined = bottom;
    } else if (confined > top) {
      confined = top;
    }

    const value = positionToValue(
      this.state.positionTwo,
      this.optionsArray,
      this.props.sliderLength,
    );

    if (this.props.onValuesChange) {
      if (this.props.immutable) {
        this.props.onValuesChange(fromJS([this.state.valueOne, value]));
      } else {
        this.props.onValuesChange([this.state.valueOne, value]);
      }
    }

    const slipDisplacement = this.props.touchDimensions.slipDisplacement;

    let positionTwo = this.state.positionTwo;
    if (Math.abs(gestureState.dy) < slipDisplacement || !slipDisplacement) {
      positionTwo = confined;
    }

    this.setState({ positionTwo, valueTwo: value });
  };

  endOne = (gestureState) => {
    if (gestureState.moveX <= 0 && this.props.onToggleOne) {
      this.props.onToggleOne();
      return;
    }
    if (this.props.onValuesChangeFinish) {
      this.props.onValuesChangeFinish([
        this.state.valueOne,
        this.state.valueTwo,
      ]);
    }
    const newPosition = valueToPosition(this.state.valueOne, this.optionsArray, this.props.sliderLength);
    this.setState({
      positionOne: this.props.snapToValue ? newPosition : this.state.positionOne,
      pastOne: this.state.positionOne,
    });
  };

  endTwo = (gestureState) => {
    if (gestureState.moveX <= 0 && this.props.onToggleTwo) {
      this.props.onToggleTwo();
      return;
    }
    if (this.props.onValuesChangeFinish) {
      this.props.onValuesChangeFinish([
        this.state.valueTwo,
        this.state.valueTwo,
      ]);
    }
    const newPosition = valueToPosition(this.state.valueTwo, this.optionsArray, this.props.sliderLength);
    this.setState({
      positionTwo: this.props.snapToValue ? newPosition : this.state.positionTwo,
      pastTwo: this.state.positionTwo,
    });
  };

  render() {
    const styles = getStyles(this.props);
    const { positionOne, positionTwo } = this.state;
    const { selectedStyle, unselectedStyle, sliderLength } = this.props;
    const twoMarkers = !!positionTwo;

    const trackOneLength = positionOne;
    const trackOneStyle = twoMarkers ? unselectedStyle : selectedStyle || styles.selectedTrack;
    const trackThreeLength = twoMarkers ? sliderLength - positionTwo : 0;
    const trackThreeStyle = unselectedStyle;
    const trackTwoLength = sliderLength - trackOneLength - trackThreeLength;
    const trackTwoStyle = twoMarkers
      ? selectedStyle || styles.selectedTrack
      : unselectedStyle;
    const Marker = this.props.customMarker;

    const markerContainerOne = { left: trackOneLength - 24 };
    const markerContainerTwo = { right: trackThreeLength - 24 };

    const commonMarkerProps = {
      markerStyle: [styles.marker, this.props.markerStyle],
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
            style={[
              styles.markerContainer,
              markerContainerOne,
              positionOne > (sliderLength / 2) && styles.topMarkerContainer,
            ]}
          >
            <Marker
              {...commonMarkerProps}
              panHandlers={this.panResponderOne.panHandlers}
              enabled={this.props.enabledOne}
              currentValue={this.state.valueOne}
              icon={this.props.icon}
              iconName={this.props.iconOneName}
              disabledIconName={this.props.iconOneDisabledName}
              iconColor={this.props.iconOneColor}
              disabledIconColor={this.props.iconOneDisabledColor}
            />
          </View>
          {twoMarkers && positionOne !== this.props.sliderLength && (
            <View style={[styles.markerContainer, markerContainerTwo]}>
              <Marker
                {...commonMarkerProps}
                panHandlers={this.panResponderTwo.panHandlers}
                currentValue={this.state.valueTwo}
                enabled={this.props.enabledTwo}
                icon={this.props.icon}
                iconName={this.props.iconTwoName}
                disabledIconName={this.props.iconTwoDisabledName}
                iconColor={this.props.iconOneColor}
                disabledIconColor={this.props.iconOneDisabledColor}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}
