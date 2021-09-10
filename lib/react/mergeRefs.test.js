import { useRef, forwardRef, useEffect } from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { useMergeRefs } from './mergeRefs';

describe('mergeRefs', () => {
  it('should merge refs', () => {
    const outerRef = jest.fn();
    let localRef = null;
    const App = forwardRef((props, ref) => {
      const myRef = useRef(null);
      useEffect(() => {
        localRef = myRef.current;
      });
      const refs = useMergeRefs(myRef, ref);
      return <div ref={refs}/>;
    });

    act(() => {
      render(<App ref={outerRef}/>, document.createElement('div'));
    });

    expect(localRef).not.toEqual(null);
    expect(outerRef).toHaveBeenCalled();
  });
});