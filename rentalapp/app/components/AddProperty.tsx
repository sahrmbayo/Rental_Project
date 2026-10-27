'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';

import {
  HousePlus,
  MapPin,
  Camera,
  Pencil,
  Minus,
  Plus,
  Check,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Property } from '../generated/prisma';
import DashboardLayout from '../Dashboard/DashboardLayout';
import {
  AMENITIES,
  CITIES,
  IMAGE_SLOTS,
  PROPERTY_TYPES,
  propertySchema,
  type ImageAsset,
  type PropertyFormData,
  type VirtualTour,
} from '../lib/propertySchema';
import { uploadToCloudinary } from '../lib/uploadClient';
import { compressImage } from '../lib/compressImage';
import { CITY_CENTERS, PickerMap } from './map';

type SourceProperty = Property & { amenities?: { name: string }[] };

type PropertyFormProps = {
  initialData?: SourceProperty | null;
  /** Prefills a new listing from an existing one ("Duplicate"); photos are not copied. */
  template?: SourceProperty | null;
};

function initialSlots(initialData: PropertyFormProps['initialData']): (ImageAsset | null)[] {
  const existing = (initialData?.images as ImageAsset[] | null) ?? [];
  const length = Math.max(IMAGE_SLOTS.length, existing.length);
  return Array.from({ length }, (_, i) => existing[i] ?? null);
}

