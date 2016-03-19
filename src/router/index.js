import UrlPattern from 'url-pattern';

const combineRouters = (routers) => {
  return (path) => {
    let match = null;
    routers.some(router => (match = router(path)));
    return match;
  };
};

export default (pattern, ...childRouters) => {
  const childrenMatcher = combineRouters(childRouters);
  const basePatternMatcher = new UrlPattern(childRouters.length ? `${pattern}*` : pattern);
  const router = (path) => {
    const baseMatch = basePatternMatcher.match(path);
    if (baseMatch && childRouters.length) {
      const childSplat = baseMatch._;
      delete baseMatch._;
      const childMatch = childrenMatcher(childSplat);
      if (!childMatch) {
        return null;
      }

      return {...baseMatch, ...childMatch};
    }
    return baseMatch;
  };

  router.pattern = pattern;
  return router;
};
