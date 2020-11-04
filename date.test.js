import { dateFilter } from './date';
describe('date', function () {
    let date;
    beforeEach(function () {
        date = 1579602974121;
        jest.useFakeTimers('modern');
        jest.setSystemTime(date);
    });
    it('should format date with default formatter', function () {
        expect(dateFilter(date)).toEqual('Jan 21, 2020');
    });
    it('should format date by predefined formatter', function () {
        expect(dateFilter(date, 'fullDate')).toEqual('Tuesday, January 21, 2020');
    });
    it('should format date using simple date format', function () {
        expect(dateFilter(date, 'MMM/dd/yy')).toEqual('Jan/21/20');
    });
    it('should use custom timezone', function () {
        expect(dateFilter(date, 'shortTime', '+04:00')).toEqual('2:36 PM');
    });
    it('should use custom timezone in GMT format', function () {
        expect(dateFilter(date, 'shortTime', 'GMT+0400')).toEqual('2:36 PM');
    });
    it('should allow to pass custom formatter and locale', function () {
        expect(dateFilter(date, (date) => `-${date.getDay()}-`)).toEqual('-2-');
    });
});
