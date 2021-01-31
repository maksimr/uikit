import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { DateTime, DateTimeLayer } from './DateTime';
import { dateTimeLocale } from "../date";

describe('DateTime', function() {
  /**@type {HTMLElement}*/
  let rootNode;
  /**@type {number}*/
  let date;
  beforeEach(function() {
    date = 1579602974121;
    jest.useFakeTimers('modern');
    jest.setSystemTime(date);
    rootNode = document.createElement('div');
  });

  beforeEach(function() {
    act(() => {
      render(<DateTime date={date}/>, rootNode);
    });
  });

  it('should render date time using default format', function() {
    expect(rootNode.innerHTML).toBe('Jan 21, 2020');
  });

  it('should render date time using custom format', function() {
    act(() => {
      render(<DateTime date={date} format='MMMM d, y'/>, rootNode);
    });
    expect(rootNode.innerHTML).toBe('January 21, 2020');
  });

  it('should render localized date', function() {
    act(() => {
      render(
        <DateTimeLayer value={{ ...dateTimeLocale, MONTH: ['Январь', '', '', '', '', '', '', '', '', '', '', ''] }}>
          <DateTime date={date} format='MMMM'/>
        </DateTimeLayer>
        , rootNode);
    });
    expect(rootNode.innerHTML).toBe('Январь');
  });

  it('should allow to pass custom formatter', function() {
    act(() => {
      render(
        <DateTimeLayer value={{ ...dateTimeLocale, fooDate: (/**@type {Date}*/date) => `${date.getMonth()} foo` }}>
          <DateTime date={date} format='fooDate'/>
        </DateTimeLayer>
        , rootNode);
    });
    expect(rootNode.innerHTML).toBe('0 foo');
  });
});