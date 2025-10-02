import { render } from '@testing-library/react';
import { DateTime, DateTimeProvider } from './DateTime';
import { dateTimeLocale } from '../date';
import { setSystemTime, useFakeTimers } from './../../test/test-util';

describe('DateTime', function() {
  /**@type {number}*/
  let timestamp;
  beforeEach(function() {
    timestamp = 1579602974121;
    useFakeTimers();
    setSystemTime(timestamp);
  });

  it('should render date time using default format', function() {
    const { container } = render(<DateTime date={timestamp} />);
    expect(container.innerHTML).toBe('Jan 21, 2020');
  });

  it('should render date time using custom format', function() {
    const { container } = render(<DateTime date={timestamp} format='MMMM d, y' />);
    expect(container.innerHTML).toBe('January 21, 2020');
  });

  it('should render localized date', function() {
    const { container } = render(
      <DateTimeProvider value={{ ...dateTimeLocale, MONTH: ['Январь', '', '', '', '', '', '', '', '', '', '', ''] }}>
        <DateTime date={timestamp} format='MMMM' />
      </DateTimeProvider>
    );
    expect(container.innerHTML).toBe('Январь');
  });
});