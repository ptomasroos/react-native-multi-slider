import {StyleSheet} from 'react-native';

export default function getStyles(props) {
  return StyleSheet.create({
    markerStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 48, // touch slop padding
      width: 48,
    },
    icon: {
      width: 32,
      height: 32,
      padding: 8,
      borderRadius: 16,
      borderWidth: 0,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    enabled: {
      backgroundColor: props.iconColor,
    },
    disabled: {
      backgroundColor: props.disabledIconColor,
    },
  });
}
