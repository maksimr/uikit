import { interpolate, match } from './path';
describe('match', function () {
    it('should match path with actual path', function () {
        expect(match('/foo/:id', '/foo/1')).toEqual({
            id: '1'
        });
    });
    it('should allow use greedy path match', function () {
        expect(match('/foo/:id*', '/foo/bar/zoo/1')).toEqual({
            id: 'bar/zoo/1'
        });
    });
    it('should allow optional parameter in path', function () {
        expect(match('/foo/:id?', '/foo')).toEqual({});
    });
});
describe('interpolate', function () {
    it('should create actual path from match patch', function () {
        expect(interpolate('/foo/:id', { id: '1' })).toEqual('/foo/1');
    });
});
