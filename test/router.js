import {default as rf, define, parser} from '../src/router';
import UrlPattern from 'url-pattern';

describe('defining routes', () => {
  it('defines a route parser', () => {

  });
});

describe('parser', () => {
  it('defines a route parser', (done) => {
    const p = parser('/foo/:id');
    p('/foo/123', node => {
      expect(node.query).to.equal('/foo/123');
      expect(node.pattern).to.equal('/foo/:id');
      done();
    });
  });

  it('returns the result of the callback', () => {
    const p = parser('/foo/:id');
    const result = p('/foo/123', () => 2);
    expect(result).to.equal(2);
  });

  it('callbacks can be used as reducers when childrens are defined', () => {
    const p = parser('/foo/:fooId', parser('/bar/:barId'));
    const reducer = (node, previous) => {
      if (!previous) {
        return 2;
      }

      return previous * 3;
    };

    const result = p('/foo/123', reducer);
    expect(result).to.equal(6);
  });

  it('allow passing an initial value for the reducer', () => {
    const p = parser('/foo/:fooId', parser('/bar/:barId'));
    const result = p('/foo/123', (node, previous) => previous * 2, 1);
    expect(result).to.equal(4);
  });

  it('can have multiple children for a node', () => {
    const p = parser('/foo/:fooId', parser('/bar/:barId'), parser('/baz/:bazId'));
    const result = p('/foo/123', (node, previous) => previous * 2, 1);
    expect(result).to.equal(8);
  });

  it('can be used to build a path by nesting children', () => {
    const p = parser('/foo/:fooId', parser('/bar/:barId', parser('/baz/:bazId')));
    const result = p('/foo/123', (node, previous) => {
      return previous + node.pattern;
    }, '');
    expect(result).to.equal('/foo/:fooId/bar/:barId/baz/:bazId');
  });

  it('can be used to build paths for multiple children', () => {
    const p = parser('/foo/:fooId', parser('/bar/:barId'), parser('/baz/:bazId'));

    const buildPath = (node) => {
      if (node.parent) {
        return buildPath(node.parent) + node.pattern;
      }

      return node.pattern;
    };

    const result = p('/foo/123', (node, previous) => {
      if (!node.children) {
        previous.push(buildPath(node));
      }

      return previous;
    }, []);
    expect(result).to.deep.equal(['/foo/:fooId/bar/:barId', '/foo/:fooId/baz/:bazId']);
  });

  it('can be used to find paths that match the query', () => {
    const p = parser('/foo/:fooId', parser('/bar/:barId'), parser('/baz/:bazId'));

    const buildPath = (node) => {
      if (node.parent) {
        return buildPath(node.parent) + node.pattern;
      }

      return node.pattern;
    };

    const result = p('/foo/123/bar/456', (node, previous) => {
      if (!node.children) {
        const pattern = new UrlPattern(buildPath(node));
        const match = pattern.match(node.query);
        if (match) {
          previous.push(match);
        }
      }

      return previous;
    }, []);
    expect(result).to.deep.equal([{fooId: '123', barId: '456'}]);
  });
});


describe('router factory', () => {
  it('puts the pattern as property on the router', () => {
    const router = rf('/foo');
    expect(router.pattern).to.equal('/foo');
  });

  describe('router.match', () => {
    it('returns parsed url values', () => {
      const router = rf('/foo/:fooId/bar/:barId');
      expect(router.match('/foo/123/bar/456')).to.deep.equal({barId: '456', fooId: '123'});
    });

    it('can compose routers', () => {
      const router = rf('/foo/:fooId', rf('/bar/:barId'));
      expect(router.match('/foo/123/bar/456')).to.deep.equal({barId: '456', fooId: '123'});
    });

    it('does not match base route if a children that does not match is defined', () => {
      const router = rf('/foo/:fooId', rf('/bar/:barId'));
      expect(router.match('/foo/123')).to.be.null();
    });

    it('can have multiple children routers', () => {
      const router = rf('/foo/:fooId', rf('/bar/:barId'), rf('/baz/:bazId'));
      expect(router.match('/foo/123/bar/456')).to.deep.equal({barId: '456', fooId: '123'});
      expect(router.match('/foo/111/baz/222')).to.deep.equal({bazId: '222', fooId: '111'});
    });

    it('can have grand childrens', () => {
      const router = rf('/foo/:fooId', rf('/bar/:barId', rf('/baz/:bazId')));
      expect(router.match('/foo/123/bar/456/baz/111')).to.deep.equal({bazId: '111', barId: '456', fooId: '123'});
    });
  });

  describe('router.toPath', () => {
    it('creates a path from an object', () => {
      const router = rf('/foo/:fooId/bar/:barId');
      const path = router.toPath({fooId: 123, barId: 456});
      expect(path).to.equal('/foo/123/bar/456');
    });

    xit('creates a path for composed routers', () => {
      const router = rf('/foo/:fooId', rf('/bar/:barId'));
      const path = router.toPath({fooId: 123, barId: 456});
      expect(path).to.equal('/foo/123/bar/456');
    });
  });
});
