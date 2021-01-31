import { act } from 'react-dom/test-utils';
import { Popup } from './Popup';
import React from 'react';
import { screen } from "../../test/e2e/screen";

describe('Popup', function() {
  it('should position popup near anchor', async function() {
    act(() => {
      screen(
        <Anchor>
          <BoxPopup/>
        </Anchor>
      );
    });

    const image = await window.screenshot();
    await expectAsync(image).toMatchImageSnapshot();
  });

  it('should position popup by passed direction', async function() {
    act(() => {
      screen(
        <Anchor>
          <BoxPopup direction='rt'/>
        </Anchor>
      );
    });

    const image = await window.screenshot();
    await expectAsync(image).toMatchImageSnapshot();
  });

  it('should open popup at the top if not enough place at the bottom', async function() {
    act(() => {
      screen(
        <PositionedContainer style={{ overflow: 'hidden', height: 200 }}>
          <Anchor style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <BoxPopup/>
          </Anchor>
        </PositionedContainer>
      );
    });

    const image = await window.screenshot();
    await expectAsync(image).toMatchImageSnapshot();
  });

  it('should allow render popup out of container if overflow visible', async function() {
    act(() => {
      screen(
        <PositionedContainer style={{ height: 200 }}>
          <Anchor style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <BoxPopup/>
          </Anchor>
        </PositionedContainer>
      );
    });

    const image = await window.screenshot();
    await expectAsync(image).toMatchImageSnapshot();
  });

  it("should recalculate position when popup size has changed", async () => {
    rerender(50);
    await screenUpdate();

    rerender(100);
    await screenUpdate();

    const image = await window.screenshot();
    await expectAsync(image).toMatchImageSnapshot();

    function rerender(size = 100) {
      return act(() => {
        screen(
          <PositionedContainer style={{ overflow: 'hidden', height: 200 }}>
            <Anchor style={{ position: 'absolute', bottom: 0, left: 0 }}>
              <BoxPopup size={size} resizable={true}/>
            </Anchor>
          </PositionedContainer>
        );
      });
    }
  });

  function screenUpdate() {
    return new global.Promise((resolve) => {
      requestAnimationFrame(resolve);
    });
  }

  function BoxPopup({ size = 100, ...props }) {
    return (
      <Popup {...props}>
        <Box size={size}/>
      </Popup>
    );
  }

  /**
   * @param {any} props
   * @returns {JSX.Element}
   */
  function Anchor({ children, style = {}, ...props }) {
    return (
      <div {...props} style={{ 'display': 'inline-block', ...style }}>
        <Box size={20}/>
        {children}
      </div>
    );
  }

  /**
   * @param {any} props
   * @returns {JSX.Element}
   */
  function PositionedContainer({ children, style = {}, ...props }) {
    return (
      <div {...props} style={{ 'position': 'relative', border: '1px solid blue', ...style }}>
        {children}
      </div>
    );
  }

  /**
   * @param {any} props
   * @returns {JSX.Element}
   */
  function Box({ size = 100, color = 'rgb(0,0,255)', width = size, height = size }) {
    return (
      <svg width={width} height={height} style={{ display: 'inline-flex' }}>
        <rect width={width} height={height} style={{ fill: color }}/>
      </svg>
    );
  }
});