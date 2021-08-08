import { pathFrom, matchPath } from './url';

describe('matchPath', function() {
  it('should match path with actual path', function() {
    expect(matchPath('/foo/:id', '/foo/1')).toEqual({
      id: '1'
    });
  });

  it('should allow use greedy path match', function() {
    expect(matchPath('/foo/:id*', '/foo/bar/zoo/1')).toEqual({
      id: 'bar/zoo/1'
    });
  });

  it('should allow optional parameter in path', function() {
    expect(matchPath('/foo/:id?', '/foo')).toEqual({});
  });
});

describe('pathFrom', function() {
  it('should create actual path from match patch', function() {
    expect(pathFrom('/foo/:id', { id: '1' })).toEqual('/foo/1');
  });
});