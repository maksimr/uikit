import React from 'react';
import { render } from '@testing-library/react';
import { DateTime, DateTimeLayer } from './DateTime';
import { dateTimeLocale } from '../date';

describe('DateTime', function() {
  /**@type {number}*/
  let date;
  beforeEach(function() {
    date = 1579602974121;
    jest.useFakeTimers('modern');
    jest.setSystemTime(date);
  });

  it('should render date time using default format', function() {
    const { container } = render(<DateTime date={date} />);
    expect(container.innerHTML).toBe('Jan 21, 2020');
  });

  it('should render date time using custom format', function() {
    const { container } = render(<DateTime date={date} format='MMMM d, y' />);
    expect(container.innerHTML).toBe('January 21, 2020');
  });

  it('should render localized date', function() {
    const { container } = render(
      <DateTimeLayer value={{ ...dateTimeLocale, MONTH: ['Январь', '', '', '', '', '', '', '', '', '', '', ''] }}>
        <DateTime date={date} format='MMMM' />
      </DateTimeLayer>
    );
    expect(container.innerHTML).toBe('Январь');
  });

  it('should allow to pass custom formatter', function() {
    const { container } = render(
      <DateTimeLayer value={{ ...dateTimeLocale, fooDate: (/**@type {Date}*/date) => `${date.getMonth()} foo` }}>
        <DateTime date={date} format='fooDate' />
      </DateTimeLayer>
    );
    expect(container.innerHTML).toBe('0 foo');
  });
});