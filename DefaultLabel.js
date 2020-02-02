import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet } from 'react-native';

const sliderRadius = 3;
export default class DefaultLabel extends React.Component {
  static propTypes = {
    leftDiff: PropTypes.number,

    oneMarkerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    twoMarkerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    oneMarkerLeftPosition: PropTypes.number,
    twoMarkerLeftPosition: PropTypes.number,

    oneMarkerPressed: PropTypes.bool,
    twoMarkerPressed: PropTypes.bool,
  };

  static defaultProps = {
    leftDiff: 0,
  };

  render() {
    const {
      leftDiff,
      oneMarkerValue,
      twoMarkerValue,
      oneMarkerLeftPosition,
      twoMarkerLeftPosition,
      oneMarkerPressed,
      twoMarkerPressed,
    } = this.props;

    return (
      <View style={{ position: 'relative' }}>
        {Number.isFinite(oneMarkerLeftPosition) && (
          <View
            style={[
              styles.sliderLabel,
              { left: oneMarkerLeftPosition - leftDiff / 2 + sliderRadius },
              oneMarkerPressed && styles.markerPressed,
            ]}
          >
            <Text style={styles.sliderLabelText}>{oneMarkerValue}</Text>
          </View>
        )}

        {Number.isFinite(twoMarkerLeftPosition) && (
          <View
            style={[
              styles.sliderLabel,
              { left: twoMarkerLeftPosition - leftDiff / 2 + sliderRadius },
              twoMarkerPressed && styles.markerPressed,
            ]}
          >
            <Text style={styles.sliderLabelText}>{twoMarkerValue}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderLabel: {
    position: 'absolute',
    bottom: 0,
    minWidth: 51,
    padding: 8,
    backgroundColor: '#fff',
  },
  sliderLabelText: {
    alignItems: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: 11,
  },
  markerPressed: {
    borderWidth: 2,
    borderColor: '#999',
  },
});
