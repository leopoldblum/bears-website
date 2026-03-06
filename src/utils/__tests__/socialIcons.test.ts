import { socialIcons } from '../socialIcons';

describe('socialIcons', () => {
  it('contains instagram, linkedin, and youtube', () => {
    expect(Object.keys(socialIcons)).toContain('instagram');
    expect(Object.keys(socialIcons)).toContain('linkedin');
    expect(Object.keys(socialIcons)).toContain('youtube');
  });

  it('every platform has a non-empty label', () => {
    for (const icon of Object.values(socialIcons)) {
      expect(icon.label).toBeTruthy();
      expect(typeof icon.label).toBe('string');
    }
  });

  it('every platform has a non-empty SVG path', () => {
    for (const icon of Object.values(socialIcons)) {
      expect(icon.path).toBeTruthy();
      expect(typeof icon.path).toBe('string');
      // SVG paths start with M (moveTo) command
      expect(icon.path).toMatch(/^M/);
    }
  });

  it('labels are unique across platforms', () => {
    const labels = Object.values(socialIcons).map(i => i.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
