import React from 'react';
import { render, toJSON } from '@testing-library/react-native';

import MultiSlider from '../MultiSlider';

describe('Multislider', () => {
  it('should render a view', () => {
    const t = render(<MultiSlider />);
    expect(t.asJSON().type).toBe('View');
  });

  it('should render when a step is passed in as a prop', () => {
    const { container } = render(<MultiSlider step={4} />);
    expect(container.props.children.props.step).toBe(4);
  });
});
