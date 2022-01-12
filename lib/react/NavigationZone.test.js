import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { NavigationZone, NavigationItem } from './NavigationZone';
import { expect } from '@jest/globals';

describe('NavigationZone', function() {
  it('should render navigation zone', async function() {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    render(
      <NavigationZone data-testid="navZone">
        <NavigationItem onFocus={onFocus} onBlur={onBlur} value="a">
          <div>A</div>
        </NavigationItem>
        <NavigationItem onFocus={onFocus} onBlur={onBlur} value="b">
          <div>B</div>
        </NavigationItem>
        <NavigationItem onFocus={onFocus} onBlur={onBlur} value="c">
          <div>C</div>
        </NavigationItem>
      </NavigationZone>
    );

    const navZone = await screen.findByTestId('navZone');
    const keyPress = fireEvent.keyDown;
    const ArrowDown = { key: 'ArrowDown', code: 40 };
    const ArrowUp = { key: 'ArrowUp', code: 38 };

    fireEvent.focus(navZone);

    keyPress(navZone, ArrowDown);
    expect(onFocus).toHaveBeenCalledWith({ target: { value: 'a' } });

    keyPress(navZone, ArrowDown);
    expect(onFocus).toHaveBeenCalledWith({ target: { value: 'b' } });

    keyPress(navZone, ArrowUp);
    expect(onFocus).toHaveBeenCalledWith({ target: { value: 'a' } });
  });
});