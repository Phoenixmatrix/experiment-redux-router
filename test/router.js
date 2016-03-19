import rf from '../src/router';

describe('router factory', () => {
  it('returns a function when called with a route', () => {
    const router = rf('/');
    expect(router).to.be.a('function');
  });

  it('puts the pattern as property on the router', () => {
    const router = rf('/foo');
    expect(router.pattern).to.equal('/foo');
  });

  describe('router', () => {
    it('returns parsed url values', () => {
      const router = rf('/foo/:fooId/bar/:barId');
      expect(router('/foo/123/bar/456')).to.deep.equal({barId: '456', fooId: '123'});
    });

    it('can compose routers', () => {
      const router = rf('/foo/:fooId', rf('/bar/:barId'));
      expect(router('/foo/123/bar/456')).to.deep.equal({barId: '456', fooId: '123'});
    });

    it('does not match base route if a children that does not match is defined', () => {
      const router = rf('/foo/:fooId', rf('/bar/:barId'));
      expect(router('/foo/123')).to.be.null();
    });

    it('can have multiple children routers', () => {
      const router = rf('/foo/:fooId', rf('/bar/:barId'), rf('/baz/:bazId'));
      expect(router('/foo/123/bar/456')).to.deep.equal({barId: '456', fooId: '123'});
      expect(router('/foo/111/baz/222')).to.deep.equal({bazId: '222', fooId: '111'});
    });

    it('can have grand childrens', () => {
      const router = rf('/foo/:fooId', rf('/bar/:barId', rf('/baz/:bazId')));
      expect(router('/foo/123/bar/456/baz/111')).to.deep.equal({bazId: '111', barId: '456', fooId: '123'});
    });
  });
});
