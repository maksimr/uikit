import { addLinkClickInterceptor } from './link-click-interceptor';

describe('addLinkClickInterceptor', function() {
  let baseUrl;
  let rootNode;
  let linkNode;
  let handler;
  let mouseEvent;
  beforeEach(function() {
    baseUrl = 'http://example.com';
    rootNode = document.createElement('div');
    linkNode = document.createElement('a');
    handler = jest.fn();
    mouseEvent = new MouseEvent('click', { bubbles: true });
    jest.spyOn(mouseEvent, 'preventDefault');

    rootNode.appendChild(linkNode);
    linkNode.href = `${baseUrl}/foo`;
  });

  it('should add link click interceptor', function() {
    addLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expect(handler).toHaveBeenCalled();
  });

  it('should prevent default behaviour', function() {
    addLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expect(mouseEvent.preventDefault).toHaveBeenCalled();
  });

  it('should NOT prevent default behaviour if handler returns FALSE', function() {
    handler.mockReturnValue(false);
    addLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expect(mouseEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should NOT intercept clicks for other origins', function() {
    linkNode.href = 'http://foo.com';
    addLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expectNotIntercepted();
  });

  it('should NOT intercept clicks if link has javascript protocol', function() {
    linkNode.href = 'javascript:void(0)';
    addLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expectNotIntercepted();
  });

  it('should NOT intercept clicks if link has mailto protocol', function() {
    linkNode.href = 'mailto:foo@foo.com';
    addLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expectNotIntercepted();
  });

  it('should NOT intercept clicks if link has target attribute', function() {
    linkNode.target = '_self';
    addLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expectNotIntercepted();
  });

  it('should NOT intercept click with pressed Ctrl or Meta or Shift or right mouse button keys', function() {
    addLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    [
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { button: 2 },
      { which: 2 }
    ].forEach((options) => {
      click(linkNode, options);
      expectNotIntercepted();
    });
  });

  it('should take origin from base tag', function() {
    const base = document.createElement('base');
    base.href = baseUrl;
    rootNode.appendChild(base);

    addLinkClickInterceptor(handler, { rootNode: rootNode });
    click(linkNode);

    expect(handler).toHaveBeenCalled();
  });

  it('should allow add link click interceptor without config', () => {
    expect(() => addLinkClickInterceptor(() => true)).not.toThrow();
  });

  function click(node, options) {
    mouseEvent = new MouseEvent('click', Object.assign({
      bubbles: true
    }, options));
    jest.spyOn(mouseEvent, 'preventDefault');
    linkNode.dispatchEvent(mouseEvent);
  }

  function expectNotIntercepted() {
    expect(handler).not.toHaveBeenCalled();
    expect(mouseEvent.preventDefault).not.toHaveBeenCalled();
  }
});