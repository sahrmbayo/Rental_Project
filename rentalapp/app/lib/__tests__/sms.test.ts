import { describe, expect, it } from 'vitest';
import { toE164 } from '../sms';

describe('toE164', () => {
  it('normalises Sierra Leone numbers', () => {
    expect(toE164('076 123456')).toBe('+23276123456');
    expect(toE164('76123456')).toBe('+23276123456');
    expect(toE164('232 76 123 456')).toBe('+23276123456');
    expect(toE164('+232 (76) 123-456')).toBe('+23276123456');
    expect(toE164('0023276123456')).toBe('+23276123456');
  });

  it('keeps other international numbers and rejects junk', () => {
    expect(toE164('+447700900123')).toBe('+447700900123');
    expect(toE164('123')).toBeNull();
    expect(toE164('')).toBeNull();
    expect(toE164(null)).toBeNull();
  });
});
