'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { ObjectSchema } from 'yup';

import {
  HousePlus,
  MapPin,
  Camera,
  Pencil,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import { Property } from '../generated/prisma'; // Make sure this import path is correct for your project
import DashboardLayout from '../Dashboard/DashboardLayout';
// --- Type Definition ---
type PropertyFormData = {
  title: string;
  description?: string;
  price: number;
  propertyType: 'apartment' | 'house' | 'single' | 'office' | 'shop' | 'compound';
  landSize?: number;
  address: string;
  area: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  electricity: boolean; // NEW
  virtualTours: { type: '2D' | '3D' | 'video'; url: string; caption?: string }[]; // NEW
  amenities: string[]; // NEW
};

// --- Validation Schema ---
const propertySchema: ObjectSchema<PropertyFormData> = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  price: yup.number().transform(v => (isNaN(v) ? 0 : v)).positive('Price must be positive').required('Price required'),
  propertyType: yup.string().oneOf(['apartment', 'house', 'single', 'office', 'shop', 'compound']).required('Type required'),
  landSize: yup.number().transform(v => (isNaN(v) ? 0 : v)).min(0).optional(),
  address: yup.string().required('Address required'),
  area: yup.string().required('Area required'),
  city: yup.string().required('City required'),
  bedrooms: yup.number().integer().min(0).required('Bedrooms required'),
  bathrooms: yup.number().integer().min(0).required('Bathrooms required'),
  // NEW fields — no Yup rules for now
  electricity: yup.boolean(),
  virtualTours: yup.array().optional(),
  amenities: yup.array().of(yup.string()).optional(),
});
// --- Main Component ---
type PropertyFormProps = {
  initialData?: Property | null;
};

