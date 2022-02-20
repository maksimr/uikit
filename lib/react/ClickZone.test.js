import { createPortal } from 'react-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { ClickZone } from './ClickZone';
import { createSpy } from './../../test/test-util';

describe('ClickZone', function() {
  /**@type {function}*/ let onClickAway;
  /**@type {((event: any) => any)|undefined}*/ let onClick;
  /**@type {HTMLElement}*/ let portalNode;
  beforeEach(function() {
    portalNode = document.createElement('div');
    onClickAway = createSpy();
    onClick = createSpy();

    renderComponent();
  });

  it('should handle click away zone', async function() {
    fireEvent.click(await screen.findByTestId('out'));
    expect(onClickAway).toHaveBeenCalled();
  });

  it('should not fire click away if we click inside zone', async () => {
    fireEvent.click(await screen.findByTestId('in'));
    expect(onClickAway).not.toHaveBeenCalled();
  });

  it('should not shadow wrapped element onClick handler', async () => {
    fireEvent.click(await screen.findByTestId('in'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should not fire click inside portal which in the same virtual dom tree', () => {
    fireEvent.click(/**@type {HTMLElement}*/(portalNode.querySelector('#portal')));
    expect(onClickAway).not.toHaveBeenCalled();
  });

  it('should not throw error if wrapped element does not have onClick handler', function() {
    onClick = undefined;
    expect(() => {
      renderComponent();
      fireEvent.click(/**@type {HTMLElement}*/(portalNode.querySelector('#portal')));
    }).not.toThrow();
  });

  it('should work with string content', function() {
    expect(() => {
      render(
        <ClickZone onClickAway={onClickAway}>
          Hello World!
        </ClickZone>
      );
    }).not.toThrow();
  });

  function renderComponent() {
    render(
      <>
        <div data-testid="out" />
        <ClickZone onClickAway={onClickAway}>
          <div onClick={onClick} data-testid="in">
            <UsePortal />
          </div>
        </ClickZone>
      </>
    );


    function UsePortal() {
      return createPortal(<div id="portal" />, portalNode);
    }
  }
});

