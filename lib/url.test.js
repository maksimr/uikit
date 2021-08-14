import { compilePath, matchPath } from './url';

describe('Match path by template', function() {
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

describe('Create path from template', function() {
  it('should create actual path from match patch', function() {
    expect(compilePath('/foo/:id', { id: '1' })).toEqual('/foo/1');
  });
});