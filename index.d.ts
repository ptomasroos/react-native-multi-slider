// Type definitions for @ptomasroos/react-native-multi-slider 0.0
// Project: https://github.com/ptomasroos/react-native-multi-slider#readme
// Definitions by: Edward Sammut Alessi <https://github.com/Slessi>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8
import * as React from "react";
import { ViewStyle } from "react-native";


export interface StepsAsProps {
    index: number;
    stepLabel: string;
    prefix: string;
    suffix: string;
}

export interface MarkerProps {
    pressed: boolean;
    pressedMarkerStyle: ViewStyle;
    markerStyle: ViewStyle;
    enabled: boolean;
    currentValue: number;
    valuePrefix: string;
    valueSuffix: string;
}

export interface LabelProps {
    oneMarkerValue: string | number;
    twoMarkerValue: string | number;
    minValue: number;
    maxValue: number;
    oneMarkerLeftPosition: number;
    twoMarkerLeftPosition: number;
    oneMarkerPressed: boolean;
    twoMarkerPressed: boolean;
}

export interface MultiSliderProps {
    values?: number[];

    onValuesChange?: (values: number[]) => void;
    onValuesChangeStart?: () => void;
    onValuesChangeFinish?: (values: number[]) => void;

    sliderLength?: number;
    touchDimensions?: {
        height: number;
        width: number;
        borderRadius: number;
        slipDisplacement: number;
    };

    customMarker?: React.ComponentType<MarkerProps>;
    customMarkerLeft?: React.ComponentType<MarkerProps>;
    customMarkerRight?: React.ComponentType<MarkerProps>;
    customLabel?: React.ComponentType<LabelProps>;

    isMarkersSeparated?: boolean;

    min?: number;
    max?: number;
    step?: number;

    stepsAs?: StepsAsProps[];

    optionsArray?: number[];

    containerStyle?: ViewStyle;
    trackStyle?: ViewStyle;
    selectedStyle?: ViewStyle;
    unselectedStyle?: ViewStyle;
    markerContainerStyle?: ViewStyle;
    markerStyle?: ViewStyle;
    pressedMarkerStyle?: ViewStyle;
    stepStyle?: ViewStyle;
    stepLabelStyle?: ViewStyle;
    stepMarkerStyle?: ViewStyle;
    valuePrefix?: string;
    valueSuffix?: string;
    showSteps?: boolean;
    showStepMarkers?: boolean;
    showStepLabels?: boolean;
    enabledOne?: boolean;
    enabledTwo?: boolean;
    onToggleOne?: () => void;
    onToggleTwo?: () => void;
    allowOverlap?: boolean;
    snapped?: boolean;
    smoothSnapped?: boolean;
    markerOffsetX?: number;
    markerOffsetY?: number;
    minMarkerOverlapDistance?: number;
    minMarkerOverlapStepDistance?: number;
    imageBackgroundSource?: string;
    enableLabel?: boolean;
    vertical?: boolean;
}

export default class MultiSlider extends React.Component<MultiSliderProps> {}
