import { getCategoryLabel, categoryLabels } from '../categoryLabels';

describe('categoryLabels map', () => {
  it('has 7 entries', () => {
    expect(Object.keys(categoryLabels)).toHaveLength(7);
  });
});

describe('getCategoryLabel', () => {
  describe('known event categories', () => {
    it.each([
      ['trade-fairs-and-conventions', 'Trade Fairs & Conventions'],
      ['competitions-and-workshops', 'Competitions & Workshops'],
      ['kick-off-events', 'Kick-off Events'],
    ])('maps "%s" to "%s"', (input, expected) => {
      expect(getCategoryLabel(input)).toBe(expected);
    });
  });

  describe('known project categories', () => {
    it.each([
      ['experimental-rocketry', 'Experimental Rocketry'],
      ['science-and-experiments', 'Science & Experiments'],
      ['robotics', 'Robotics'],
    ])('maps "%s" to "%s"', (input, expected) => {
      expect(getCategoryLabel(input)).toBe(expected);
    });
  });

  it('maps shared "other" category', () => {
    expect(getCategoryLabel('other')).toBe('Other');
  });

  describe('fallback title-casing', () => {
    it('title-cases unknown kebab-case string', () => {
      expect(getCategoryLabel('foo-bar')).toBe('Foo Bar');
    });

    it('title-cases single word', () => {
      expect(getCategoryLabel('misc')).toBe('Misc');
    });

    it('title-cases multi-segment string', () => {
      expect(getCategoryLabel('a-b-c-d')).toBe('A B C D');
    });

    it('handles empty string', () => {
      expect(getCategoryLabel('')).toBe('');
    });
  });
});