export default function PropertyFormPage({ initialData, template }: PropertyFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const source = initialData ?? template;

  const [slots, setSlots] = useState<(ImageAsset | null)[]>(() => initialSlots(initialData));
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadingTour, setUploadingTour] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: yupResolver(propertySchema),
    defaultValues:
      source
        ? {
            title: template && !initialData ? `${source.title} (copy)` : source.title,
            description: source.description ?? '',
            price: Number(source.price),
            propertyType: source.propertyType as PropertyFormData['propertyType'],
            landSize: source.landSize ? Number(source.landSize) : undefined,
            address: source.address,
            city: source.city,
            area: source.area,
            bedrooms: source.bedrooms,
            bathrooms: source.bathrooms,
            electricity: source.electricity ?? false,
            virtualTours: initialData ? ((source.virtualTours as VirtualTour[] | null) ?? []) : [],
            amenities: source.amenities?.map((a) => a.name) ?? [],
            latitude: source.latitude,
            longitude: source.longitude,
          }
        : {
            propertyType: 'apartment',
            electricity: false,
            virtualTours: [],
            amenities: [],
            bedrooms: 0,
            bathrooms: 0,
          },
  });

  const uploadSlot = async (index: number, file: File) => {
    setUploadingSlot(index);
    try {
      const asset = await uploadToCloudinary(await compressImage(file), 'image');
      setSlots((prev) => prev.map((s, i) => (i === index ? asset : s)));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setUploadingSlot(null);
    }
  };

  const clearSlot = (index: number) => setSlots((prev) => prev.map((s, i) => (i === index ? null : s)));

  const moveSlot = (index: number, direction: -1 | 1) =>
    setSlots((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const uploadTour = async (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const is3D = /\.(glb|gltf)$/i.test(file.name);
    const type: VirtualTour['type'] = isVideo ? 'video' : is3D ? '3D' : '2D';

    setUploadingTour(true);
    try {
      const { url } = await uploadToCloudinary(file, isVideo ? 'tour-video' : 'tour');
      setValue('virtualTours', [...(watch('virtualTours') ?? []), { type, url }]);
    } catch (error) {
      console.error('Tour upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Tour upload failed');
    } finally {
      setUploadingTour(false);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    const images = slots.filter((s): s is ImageAsset => !!s);
    const required = isEditMode ? 1 : IMAGE_SLOTS.length;
    if (images.length < required) {
      toast.error(isEditMode ? 'A property needs at least one image.' : 'Please upload all 5 images for a new property.');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = isEditMode ? `/api/properties/${initialData?.id}` : '/api/property';
      const res = await fetch(endpoint, {
        method: isEditMode ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit property');
      }

      toast.success(`Property ${isEditMode ? 'updated' : 'created'} successfully ✅`);
      router.push('/Dashboard/properties');
      router.refresh();
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const amenities = watch('amenities') ?? [];
  const tours = watch('virtualTours') ?? [];
  const lat = watch('latitude');
  const lng = watch('longitude');
  const location = lat != null && lng != null ? { lat, lng } : null;

  return (
    <DashboardLayout
      headerTitle={isEditMode ? 'Edit Property' : template ? 'Duplicate Property' : 'Add New Property'}
      headerSubtitle={
        isEditMode
          ? 'Update the details for your property below. Saving also confirms the listing is still available.'
          : template
            ? 'Details are copied from your other listing. Add photos for this one.'
            : 'Fill in the details to list a new property.'
      }
      currentPage="add-property"
    >
      <div className="flex h-screen bg-gray-50 font-sans">
        <main className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Property Details */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <HousePlus className="h-6 w-6 text-brand-600" />
                <h2 className="text-lg font-semibold text-gray-800">Property Details</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">Basic information about your property.</p>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Property Title *</label>
                  <input {...register('title')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-gray-700" />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea {...register('description')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (NLe per year) *</label>
                  <input type="number" step="1" {...register('price')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-gray-700" />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Type *</label>
                  <select {...register('propertyType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-gray-700">
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>}
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <input
                    id="electricity"
                    type="checkbox"
                    {...register('electricity')}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="electricity" className="text-sm font-medium text-gray-700">
                    Electricity available
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Specifications */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Pencil className="h-6 w-6 text-brand-600" />
                <h2 className="text-lg font-semibold text-gray-800">Specifications</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">Details about the property features.</p>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms *</label>
                  <div className="inline-flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Fewer bedrooms"
                      onClick={() => setValue('bedrooms', Math.max(0, Number(watch('bedrooms')) - 1))}
                      className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                    >
                      <Minus className="h-4 w-4 text-gray-700" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg text-gray-700">{watch('bedrooms')}</span>
                    <button
                      type="button"
                      aria-label="More bedrooms"
                      onClick={() => setValue('bedrooms', Number(watch('bedrooms')) + 1)}
                      className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                    >
                      <Plus className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bathrooms *</label>
                  <input type="number" {...register('bathrooms')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-gray-700" />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Land Size (sq ft)</label>
                  <input type="number" {...register('landSize')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-gray-700" />
                  {errors.landSize && <p className="mt-1 text-sm text-red-600">{errors.landSize.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Location */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-brand-600" />
                <h2 className="text-lg font-semibold text-gray-800">Location</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">Property address details.</p>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Street Address *</label>
                  <input {...register('address')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-gray-700" />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City *</label>
                  <select {...register('city')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-gray-700">
                    <option value="">Select a city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Area *</label>
                  <input {...register('area')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-gray-700" />
                  {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Pin on map (optional)</label>
                    {location && (
                      <button
                        type="button"
                        onClick={() => {
                          setValue('latitude', null);
                          setValue('longitude', null);
                        }}
                        className="btn btn-ghost btn-sm"
                      >
                        Clear pin
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Tap the property&apos;s location. Tenants only see the approximate area until they reserve.
                  </p>
                  <div className="mt-2 h-72 overflow-hidden rounded-2xl border border-gray-200">
                    <PickerMap
                      value={location}
                      fallbackCenter={CITY_CENTERS[watch('city')] ?? CITY_CENTERS.Freetown}
                      onPick={(lat, lng) => {
                        setValue('latitude', Number(lat.toFixed(6)));
                        setValue('longitude', Number(lng.toFixed(6)));
                      }}
                    />
                  </div>
                  {(errors.latitude || errors.longitude) && (
                    <p className="mt-1 text-sm text-red-600">{errors.latitude?.message || errors.longitude?.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Images */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Camera className="h-6 w-6 text-brand-600" />
                <h2 className="text-lg font-semibold text-gray-800">Images</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {isEditMode
                  ? 'Replace, remove or reorder photos. The first photo is the cover.'
                  : 'Upload a photo for each slot. Use the arrows to choose which photo is the cover.'}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {slots.map((slot, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">
                      {IMAGE_SLOTS[index] ?? `Extra photo ${index - IMAGE_SLOTS.length + 1}`}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingSlot !== null}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadSlot(index, file);
                        e.target.value = '';
                      }}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100 disabled:opacity-50"
                    />
                    {uploadingSlot === index && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                      </p>
                    )}
                    {slot && (
                      <div className="relative mt-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={slot.url} alt={`Preview ${index + 1}`} className="h-32 w-full rounded-md object-cover" />
                        {index === 0 && (
                          <span className="absolute top-1 left-1 rounded-full bg-accent-500 px-2 py-0.5 text-xs font-semibold text-white">Cover</span>
                        )}
                        <button
                          type="button"
                          onClick={() => clearSlot(index)}
                          aria-label="Remove image"
                          className="absolute top-1 right-1 rounded-full bg-white/90 p-1 text-red-600 shadow hover:bg-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-1 right-1 flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveSlot(index, -1)}
                            disabled={index === 0}
                            aria-label="Move photo earlier"
                            className="rounded-full bg-white/90 p-1 text-gray-700 shadow hover:bg-white disabled:opacity-40"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSlot(index, 1)}
                            disabled={index === slots.length - 1}
                            aria-label="Move photo later"
                            className="rounded-full bg-white/90 p-1 text-gray-700 shadow hover:bg-white disabled:opacity-40"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Amenities */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Pencil className="h-6 w-6 text-brand-600" />
                <h2 className="text-lg font-semibold text-gray-800">Amenities</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">Select amenities available in the property.</p>

              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => {
                  const active = amenities.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() =>
                        setValue('amenities', active ? amenities.filter((x) => x !== a) : [...amenities, a])
                      }
                      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm border transition-colors ${
                        active
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {active && <Check className="h-4 w-4" />}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 6: Virtual Tours */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Camera className="h-6 w-6 text-brand-600" />
                <h2 className="text-lg font-semibold text-gray-800">Virtual Tours</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Upload 2D, 3D or video walkthroughs.</p>

              <label className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50 ${uploadingTour ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}>
                <input
                  type="file"
                  accept="image/*,video/*,.glb,.gltf"
                  className="hidden"
                  disabled={uploadingTour}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadTour(file);
                    e.target.value = '';
                  }}
                />
                {uploadingTour && <Loader2 className="h-4 w-4 animate-spin" />}
                <span className="text-sm text-gray-700">{uploadingTour ? 'Uploading…' : 'Upload tour'}</span>
              </label>

              {tours.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {tours.map((t, idx) => (
                    <div key={idx} className="relative rounded-lg border p-2">
                      {t.type === 'video' ? (
                        <video src={t.url} controls className="h-32 w-full rounded object-cover" />
                      ) : t.type === '2D' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.url} alt="Tour preview" className="h-32 w-full rounded object-cover" />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center rounded bg-gray-100 text-sm text-gray-600">3D model</div>
                      )}
                      <button
                        type="button"
                        onClick={() => setValue('virtualTours', tours.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 rounded bg-white/80 px-2 py-0.5 text-xs text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || uploadingSlot !== null || uploadingTour}
                className="btn btn-primary btn-lg"
              >
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Property' : 'Create Property'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </DashboardLayout>
  );
}
