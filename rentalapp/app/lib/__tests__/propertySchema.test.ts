import { describe, expect, it } from 'vitest';
import { ValidationError } from 'yup';
import { parsePropertyBody } from '../propertySchema';

const image = (n: number) => ({ url: `https://res.cloudinary.com/demo/image/upload/${n}.jpg`, publicId: `p${n}` });

const valid = {
  title: 'Two bedroom flat',
  price: '12000',
  propertyType: 'apartment',
  address: '12 Main St',
  area: 'Wilberforce',
  city: 'Freetown',
  bedrooms: 2,
  bathrooms: 1,
  amenities: ['WiFi'],
  images: [image(1), image(2)],
};

describe('parsePropertyBody', () => {
  it('accepts a valid body and coerces numbers', async () => {
    const data = await parsePropertyBody(valid, { requireImages: 1 });
    expect(data.price).toBe(12000);
    expect(data.amenityNames).toEqual(['WiFi']);
    expect(data.images).toHaveLength(2);
  });

  it('strips unknown fields such as agentId', async () => {
    const data = await parsePropertyBody({ ...valid, agentId: 'someone-else', isAvailable: false }, { requireImages: 1 });
    expect(data).not.toHaveProperty('agentId');
    expect(data).not.toHaveProperty('isAvailable');
  });

  it('rejects non-Cloudinary image and tour URLs', async () => {
    await expect(
      parsePropertyBody({ ...valid, images: [{ url: 'https://evil.example/x.jpg', publicId: 'x' }] }, { requireImages: 1 })
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(
      parsePropertyBody({ ...valid, virtualTours: [{ type: '3D', url: 'https://evil.example' }] }, { requireImages: 1 })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('enforces the minimum number of images', async () => {
    await expect(parsePropertyBody(valid, { requireImages: 5 })).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects unknown property types and amenities', async () => {
    await expect(parsePropertyBody({ ...valid, propertyType: 'castle' }, { requireImages: 1 })).rejects.toBeInstanceOf(
      ValidationError
    );
    await expect(parsePropertyBody({ ...valid, amenities: ['Helipad'] }, { requireImages: 1 })).rejects.toBeInstanceOf(
      ValidationError
    );
  });
});
