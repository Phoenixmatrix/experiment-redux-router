export default (state = {}, action) => {
  switch (action.type) {
  case 'NAVIGATE_TO':
    return {screen: action.payload};
  default:
    return state;
  }
};
