import React from 'react';
import { render } from '@testing-library/react';
import { Waypoint } from './Waypoint';

describe('Waypoint', () => {
  it('should render component', function() {
    render(<Waypoint />);
  });
});