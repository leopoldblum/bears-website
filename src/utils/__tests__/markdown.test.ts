import { markdownToHtml } from '../markdown';

describe('markdownToHtml', () => {
  it('converts bold text to <strong>', async () => {
    const html = await markdownToHtml('**bold**');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('converts italic text to <em>', async () => {
    const html = await markdownToHtml('*italic*');
    expect(html).toContain('<em>italic</em>');
  });

  it('converts links to <a> tags', async () => {
    const html = await markdownToHtml('[click](https://example.com)');
    expect(html).toContain('<a href="https://example.com">click</a>');
  });

  it('converts unordered lists', async () => {
    const html = await markdownToHtml('- item one\n- item two');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>item one</li>');
    expect(html).toContain('<li>item two</li>');
  });

  it('supports GFM tables', async () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |';
    const html = await markdownToHtml(md);
    expect(html).toContain('<table>');
    expect(html).toContain('<td>1</td>');
  });

  it('supports GFM strikethrough', async () => {
    const html = await markdownToHtml('~~deleted~~');
    expect(html).toContain('<del>deleted</del>');
  });

  it('passes through inline HTML', async () => {
    const html = await markdownToHtml('text <span class="x">inner</span> more');
    expect(html).toContain('<span class="x">inner</span>');
  });

  it('handles empty string', async () => {
    const html = await markdownToHtml('');
    expect(html).toBe('');
  });

  it('returns a string', async () => {
    const result = markdownToHtml('hello');
    expect(result).toBeInstanceOf(Promise);
    expect(typeof (await result)).toBe('string');
  });

  it('handles multiple paragraphs', async () => {
    const html = await markdownToHtml('First paragraph\n\nSecond paragraph');
    expect(html).toContain('<p>First paragraph</p>');
    expect(html).toContain('<p>Second paragraph</p>');
  });
});
