import React from 'react';
import PropTypes from 'prop-types';

import { View, Text } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

const width = moderateScale(50);
export default class DefaultLabel extends React.Component {
  static propTypes = {
    oneMarkerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    twoMarkerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    oneMarkerLeftPosition: PropTypes.number,
    twoMarkerLeftPosition: PropTypes.number,

    oneMarkerPressed: PropTypes.bool,
    twoMarkerPressed: PropTypes.bool,
  };

  render() {
    const {
      oneMarkerValue,
      twoMarkerValue,
      oneMarkerLeftPosition,
      twoMarkerLeftPosition,
      oneMarkerPressed,
      twoMarkerPressed,
    } = this.props;

    return (
      <View style={{ position: 'relative' }}>
        {Number.isFinite(oneMarkerLeftPosition) &&
          Number.isFinite(oneMarkerValue) && (
            <View
              style={[
                styles.sliderLabel,
                { left: moderateScale(oneMarkerLeftPosition) - width / 2 },
                oneMarkerPressed && styles.markerPressed,
              ]}
            >
              <Text style={styles.sliderLabelText}>{oneMarkerValue}</Text>
            </View>
          )}

        {Number.isFinite(twoMarkerLeftPosition) &&
          Number.isFinite(twoMarkerValue) && (
            <View
              style={[
                styles.sliderLabel,
                { left: moderateScale(twoMarkerLeftPosition) - width / 2 },
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

const styles = ScaledSheet.create({
  sliderLabel: {
    position: 'absolute',
    bottom: 0,
    minWidth: width,
    padding: '8@ms',
    backgroundColor: '#f1f1f1',
  },
  sliderLabelText: {
    alignItems: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: 11,
  },
  markerPressed: {
    borderWidth: '2@ms',
    borderColor: '#999',
  },
});
