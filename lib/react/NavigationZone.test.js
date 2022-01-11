import React from 'react';
import { render } from '@testing-library/react';
import { NavigationZone, NavigationItem } from './NavigationZone';
import { expect } from '@jest/globals';

describe('NavigationZone', function() {
  it('should render navigation zone', function() {
    render(
      <NavigationZone>
        <NavigationItem value="a">
          <div>A</div>
        </NavigationItem>
      </NavigationZone>
    );
    expect(true).toEqual(true);
  });
});