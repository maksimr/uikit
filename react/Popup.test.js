import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Popup, PopupProvider } from './Popup';
import React from 'react';
describe('Popup', function () {
    let rootNode;
    beforeEach(function () {
        rootNode = document.createElement('div');
    });
    it('should render popup', function () {
        act(() => {
            render(React.createElement(Popup, { anchorNode: rootNode, parentNode: rootNode },
                React.createElement("b", null, "Hello World!")), rootNode);
        });
        expect(text(rootNode)).toEqual('Hello World!');
    });
    it('should rerender popup', function () {
        act(() => {
            render(React.createElement(Popup, { anchorNode: rootNode, parentNode: rootNode },
                React.createElement("b", null, "Hello World!")), rootNode);
        });
        act(() => {
            render(React.createElement(Popup, { anchorNode: rootNode, parentNode: rootNode },
                React.createElement("b", null, "Hello Guest!")), rootNode);
        });
        expect(text(rootNode)).toEqual('Hello Guest!');
    });
    it('should render popup in a different subtree', function () {
        const popupParentNode = document.createElement('div');
        act(() => {
            render(React.createElement(Popup, { anchorNode: rootNode, parentNode: popupParentNode },
                React.createElement("b", null, "Hello World!")), rootNode);
        });
        expect(text(popupParentNode)).toEqual('Hello World!');
    });
    it('should allow setup popup by context', function () {
        const popupParentNode = document.createElement('div');
        act(() => {
            render(React.createElement(PopupProvider, { value: { parentNode: popupParentNode } },
                React.createElement(Popup, { anchorNode: rootNode },
                    React.createElement("b", null, "Hello World!"))), rootNode);
        });
        expect(text(popupParentNode)).toEqual('Hello World!');
    });
    it('should pass attributes to popup element', function () {
        act(() => {
            render(React.createElement(Popup, { anchorNode: rootNode, parentNode: rootNode, className: 'foo' },
                React.createElement("b", null, "Hello World!")), rootNode);
        });
        expect(getPopupNode(rootNode).classList.contains('foo')).toEqual(true);
    });
    function text(parentNode) {
        return parentNode.querySelector('b').innerHTML;
    }
    function getPopupNode(parentNode) {
        return parentNode.querySelector('[data-role=popup]');
    }
});
