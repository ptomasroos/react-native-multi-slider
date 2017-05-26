import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ViewPropTypes, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getStyles from './styles';

export default class DefaultMarker extends PureComponent {
  static propTypes = {
    markerStyle: ViewPropTypes.style,
    enabled: PropTypes.bool,
    currentValue: PropTypes.number,
    panHandlers: PropTypes.object,
    icon: PropTypes.bool,
    iconName: PropTypes.string,
    disabledIconName: PropTypes.string,
    iconColor: PropTypes.string,
    disabledIconColor: PropTypes.string,
  };

  static defaultProps = {
    icon: false,
  };

  renderDefault = () => {
    const styles = getStyles(this.props);
    const iconStyles = [
      styles.icon,
      this.props.enabled ? styles.enabled : styles.disabled,
    ];
    return (
      <View style={iconStyles} />
    );
  };

  renderIcon = () => {
    const styles = getStyles(this.props);
    const iconStyles = [
      styles.icon,
      this.props.enabled ? styles.enabled : styles.disabled,
    ];
    return (
      <Icon
        size={16}
        style={iconStyles}
        selectable={false}
        name={this.props.enabled ? this.props.iconName : this.props.disabledIconName}
        color={this.props.enabled ? this.props.iconColor : this.props.disabledIconColor}
      />
    );
  };

  render() {
    const styles = getStyles(this.props);
    const rootStyles = [
      styles.markerStyle,
      this.props.markerStyle,
    ];

    const { currentValue } = this.props;

    return (
      <View
        style={rootStyles}
        {...this.props.panHandlers}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        pointerEvents="box-only"
      >
        {this.props.icon ? this.renderIcon() : this.renderDefault()}
        <Text>{currentValue}</Text>
      </View>
    );
  }
}
