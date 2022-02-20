import { useRef, forwardRef, useEffect } from 'react';
import { render } from '@testing-library/react';
import React from 'react';
import { useMergeRefs } from './mergeRefs';
import { createSpy } from './../../test/test-util';

describe('mergeRefs', () => {
  it('should merge refs', () => {
    const outerRef = createSpy();
    let localRef = null;
    const App = forwardRef((props, ref) => {
      const myRef = useRef(null);
      useEffect(() => {
        localRef = myRef.current;
      });
      const refs = useMergeRefs(myRef, ref);
      return <div ref={refs} />;
    });

    render(<App ref={outerRef} />);

    expect(localRef).not.toEqual(null);
    expect(outerRef).toHaveBeenCalled();
  });
});