import { render } from '@testing-library/react';
import { Sticky } from './Sticky';

describe('Sticky', function() {
  it('should render component', function() {
    render(<Sticky>Hello World!</Sticky>);
  });
});
