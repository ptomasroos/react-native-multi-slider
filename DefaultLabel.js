import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet, Platform, TouchableHighlight } from 'react-native';

const ViewPropTypes = require('react-native').ViewPropTypes || View.propTypes;

export default class DefaultLabel extends React.Component {
  static propTypes = {
    leftDiff: PropTypes.number,

    labelStyle: ViewPropTypes.style,
    labelTextStyle: ViewPropTypes.style,

    oneMarkerValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    twoMarkerValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    oneMarkerLeftPosition: PropTypes.number,
    twoMarkerLeftPosition: PropTypes.number
  };

  static defaultProps = {
    leftDiff: 0,
    labelStyle: {},
    labelTextStyle: {}
  };

  render() {
    const {leftDiff, labelStyle, labelTextStyle, oneMarkerValue, twoMarkerValue, oneMarkerLeftPosition, twoMarkerLeftPosition} = this.props;

    return (
      <View style={{position: 'relative'}}>
        <View style={[styles.sliderLabel, {left: (oneMarkerLeftPosition - leftDiff)}, labelStyle]}>
          <Text style={[styles.sliderLabelText, labelTextStyle]}>{oneMarkerValue}</Text>
        </View>

        <View style={[styles.sliderLabel, {left: (twoMarkerLeftPosition - leftDiff)}, labelStyle]}>
          <Text style={[styles.sliderLabelText, labelTextStyle]}>{twoMarkerValue}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderLabel: {
    position: 'absolute',
    top: -24,
    minWidth: 51,
    padding: 8,
    backgroundColor: '#fff',
  },
  sliderLabelText: {
    alignItems: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: 11
  },
});
