import * as yup from 'yup';

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'single', label: 'Single Room' },
  { value: 'office', label: 'Office Space' },
  { value: 'shop', label: 'Shop' },
  { value: 'compound', label: 'Compound' },
] as const;

export const CITIES = ['Freetown', 'Bo', 'Kenema', 'Makeni'] as const;

export const AMENITIES = [
  'WiFi',
  'Parking',
  'Air-conditioning',
  'Pet-friendly',
  'Pool',
  'Gym',
  'Security',
  'Water-supply',
  'Electricity',
] as const;

export const IMAGE_SLOTS = ['Front View', 'Master Bedroom', 'Kitchen', 'Master Bathroom', 'Living Room'] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number]['value'];
export type ImageAsset = { url: string; publicId: string };
export type VirtualTour = { type: '2D' | '3D' | 'video'; url: string; caption?: string };

export type PropertyFormData = {
  title: string;
  description?: string;
  price: number;
  propertyType: PropertyType;
  landSize?: number;
  address: string;
  area: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  electricity: boolean;
  virtualTours: VirtualTour[];
  amenities: string[];
  latitude?: number | null;
  longitude?: number | null;
};

/** Rough bounding box of Sierra Leone, to catch pins dropped in the wrong country. */
export const SL_BOUNDS = { minLat: 6.85, maxLat: 10.05, minLng: -13.4, maxLng: -10.2 };

const toNumber = (v: unknown) => (typeof v === 'number' && isNaN(v) ? undefined : v);

const cloudinaryUrl = yup
  .string()
  .required()
  .test('cloudinary', 'Must be a Cloudinary URL', (v) => !!v && v.startsWith('https://res.cloudinary.com/'));

// Cast because yup can't infer required nested fields while tsconfig has `strict: false`.
export const propertySchema = yup.object({
  title: yup.string().trim().max(120).required('Title is required'),
  description: yup.string().max(5000).optional(),
  price: yup.number().transform(toNumber).positive('Price must be positive').required('Price required'),
  propertyType: yup
    .mixed<PropertyType>()
    .oneOf(PROPERTY_TYPES.map((t) => t.value))
    .required('Type required'),
  landSize: yup.number().transform(toNumber).min(0).optional(),
  address: yup.string().trim().max(200).required('Address required'),
  area: yup.string().trim().max(100).required('Area required'),
  city: yup.string().oneOf([...CITIES], 'Select a city').required('City required'),
  bedrooms: yup.number().transform(toNumber).integer().min(0).max(50).required('Bedrooms required'),
  bathrooms: yup.number().transform(toNumber).integer().min(0).max(50).required('Bathrooms required'),
  electricity: yup.boolean().default(false),
  virtualTours: yup
    .array(
      yup.object({
        type: yup.mixed<VirtualTour['type']>().oneOf(['2D', '3D', 'video']).required(),
        url: cloudinaryUrl,
        caption: yup.string().max(200).optional(),
      })
    )
    .max(10)
    .default([]),
  amenities: yup.array(yup.string().oneOf([...AMENITIES]).required()).default([]),
  latitude: yup
    .number()
    .transform(toNumber)
    .nullable()
    .min(SL_BOUNDS.minLat, 'Location must be in Sierra Leone')
    .max(SL_BOUNDS.maxLat, 'Location must be in Sierra Leone')
    .optional(),
  longitude: yup
    .number()
    .transform(toNumber)
    .nullable()
    .min(SL_BOUNDS.minLng, 'Location must be in Sierra Leone')
    .max(SL_BOUNDS.maxLng, 'Location must be in Sierra Leone')
    .optional(),
}) as unknown as yup.ObjectSchema<PropertyFormData>;

export const imagesSchema = yup
  .array(yup.object({ url: cloudinaryUrl, publicId: yup.string().required() }))
  .max(20)
  .default([]);

/** Server-side parse of a create/update request body. Throws yup.ValidationError on bad input. */
export async function parsePropertyBody(body: unknown, { requireImages }: { requireImages: number }) {
  const raw = (body ?? {}) as Record<string, unknown>;
  const data = await propertySchema.validate(raw, { stripUnknown: true, abortEarly: false });
  const images = (await imagesSchema.validate(raw.images ?? [])) as ImageAsset[];
  if (images.length < requireImages) {
    throw new yup.ValidationError(`At least ${requireImages} images are required`);
  }
  return {
    title: data.title,
    description: data.description ?? '',
    price: Math.round(data.price),
    propertyType: data.propertyType,
    landSize: Math.round(data.landSize ?? 0),
    address: data.address,
    city: data.city,
    area: data.area,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    electricity: !!data.electricity,
    virtualTours: data.virtualTours,
    images,
    amenityNames: data.amenities,
    latitude: data.latitude != null && data.longitude != null ? data.latitude : null,
    longitude: data.latitude != null && data.longitude != null ? data.longitude : null,
  };
}
