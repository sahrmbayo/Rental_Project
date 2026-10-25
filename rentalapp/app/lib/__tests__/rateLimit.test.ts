import { describe, expect, it } from 'vitest';
import { rateLimit } from '../rateLimit';

describe('rateLimit', () => {
  it('allows up to the limit within the window, then blocks', () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 2, 1000, 0)).toBe(true);
    expect(rateLimit(key, 2, 1000, 10)).toBe(true);
    expect(rateLimit(key, 2, 1000, 20)).toBe(false);
  });

  it('allows again once the window has passed', () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 1, 1000, 0)).toBe(true);
    expect(rateLimit(key, 1, 1000, 500)).toBe(false);
    expect(rateLimit(key, 1, 1000, 1500)).toBe(true);
  });
});
