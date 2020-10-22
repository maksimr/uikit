import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Popup } from './Popup';
import React from 'react';

describe('Popup', function() {
  let rootNode;
  beforeEach(function() {
    rootNode = document.createElement('div');
  });

  it('should render popup', function() {
    act(() => {
      render(
        <Popup anchorNode={rootNode} parentNode={rootNode}>
          <b>Hello World!</b>
        </Popup>,
        rootNode);
    });

    expect(rootNode.querySelector('b').innerHTML).toEqual('Hello World!');
  });
});