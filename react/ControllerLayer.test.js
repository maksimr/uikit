import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import React from 'react';
import { ControllerLayer, useController } from './ControllerLayer';
describe('ControllerLayer', function () {
    class FooController {
        text() {
            return 'foo';
        }
    }
    class BarController {
        text() {
            return 'bar';
        }
    }
    let rootNode;
    beforeEach(function () {
        rootNode = document.createElement('div');
    });
    it('should pass controller through context', function () {
        const ctrl = new FooController();
        act(() => {
            render(React.createElement(ControllerLayer, { value: ctrl },
                React.createElement(Foo, null)), rootNode);
        });
        expect(rootNode.querySelector('b').innerHTML).toEqual(ctrl.text());
    });
    it('should allow to use more than one controller', function () {
        const fooCtrl = new FooController();
        const barCtrl = new BarController();
        act(() => {
            render(React.createElement(ControllerLayer, { value: barCtrl },
                React.createElement(ControllerLayer, { value: fooCtrl },
                    React.createElement(FooBar, null))), rootNode);
        });
        expect(rootNode.querySelector('b').innerHTML).toEqual(fooCtrl.text() + barCtrl.text());
    });
    function Foo() {
        const ctrl = useController(FooController);
        return React.createElement("b", null, ctrl.text());
    }
    function FooBar() {
        const fooCtrl = useController(FooController);
        const barCtrl = useController(BarController);
        return React.createElement("b", null,
            fooCtrl.text(),
            barCtrl.text());
    }
});
