import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Waypoint } from './Waypoint';

describe('Waypoint', () => {
  /**@type {HTMLElement}*/
  let rootNode;
  beforeEach(function() {
    rootNode = document.createElement('div');
  });

  it('should render component', function() {
    act(() => {
      render(<Waypoint />, rootNode);
    });
  });
});