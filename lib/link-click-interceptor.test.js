import { installLinkClickInterceptor } from './link-click-interceptor';
import { createSpy, spyOn } from './../test/test-util';

describe('addLinkClickInterceptor', function() {
  /**@type {string}*/
  let baseUrl;
  /**@type {HTMLDivElement}*/
  let rootNode;
  /**@type {HTMLAnchorElement}*/
  let linkNode;
  /**@type {ReturnType<typeof createSpy>}*/
  let handler;
  /**@type {MouseEvent}*/
  let mouseEvent;
  beforeEach(function() {
    baseUrl = 'http://example.com';
    rootNode = document.createElement('div');
    linkNode = /**@type {HTMLAnchorElement}*/(document.createElement('xlink'));
    handler = createSpy();
    mouseEvent = new MouseEvent('click', { bubbles: true });
    spyOn(mouseEvent, 'preventDefault').and.callThrough();

    rootNode.appendChild(linkNode);
    linkNode.href = `${baseUrl}/foo`;
  });

  it('should add link click interceptor', function() {
    installLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expect(handler).toHaveBeenCalled();
  });

  it('should prevent default behaviour', function() {
    installLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expect(mouseEvent.preventDefault).toHaveBeenCalled();
  });

  it('should NOT prevent default behaviour if handler returns FALSE', function() {
    handler.and.returnValue(false);
    installLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expect(mouseEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should NOT intercept clicks for other origins', function() {
    linkNode.href = 'http://foo.com';
    installLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expectNotIntercepted();
  });

  it('should NOT intercept clicks if link has javascript protocol', function() {
    linkNode.href = 'javascript:void(0)';
    installLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expectNotIntercepted();
  });

  it('should NOT intercept clicks if link has mailto protocol', function() {
    linkNode.href = 'mailto:foo@foo.com';
    installLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expectNotIntercepted();
  });

  it('should NOT intercept clicks if link has target attribute', function() {
    linkNode.setAttribute('target', '_self');
    installLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    click(linkNode);

    expectNotIntercepted();
  });

  it('should NOT intercept click with pressed Ctrl or Meta or Shift or right mouse button keys', function() {
    installLinkClickInterceptor(handler, {
      rootNode: rootNode,
      baseUrl: baseUrl
    });
    [
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { button: 2 }
    ].forEach((options) => {
      click(linkNode, options);
      expectNotIntercepted();
    });
  });

  it('should take origin from base tag', function() {
    const base = document.createElement('base');
    base.href = baseUrl;
    rootNode.appendChild(base);

    installLinkClickInterceptor(handler, { rootNode: rootNode });
    click(linkNode);

    expect(handler).toHaveBeenCalled();
  });

  it('should allow add link click interceptor without config', () => {
    expect(() => installLinkClickInterceptor(() => true)).not.toThrow();
  });

  function click(/**@type {Node}*/node, /**@type {MouseEventInit}*/options) {
    mouseEvent = new MouseEvent('click', Object.assign({
      bubbles: true
    }, options));
    spyOn(mouseEvent, 'preventDefault').and.callThrough();
    linkNode.dispatchEvent(mouseEvent);
  }

  function expectNotIntercepted() {
    expect(handler).not.toHaveBeenCalled();
    expect(mouseEvent.preventDefault).not.toHaveBeenCalled();
  }
});