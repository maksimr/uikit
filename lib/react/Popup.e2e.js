import { Popup } from './Popup';
import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

describe('Popup', function() {
  beforeAll(async function() {
    document.body.style.padding = '0';
    document.body.style.margin = '0';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';
    // @ts-ignore
    await window.setViewport?.({ width: 800, height: 600 });
  });

  it('should position popup near anchor', async function() {
    render(
      <Anchor>
        <BoxPopup />
      </Anchor>
    );

    await compareScreenshot();
  });

  it('should position popup by passed direction', async function() {
    render(
      <Anchor>
        <BoxPopup direction='rt' />
      </Anchor>
    );

    await compareScreenshot();
  });

  it('should open popup at the top if not enough place at the bottom', async function() {
    render(
      <PositionedContainer style={{ overflow: 'hidden', height: 200 }}>
        <Anchor style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <BoxPopup />
        </Anchor>
      </PositionedContainer>
    );

    await compareScreenshot();
  });

  it('should allow render popup out of container if overflow visible', async function() {
    render(
      <PositionedContainer style={{ height: 200 }}>
        <Anchor style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <BoxPopup />
        </Anchor>
      </PositionedContainer>
    );

    await compareScreenshot();
  });

  it('should recalculate position when popup size has changed', async () => {
    const { rerender } = render(getComponent(50));
    await screenUpdate();

    rerender(getComponent(100));
    await screenUpdate();

    await screenUpdate();
    await compareScreenshot();

    function getComponent(size = 100) {
      return (
        <PositionedContainer style={{ overflow: 'hidden', height: 200 }}>
          <Anchor style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <BoxPopup size={size} resizable={true} />
          </Anchor>
        </PositionedContainer>
      );
    }
  });

  async function screenUpdate() {
    await act(async () => {
      await new Promise((resolve) => {
        requestAnimationFrame(function() {
          resolve(void 0);
        });
      });
    });
  }

  function BoxPopup({ size = 100, ...props }) {
    return (
      <Popup {...props}>
        <Box size={size} />
      </Popup>
    );
  }

  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   * @returns {JSX.Element}
   */
  function Anchor({ children, style = {}, ...props }) {
    return (
      <div {...props} style={{ 'display': 'inline-block', ...style }}>
        <Box size={20} />
        {children}
      </div>
    );
  }

  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
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
   * @param {{size?: number; color?: string; width?: number; height?: number}} props
   * @returns {JSX.Element}
   */
  function Box({ size = 100, color = 'rgb(0,0,255)', width = size, height = size }) {
    return (
      <svg width={width} height={height} style={{ display: 'inline-flex' }}>
        <rect width={width} height={height} style={{ fill: color }} />
      </svg>
    );
  }

  async function compareScreenshot() {
    await act(async () => {
      const image = await window.screenshot();
      await expectAsync(image).toMatchImageSnapshot();
    });
  }
});