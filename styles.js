import { StyleSheet } from 'react-native';

export default function getStyles(props) { // eslint-disable-line no-unused-vars
  return StyleSheet.create({
    container: {
      height: 40,
      position: 'relative',
    },
    fullTrack: {
      flexDirection: 'row',
    },
    track: {
      height: 4,
      borderRadius: 2,
      backgroundColor: '#A7A7A7',
    },
    selectedTrack: {
      backgroundColor: '#095FFF',
    },
    markerContainer: {
      top: -16,
      position: 'absolute',
      width: 48,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    topMarkerContainer: {
      zIndex: 1,
    },
  });
}
