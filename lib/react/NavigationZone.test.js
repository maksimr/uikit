import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { NavigationZone, NavigationItem } from './NavigationZone';
import { act } from 'react-dom/test-utils';
import { createSpy } from './../../test/test-util';

describe('NavigationZone', function() {
  it('should render navigation zone', async function() {
    const onFocus = createSpy();
    const onBlur = createSpy();

    render(
      <NavigationZone data-testid="navZone">
        <NavigationItem onFocus={onFocus} onBlur={onBlur} value="a">
          <div>A</div>
        </NavigationItem>
        <NavigationItem onFocus={onFocus} onBlur={onBlur} value="b">
          <div>B</div>
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

  it('should get imperative reference on navigation zone to controll it', async function() {
    const onFocus = createSpy();
    const onBlur = createSpy();
    /**@type {import('react').MutableRefObject<import('./NavigationZone').NavigationZoneValue<any>|null>}*/
    let navZone;
    const App = () => {
      navZone = useRef(null);
      return (
        <NavigationZone data-testid="navZone" ref={navZone}>
          <NavigationItem onFocus={onFocus} onBlur={onBlur} value="a">
            <div>A</div>
          </NavigationItem>
          <NavigationItem onFocus={onFocus} onBlur={onBlur} value="b">
            <div>B</div>
          </NavigationItem>
        </NavigationZone>
      );
    };

    render(<App />);

    next();
    expect(onFocus).toHaveBeenCalledWith({ target: { value: 'a' } });
    next();
    expect(onFocus).toHaveBeenCalledWith({ target: { value: 'b' } });
    prev();
    expect(onFocus).toHaveBeenCalledWith({ target: { value: 'a' } });

    function next() {
      act(() => {
        navZone.current?.next();
      });
    }

    function prev() {
      act(() => {
        navZone.current?.prev();
      });
    }
  });
});