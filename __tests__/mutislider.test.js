import React from 'react';
import { render } from '@testing-library/react-native';

import MultiSlider from '../MultiSlider';

describe('Multislider', () => {
  it('should render a view', () => {
    const t = render(<MultiSlider />);
    expect(t.asJSON().type).toBe('View');
  });

  it('should render when a step is passed in as a prop', () => {
    const { baseElement } = render(<MultiSlider step={4} />);
    expect(baseElement.children[0].props.children.props.step).toBe(4);
  });
});
