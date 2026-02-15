import { getCategoryLabel, categoryLabels } from '../i18n';

describe('categoryLabels map', () => {
  it('has entries for both locales', () => {
    expect(Object.keys(categoryLabels.en).length).toBeGreaterThan(0);
    expect(Object.keys(categoryLabels.de).length).toBeGreaterThan(0);
  });

  it('has same keys in both locales', () => {
    expect(Object.keys(categoryLabels.en).sort()).toEqual(
      Object.keys(categoryLabels.de).sort()
    );
  });
});

describe('getCategoryLabel', () => {
  describe('English labels', () => {
    it.each([
      ['trade-fairs-and-conventions', 'Trade Fairs & Conventions'],
      ['competitions-and-workshops', 'Competitions & Workshops'],
      ['experimental-rocketry', 'Experimental Rocketry'],
      ['science-and-experiments', 'Science & Experiments'],
      ['robotics', 'Robotics'],
    ])('maps "%s" to "%s"', (input, expected) => {
      expect(getCategoryLabel(input, 'en')).toBe(expected);
    });
  });

  describe('German labels', () => {
    it.each([
      ['competitions-and-workshops', 'Wettbewerbe & Workshops'],
      ['experimental-rocketry', 'Experimentelle Raketentechnik'],
      ['robotics', 'Robotik'],
    ])('maps "%s" to "%s"', (input, expected) => {
      expect(getCategoryLabel(input, 'de')).toBe(expected);
    });
  });

  describe('fallback', () => {
    it('returns the raw key for unknown categories', () => {
      expect(getCategoryLabel('foo-bar', 'en')).toBe('foo-bar');
    });

    it('handles empty string', () => {
      expect(getCategoryLabel('', 'en')).toBe('');
    });
  });
});
