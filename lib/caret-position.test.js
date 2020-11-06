import { getCaretPosition } from "./caret-position";

describe('getCaretPosition', function() {
  it('should get caret position', () => {
    const positionedParent = document.createElement('div');
    const element = document.createElement('textarea');
    element.value = 'foo';
    const position = getCaretPosition(element, 1, positionedParent);
    expect(position.top).toEqual(0);
  });
});