export default function PropertyFormPage({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
 
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imageUr2, setImageUr2] = useState(initialData?.imageUr2 || '');
  const [imageUr3, setImageUr3] = useState(initialData?.imageUr3 || '');
  const [imageUr4, setImageUr4] = useState(initialData?.imageUr4 || '');
  const [imageUr5, setImageUr5] = useState(initialData?.imageUr5 || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: yupResolver(propertySchema),
   defaultValues: isEditMode && initialData
  ? {
      ...initialData,
      price: Number(initialData.price),
      landSize: initialData.landSize ? Number(initialData.landSize) : undefined,
      propertyType: initialData.propertyType as 'apartment' | 'house' | 'single' | 'office' | 'shop' | 'compound',
      electricity: initialData.electricity ?? false,
      virtualTours: (initialData.virtualTours as PropertyFormData['virtualTours']) ?? [],
      amenities: (initialData as any)?.amenities?.map((a: any) => a.name) ?? [],
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

  
  const uploadToCloudinary = async (file: File, setUrl: (url: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await res.json();
        setUrl(data.url);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Image upload failed.');
      }
    };
  };

 
  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    if (!isEditMode && (!imageUrl || !imageUr2 || !imageUr3 || !imageUr4 || !imageUr5)) {
      alert('Please upload all images for a new property.');
      setIsSubmitting(false);
      return;
    }

    const finalData = {
  ...data,
  imageUrl,
  imageUr2,
  imageUr3,
  imageUr4,
  imageUr5,
  electricity: data.electricity, // NEW
  virtualTours: watch('virtualTours'), // NEW
  amenities: watch('amenities'), // NEW
};

    try {
      const endpoint = isEditMode
        ? `/api/properties/${initialData?.id}`
        : '/api/property';

      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit property');
      }

      alert(`Property ${isEditMode ? 'updated' : 'created'} successfully ✅`);
      router.push('/Dashboard/properties');
      router.refresh();
    

    } catch (error) {
      console.error('Error submitting property:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Something went wrong: ${errorMessage} ❌`);
    } finally {
      setIsSubmitting(false);
    }
  };

 
  return (
    <DashboardLayout
      headerTitle={isEditMode ? 'Edit Property' : 'Add New Property'}
      headerSubtitle={isEditMode ? 'Update the details for your property below.' : 'Fill in the details to list a new property.'}
      currentPage="add-property"
      >
    <div className="flex h-screen bg-gray-50 font-sans">
      

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* <div className="p-4 md:p-8"> */}
         
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Property Details */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <HousePlus className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Property Details</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">Basic information about your property.</p>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Property Title *</label>
                  <input {...register('title')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700" />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea {...register('description')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price *</label>
                  <input type="number" step="0.01" {...register('price')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700" />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Type *</label>
                  <select {...register('propertyType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700">
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="single">Single Room</option>
                    <option value="office">Office Space</option>
                    <option value="shop">Shop</option>
                    <option value="compound">Compound</option>
                  </select>
                  {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>}
                </div>
                {/* Electricity toggle */}
                <div className="flex items-center gap-3 mt-4">
                  <input
                    id="electricity"
                    type="checkbox"
                    {...register('electricity')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                <Pencil className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Specifications</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">Details about the property features.</p>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Bedrooms counter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms *</label>
                  <div className="inline-flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setValue('bedrooms', Math.max(0, Number(watch('bedrooms')) - 1))}
                      className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{watch('bedrooms')}</span>
                    <button
                      type="button"
                      onClick={() => setValue('bedrooms', Number(watch('bedrooms')) + 1)}
                      className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>}
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bathrooms *</label>
                  <input type="number" {...register('bathrooms')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700" />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>}
                </div>

                {/* Land Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Land Size (sq ft)</label>
                  <input type="number" {...register('landSize')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700" />
                  {errors.landSize && <p className="mt-1 text-sm text-red-600">{errors.landSize.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Location */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                 <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Location</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">Property address details.</p>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Street Address *</label>
                        <input {...register('address')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700" />
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City *</label>
                        <select {...register('city')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700">
                            <option value="">Select a city</option>
                            <option value="Freetown">Freetown</option>
                            <option value="Bo">Bo</option>
                            <option value="Kenema">Kenema</option>
                            <option value="Makeni">Makeni</option>
                        </select>
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Area *</label>
                        <input {...register('area')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700" />
                        {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>}
                    </div>
                </div>
            </div>

            {/* Section 4: Images */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <Camera className="h-6 w-6 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Images</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">Upload all images of your property.</p>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Front View</label>
                        <input type='file' accept='image/*' onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0], setImageUrl)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"/>
                        {imageUrl && <img src={imageUrl} alt="Preview 1" className="mt-4 h-32 w-full rounded-md object-cover" />}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Master Bedroom</label>
                        <input type='file' accept='image/*' onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0], setImageUr2)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"/>
                        {imageUr2 && <img src={imageUr2} alt="Preview 2" className="mt-4 h-32 w-full rounded-md object-cover" />}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Kitchen</label>
                        <input type='file' accept='image/*' onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0], setImageUr3)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"/>
                        {imageUr3 && <img src={imageUr3} alt="Preview 3" className="mt-4 h-32 w-full rounded-md object-cover" />}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Master Bathroom</label>
                        <input type='file' accept='image/*' onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0], setImageUr4)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"/>
                        {imageUr4 && <img src={imageUr4} alt="Preview 4" className="mt-4 h-32 w-full rounded-md object-cover" />}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Living Room</label>
                        <input type='file' accept='image/*' onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0], setImageUr5)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"/>
                        {imageUr5 && <img src={imageUr5} alt="Preview 2" className="mt-4 h-32 w-full rounded-md object-cover" />}
                    </div>
                </div>
            </div>
            {/* Section 6: Amenities */}
<div className="rounded-xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-3 mb-4">
    <Pencil className="h-6 w-6 text-blue-600" />
    <h2 className="text-lg font-semibold text-gray-800">Amenities</h2>
  </div>
  <p className="text-sm text-gray-500 mb-3">Select amenities available in the property.</p>

  <div className="flex flex-wrap gap-2">
    {['WiFi', 'Parking', 'Air-conditioning', 'Pet-friendly', 'Pool', 'Gym', 'Security', 'Water-supply', 'Electricity'].map((a) => {
      const active = watch('amenities')?.includes(a);
      return (
        <button
          key={a}
          type="button"
          onClick={() =>
            setValue(
              'amenities',
              active
                ? watch('amenities').filter((x) => x !== a)
                : [...(watch('amenities') || []), a]
            )
          }
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm border transition-colors ${
            active
              ? 'border-blue-600 bg-blue-50 text-blue-700'
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
            {/* Section 5: Virtual Tours */}
<div className="rounded-xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-3 mb-4">
    <Camera className="h-6 w-6 text-blue-600" />
    <h2 className="text-lg font-semibold text-gray-800">Virtual Tours</h2>
  </div>
  <p className="text-sm text-gray-500 mb-4">Upload 2D, 3D or video walkthroughs.</p>

  <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border px-4 py-2 hover:bg-gray-50">
    <input
      type="file"
      accept="image/*,video/*,.glb,.gltf"
      className="hidden"
      onChange={async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // decide type from MIME or extension
  const isVideo = file.type.startsWith('video/');
  const is3D   = file.name.endsWith('.glb') || file.name.endsWith('.gltf');
  const type: '2D' | '3D' | 'video' = isVideo ? 'video' : is3D ? '3D' : '2D';

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async () => {
    const res = await fetch('/api/upload-tour', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: reader.result, type }),
    });
    const data = await res.json();
    if (data.url) {
      setValue('virtualTours', [...watch('virtualTours'), { type, url: data.url }]);
    } else {
      alert('Upload failed: ' + data.error);
    }
  };
}}
    />
    <span className="text-sm text-gray-700">Upload tour</span>
  </label>

  {watch('virtualTours')?.length > 0 && (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {watch('virtualTours').map((t, idx) => (
        <div key={idx} className="relative rounded-lg border p-2">
          {t.type === 'video' ? (
            <video src={t.url} controls className="h-32 w-full rounded object-cover" />
          ) : (
            <iframe src={t.url} allowFullScreen className="h-32 w-full rounded" />
          )}
          <button
            type="button"
            onClick={() => setValue('virtualTours', watch('virtualTours').filter((_, i) => i !== idx))}
            className="absolute top-1 right-1 rounded bg-white/80 px-2 py-0.5 text-xs text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )}
</div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:bg-gray-400">
                {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Property' : 'Create Property')}
              </button>
            </div>
          </form>
        {/* </div> */}
      </main>
    </div>
    </DashboardLayout>
  );
}
