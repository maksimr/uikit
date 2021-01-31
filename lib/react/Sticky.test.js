import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Sticky } from './Sticky';

describe('Sticky', function() {
  /**@type {HTMLElement}*/
  let rootNode;
  beforeEach(function() {
    rootNode = document.createElement('div');
  });

  it('should render component', function() {
    act(() => {
      render(<Sticky>Hello World!</Sticky>, rootNode);
    });
  });
});
