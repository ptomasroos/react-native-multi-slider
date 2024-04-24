import React from 'react';
import { View, Platform, TouchableHighlight } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

class DefaultMarker extends React.Component {
  render() {
    return (
      <TouchableHighlight>
        <View
          style={
            this.props.enabled
              ? [
                  styles.markerStyle,
                  this.props.markerStyle,
                  this.props.pressed && styles.pressedMarkerStyle,
                  this.props.pressed && this.props.pressedMarkerStyle,
                ]
              : [
                  styles.markerStyle,
                  styles.disabled,
                  this.props.disabledMarkerStyle,
                ]
          }
        />
      </TouchableHighlight>
    );
  }
}

const styles = ScaledSheet.create({
  markerStyle: {
    ...Platform.select({
      ios: {
        height: '30@ms',
        width: '30@ms',
        borderRadius: '30@ms',
        borderWidth: '1@ms',
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: moderateScale(3),
        },
        shadowRadius: 1,
        shadowOpacity: 0.2,
      },
      android: {
        height: '12@ms',
        width: '12@ms',
        borderRadius: '12@ms',
        backgroundColor: '#0D8675',
      },
      web: {
        height: '30@ms',
        width: '30@ms',
        borderRadius: '30@ms',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 1,
        shadowOpacity: 0.2,
      },
    }),
  },
  pressedMarkerStyle: {
    ...Platform.select({
      web: {},
      ios: {},
      android: {
        height: '20@ms',
        width: '20@ms',
        borderRadius: '20@ms',
      },
    }),
  },
  disabled: {
    backgroundColor: '#d3d3d3',
  },
});

export default DefaultMarker;
