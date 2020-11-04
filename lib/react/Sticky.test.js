import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import React from 'react';
import { Sticky } from './Sticky';

describe('Sticky', function() {
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
