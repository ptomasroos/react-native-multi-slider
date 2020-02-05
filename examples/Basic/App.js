/**
 * @format
 */

import React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import MultiSlider from 'react-native-multi-slider';
import CustomMarker from './CustomMarker';
import CustomLabel from './CustomLabel';

export default function App() {
  const [sliderOneChanging, setSliderOneChanging] = React.useState(false);
  const [sliderOneValue, setSliderOneValue] = React.useState([5]);
  const [multiSliderValue, setMultiSliderValue] = React.useState([3, 7]);
  const [
    nonCollidingMultiSliderValue,
    setNonCollidingMultiSliderValue,
  ] = React.useState([0, 100]);

  const sliderOneValuesChangeStart = () => setSliderOneChanging(true);

  const sliderOneValuesChange = values => setSliderOneValue(values);

  sliderOneValuesChangeFinish = () => setSliderOneChanging(false);

  multiSliderValuesChange = values => setMultiSliderValue(values);

  nonCollidingMultiSliderValuesChange = values =>
    setNonCollidingMultiSliderValue(values);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sliders</Text>
      <View style={styles.sliders}>
        <View style={styles.sliderOne}>
          <Text style={styles.text}>One Marker with callback example:</Text>
          <Text style={[styles.text, sliderOneChanging && { color: 'red' }]}>
            {sliderOneValue}
          </Text>
        </View>
        <MultiSlider
          values={sliderOneValue}
          sliderLength={310}
          onValuesChangeStart={sliderOneValuesChangeStart}
          onValuesChange={sliderOneValuesChange}
          onValuesChangeFinish={sliderOneValuesChangeFinish}
        />
        <View style={styles.sliderOne}>
          <Text style={styles.text}>Two Markers:</Text>
          <Text style={styles.text}>{multiSliderValue[0]} </Text>
          <Text style={styles.text}>{multiSliderValue[1]}</Text>
        </View>
        <MultiSlider
          values={[multiSliderValue[0], multiSliderValue[1]]}
          sliderLength={250}
          onValuesChange={multiSliderValuesChange}
          min={0}
          max={10}
          step={1}
          allowOverlap
          snapped
          customLabel={CustomLabel}
        />
      </View>
      <View style={styles.sliderOne}>
        <Text style={styles.text}>
          Two Markers with minimum overlap distance:
        </Text>
        <Text style={styles.text}>{nonCollidingMultiSliderValue[0]} </Text>
        <Text style={styles.text}>{nonCollidingMultiSliderValue[1]}</Text>
      </View>
      <MultiSlider
        values={[
          nonCollidingMultiSliderValue[0],
          nonCollidingMultiSliderValue[1],
        ]}
        sliderLength={280}
        onValuesChange={nonCollidingMultiSliderValuesChange}
        min={0}
        max={100}
        step={1}
        allowOverlap={false}
        snapped
        minMarkerOverlapDistance={40}
        customMarker={CustomMarker}
        customLabel={CustomLabel}
      />
      <Text style={styles.text}>Native RCT Slider</Text>
      <Slider style={{ width: 280 }} />
      <Text style={styles.text}>Custom Marker</Text>
      <MultiSlider
        selectedStyle={{
          backgroundColor: 'gold',
        }}
        unselectedStyle={{
          backgroundColor: 'silver',
        }}
        values={[5]}
        containerStyle={{
          height: 40,
        }}
        trackStyle={{
          height: 10,
          backgroundColor: 'red',
        }}
        touchDimensions={{
          height: 40,
          width: 40,
          borderRadius: 20,
          slipDisplacement: 40,
        }}
        customMarker={CustomMarker}
        customLabel={CustomLabel}
        sliderLength={280}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliders: {
    margin: 20,
    width: 280,
  },
  text: {
    alignSelf: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 30,
  },
  sliderOne: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
