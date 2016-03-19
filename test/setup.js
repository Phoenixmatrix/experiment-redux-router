import {default as chai, expect} from 'chai';
import dirtyChai from 'dirty-chai';

before(() => {
  chai.use(dirtyChai);
  global.expect = expect;
});
