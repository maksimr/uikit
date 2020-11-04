import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { DateTime, DateTimeLayer } from './DateTime';
describe('DateTime', function () {
    let rootNode;
    let date;
    beforeEach(function () {
        date = 1579602974121;
        jest.useFakeTimers('modern');
        jest.setSystemTime(date);
        rootNode = document.createElement('div');
    });
    beforeEach(function () {
        act(() => {
            render(React.createElement(DateTime, { date: date }), rootNode);
        });
    });
    it('should render date time using default format', function () {
        expect(rootNode.innerHTML).toBe('Jan 21, 2020');
    });
    it('should render date time using custom format', function () {
        act(() => {
            render(React.createElement(DateTime, { date: date, format: 'MMMM d, y' }), rootNode);
        });
        expect(rootNode.innerHTML).toBe('January 21, 2020');
    });
    it('should render localized date', function () {
        act(() => {
            render(React.createElement(DateTimeLayer, { value: { MONTH: ['Январь'] } },
                React.createElement(DateTime, { date: date, format: 'MMMM' })), rootNode);
        });
        expect(rootNode.innerHTML).toBe('Январь');
    });
    it('should allow to pass custom formatter', function () {
        act(() => {
            render(React.createElement(DateTimeLayer, { value: { fooDate: (date) => `${date.getMonth()} foo` } },
                React.createElement(DateTime, { date: date, format: 'fooDate' })), rootNode);
        });
        expect(rootNode.innerHTML).toBe('0 foo');
    });
});
