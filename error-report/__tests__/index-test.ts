import {
  chromeRegex,
  firefoxRegex,
  getChromeStackArray,
  getFirefoxStackArray,
} from '../src/index';
import {
  fixtureChromeStack,
  getChromeStackArrayExpected,
  chromeErrorStackItem,
  fixtureFirefoxStack,
  getFireFoxStackArrayExpected,
  firefoxErrorStackItem,
} from './constant';

describe('parse Error', () => {
  describe('parse Chrome Error', () => {
    it('chrome regex can get currect data when item is correct', () => {
      const result = chromeRegex.exec(chromeErrorStackItem);
      if (result !== null) {
        expect(result.slice(2, 5)).toEqual([
          'http://192.168.31.8:8000/c.js',
          '2',
          '9',
        ]);
      } else {
        fail('suppose to be success, but got null');
      }
    });
    it('getChromeStackArray can solve fixtureChromeStack', () => {
      const result = getChromeStackArray(fixtureChromeStack);
      expect(result).toEqual(getChromeStackArrayExpected);
    });
  });
  describe('parse Firefox Error', () => {
    it('firefox regex can get currect data when item is correct', () => {
      const result = firefoxRegex.exec(firefoxErrorStackItem);
      if (result !== null) {
        expect(result.slice(2, 5)).toEqual([
          'http://192.168.31.8:8000/c.js',
          '2',
          '9',
        ]);
      } else {
        fail('suppose to be success, but got null');
      }
    });
    it('getChromeStackArray can solve fixtureChromeStack', () => {
      const result = getFirefoxStackArray(fixtureFirefoxStack);
      expect(result).toEqual(getFireFoxStackArrayExpected);
    });
  });
});
