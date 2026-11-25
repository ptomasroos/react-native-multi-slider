import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';
import { build } from 'esbuild';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

// Render the real component and lifecycle with native view primitives mocked.
const result = await build({
  entryPoints: [new URL('../MultiSlider.js', import.meta.url).pathname],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node',
  loader: { '.js': 'jsx' },
  external: ['react'],
  plugins: [
    {
      name: 'native-test-primitives',
      setup(builder) {
        builder.onResolve({ filter: /^(react-native|prop-types)$/ }, args => ({
          path: args.path,
          namespace: 'test',
        }));
        builder.onLoad({ filter: /.*/, namespace: 'test' }, args => ({
          contents:
            args.path === 'prop-types'
              ? 'export default { oneOfType: () => () => {}, string: () => {}, number: () => {}, bool: () => {} };'
              : `export const View='View', Text='Text', ImageBackground='ImageBackground', TouchableHighlight='TouchableHighlight';
           export const StyleSheet={create: value => value};
           export const Platform={OS:'ios', select: value => value.ios || value.default};
           export const Dimensions={get: () => ({width:320,height:640})};
           export const I18nManager={isRTL:false};
           export const PanResponder={create: callbacks => ({panHandlers:callbacks})};`,
        }));
      },
    },
  ],
});
const module = { exports: {} };
vm.runInNewContext(result.outputFiles[0].text, {
  module,
  exports: module.exports,
  require: createRequire(import.meta.url),
  console,
});
const MultiSlider = module.exports.default;

for (const scenario of [
  {
    name: 'lower maximum',
    values: [80],
    min: 0,
    max: 60,
    expected: [60],
    marker: 'One',
  },
  {
    name: 'higher minimum',
    values: [20],
    min: 40,
    max: 100,
    expected: [40],
    marker: 'One',
  },
  {
    name: 'range and second marker',
    values: [20, 80],
    min: 30,
    max: 60,
    expected: [30, 60],
    marker: 'Two',
  },
  {
    name: 'range with zero endpoint',
    values: [-80, 20],
    initialMin: -100,
    min: -100,
    max: 0,
    expected: [-80, 0],
    marker: 'One',
  },
  {
    name: 'both markers released together',
    values: [20, 80],
    min: 10,
    max: 90,
    expected: [20, 80],
    marker: 'Between',
    copies: 2,
  },
  {
    name: 'unchanged bounds preserve free thumb position',
    values: [80],
    min: 0,
    max: 100,
    expected: [86],
    marker: 'One',
    move: 5.5,
    position: 85.5,
  },
  {
    name: 'custom options ignore min and max',
    values: [80],
    optionsArray: [0, 20, 80, 100],
    min: 0,
    max: 60,
    expected: [80],
    marker: 'One',
  },
  {
    name: 'valid numeric value',
    values: [80],
    min: 40,
    max: 100,
    expected: [80],
    marker: 'One',
  },
]) {
  test(`release uses current bounds: ${scenario.name}`, () => {
    const calls = [];
    const props = {
      min: scenario.initialMin ?? 0,
      max: 100,
      values: scenario.values,
      optionsArray: scenario.optionsArray,
      sliderLength: 100,
      onValuesChangeFinish: values => calls.push(Array.from(values)),
    };
    let renderer;
    try {
      act(() => {
        renderer = TestRenderer.create(React.createElement(MultiSlider, props));
      });
      const instance = renderer.getInstance();
      const responder = instance[`_panResponder${scenario.marker}`].panHandlers;
      act(() => responder.onPanResponderGrant(null, { moveX: 1 }));
      if (scenario.move)
        act(() =>
          responder.onPanResponderMove(null, { dx: scenario.move, dy: 0 }),
        );
      act(() =>
        renderer.update(
          React.createElement(MultiSlider, {
            ...props,
            min: scenario.min,
            max: scenario.max,
          }),
        ),
      );
      assert.equal(instance.props.min, scenario.min);
      assert.equal(instance.props.max, scenario.max);
      act(() => responder.onPanResponderRelease(null, { moveX: 1 }));
      assert.deepEqual(
        calls,
        Array.from({ length: scenario.copies ?? 1 }, () => scenario.expected),
      );
      if (!scenario.optionsArray) {
        for (const [index, expected] of scenario.expected.entries()) {
          const position =
            instance.state[index === 0 ? 'positionOne' : 'positionTwo'];
          const expectedPosition =
            scenario.position ??
            ((expected - scenario.min) / (scenario.max - scenario.min)) * 100;
          assert.ok(
            Math.abs(position - expectedPosition) < 0.000001,
            `position ${position} should reflect new bounds: ${expectedPosition}`,
          );
        }
      }
    } finally {
      if (renderer) act(() => renderer.unmount());
    }
  });
}
