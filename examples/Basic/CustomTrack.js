import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class CustomMarker extends React.Component {
  render() {
    const { style, children } = this.props;

    return (
      <View style={style}>
        <LinearGradient
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['red', 'orange', 'yellow', 'green']}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  track: {},
  gradient: {
    overflow: 'visible',
    height: 8,
  },
});

export default CustomMarker;
