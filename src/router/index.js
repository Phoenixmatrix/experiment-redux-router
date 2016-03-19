import UrlPattern from 'url-pattern';

const combineRouters = (routers) => {
  return (path) => {
    let match = null;
    routers.some(router => (match = router.match(path)));
    return match;
  };
};

export const define = (pattern, ...childs) => {

};

export const parser = (pattern, ...children) => {
  const visitor = (query, cb, initial) => {
    const currentNode = {query, pattern};
    if (children.length) {
      currentNode.children = children;
    }
    const reduced = cb(currentNode, initial);
    return children.reduce((previous, current) => {
      return current(query, (node, prev) => {
        return cb({...node, query, parent: currentNode}, prev);
      }, previous);
    }, reduced);
  };

  return visitor;
};

export default (pattern, ...childRouters) => {
  const childrenMatcher = combineRouters(childRouters);
  const basePatternMatcher = new UrlPattern(childRouters.length ? `${pattern}*` : pattern);
  const match = (path) => {
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

  const toPath = (params) => {
    const baseParams = {...params};
    return basePatternMatcher.stringify(params);
  };

  return {
    match,
    pattern,
    toPath
  };
};
