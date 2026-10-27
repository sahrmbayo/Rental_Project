import { describe, expect, it } from 'vitest';
import {
  approximateLocation,
  buildPropertyOrderBy,
  buildPropertyWhere,
  describeSearch,
  listingExpiryCutoff,
  pickSearchParams,
} from '../listings';

const now = new Date('2026-10-26T12:00:00Z');

describe('pickSearchParams', () => {
  it('keeps known string params and drops the rest', () => {
    expect(pickSearchParams({ city: 'Bo', page: '2', view: 'map', q: '  flat ', bedrooms: ['2'] })).toEqual({ city: 'Bo', q: 'flat' });
  });
});

describe('buildPropertyWhere', () => {
  it('always hides rented and expired listings', () => {
    const where = buildPropertyWhere({}, now);
    expect(where.AND).toEqual([{ rentedAt: null, confirmedAt: { gte: listingExpiryCutoff(now) } }]);
  });

  it('handles "up to" and "at least" prices', () => {
    expect(buildPropertyWhere({ price: '25000' }, now).AND).toContainEqual({ price: { lte: 25000 } });
    expect(buildPropertyWhere({ price: '50000+' }, now).AND).toContainEqual({ price: { gte: 50000 } });
  });

  it('ignores junk numbers', () => {
    const where = buildPropertyWhere({ price: 'abc', bedrooms: '2.5' }, now);
    expect(where.AND).toHaveLength(1);
  });
});

describe('buildPropertyOrderBy', () => {
  it('defaults to newest', () => {
    expect(buildPropertyOrderBy()).toEqual([{ postedAt: 'desc' }]);
    expect(buildPropertyOrderBy('price_asc')[0]).toEqual({ price: 'asc' });
  });
});

describe('describeSearch', () => {
  it('summarises filters in plain English', () => {
    expect(describeSearch({ bedrooms: '2', type: 'apartment', city: 'Freetown', price: '25000' })).toBe(
      '2 bed apartment in Freetown, up to NLe 25,000'
    );
  });
});

describe('approximateLocation', () => {
  it('moves the point 300-600 m, deterministically', () => {
    const a = approximateLocation('abc123', 8.48, -13.23);
    const b = approximateLocation('abc123', 8.48, -13.23);
    expect(a).toEqual(b);
    const km = Math.hypot((a.lat - 8.48) * 111, (a.lng + 13.23) * 111 * Math.cos((8.48 * Math.PI) / 180));
    expect(km).toBeGreaterThan(0.29);
    expect(km).toBeLessThan(0.61);
  });
});
