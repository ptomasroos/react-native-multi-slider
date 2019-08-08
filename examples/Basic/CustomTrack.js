import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class CustomMarker extends React.PureComponent {
	render() {
		const { style, children } = this.props;

		return (
			<LinearGradient
				style={[ style, styles.gradient ]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				colors={['red', 'orange', 'yellow', 'green']}
			>
				{children}
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	track: {},
	gradient: {
		overflow: 'visible',
	},
});

export default CustomMarker;
