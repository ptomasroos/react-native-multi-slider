import React from 'react';
import { View, StyleSheet, Platform, TouchableHighlight } from 'react-native';

export function DefaultMarker({
  enabled,
  pressed,
  pressedMarkerStyle,
  disabledMarkerStyle,
  markerStyle,
}) {
  return (
    <TouchableHighlight>
      <View
        style={
          enabled
            ? [
                styles.markerStyle,
                markerStyle,
                pressed && styles.pressedMarkerStyle,
                pressed && pressedMarkerStyle,
              ]
            : [styles.markerStyle, styles.disabled, disabledMarkerStyle]
        }
      />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  markerStyle: {
    ...Platform.select({
      ios: {
        height: 30,
        width: 30,
        borderRadius: 30,
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
      android: {
        height: 12,
        width: 12,
        borderRadius: 12,
        backgroundColor: '#0D8675',
      },
      web: {
        height: 30,
        width: 30,
        borderRadius: 30,
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
        height: 20,
        width: 20,
        borderRadius: 20,
      },
    }),
  },
  disabled: {
    backgroundColor: '#d3d3d3',
  },
});
