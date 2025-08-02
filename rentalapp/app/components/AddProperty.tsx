'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { ObjectSchema } from 'yup'; // Import the ObjectSchema type
import Layout from '../Dashboard/Layout';
import { Home, HousePlus, MapPin, Pencil } from 'lucide-react';
import { Property } from '../generated/prisma';

// 1. Define the TypeScript type first. This is our source of truth.
type PropertyFormData = {
  title: string;
  description?: string;
  price: number;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse';
  landSize?: number;
  address: string;
  area: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
};

// 2. Create the Yup schema and explicitly tell it to conform to our TypeScript type.
const propertySchema: ObjectSchema<PropertyFormData> = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  price: yup.number().transform(value => (isNaN(value) ? 0 : value)).positive('Price must be a positive number').required('Price is required'),
  propertyType: yup.string().oneOf(['apartment', 'house', 'condo', 'townhouse']).required('Property type is required'),
  landSize: yup.number().transform(value => (isNaN(value) ? 0 : value)).min(0, 'Land size cannot be negative').optional(),
  address: yup.string().required('Address is required'),
  area: yup.string().required('Area is required'),
  city: yup.string().required('City is required'),
  bedrooms: yup.number().transform(value => (isNaN(value) ? 0 : value)).integer('Bedrooms must be an integer').min(0, 'Bedrooms cannot be negative').required('Bedrooms are required'),
  bathrooms: yup.number().transform(value => (isNaN(value) ? 0 : value)).integer('Bathrooms must be an integer').min(0, 'Bathrooms cannot be negative').required('Bathrooms are required'),
});

type PropertyFormProps = {
  initialData?: Property | null;
};

export default function PropertyForm({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imageUr2, setImageUr2] = useState(initialData?.imageUr2 || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    // 3. The resolver now correctly aligns with the hook's type.
    resolver: yupResolver(propertySchema),
    defaultValues: isEditMode && initialData ? {
        ...initialData,
        price: Number(initialData.price),
        landSize: initialData.landSize ? Number(initialData.landSize) : undefined,
        propertyType: initialData.propertyType as 'apartment' | 'house' | 'condo' | 'townhouse',
    } : {
        title: '',
        description: '',
        price: 0,
        propertyType: 'apartment',
        bedrooms: 0,
        bathrooms: 0,
        address: '',
        area: '',
        city: '',
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

    // For new properties, both images are required
    if (!isEditMode && (!imageUrl || !imageUr2)) {
      alert('Please upload both images for a new property.');
      setIsSubmitting(false);
      return;
    }

    const finalData = { ...data, imageUrl, imageUr2 };

    try {
      const endpoint = isEditMode
        ? `/api/properties/${initialData?.id}` // PATCH route for editing
        : '/api/property'; // Your POST route for creating

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
      router.push('/dashboard/properties'); // Redirect to your properties list
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
    <Layout>
      <div className='flex flex-col items-center mb-4'>
        <div className='bg-gradient-to-r p-4 rounded-lg mb-2 shadow-md'>
          {isEditMode ? <Pencil className="text-blue-600 mb-2 h-8 w-8" /> : <Home className="text-blue-600 mb-2 h-8 w-8" />}
        </div>
        <h1 className="text-2xl text-blue-800 font-bold mb-2">
          {isEditMode ? 'Edit Property' : 'Add New Property'}
        </h1>
        <p className="text-gray-600 mb-4">
          {isEditMode ? 'Update the details for your property below.' : 'Fill in the details below to add a new property.'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-70% mx-auto space-y-4 p-4">
        {/* --- Property Details Section --- */}
        <div className='mb-4 outline-red-600 bg-gray-600 p-2 rounded-lg'>
          <div className='flex items-center mb-1 flex-row gap-2'>
            <HousePlus className='text-amber-300' />
            <span className='text-2xl text-blue-600'>Property Details</span>
          </div>
          <div className='mb-6'>
            <p>Basic information about your property</p>
          </div>
          <div>
            <label className="block font-medium">Property Title *</label>
            <input {...register('title')} className="w-full border p-2 rounded" />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea {...register('description')} className="w-full border p-2 rounded" />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className="block font-medium">Price *</label>
              <input type="number" step="0.01" {...register('price')} className="w-full border p-2 rounded" />
              {errors.price && <p className="text-red-500">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block font-medium">Property Type *</label>
              <select {...register('propertyType')} className="w-full border p-2 rounded">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Property Specification Section --- */}
        <div className='mb-4 outline-red-600 bg-gray-600 p-2 rounded-lg'>
          <div className='flex items-center mb-1 flex-row gap-2'>
            <HousePlus className='text-amber-300' />
            <span className='text-2xl text-blue-600'>Property Specification</span>
          </div>
          <div className='mb-6'>
            <p>Details about the property specifications</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium">Bedrooms *</label>
              <input type="number" {...register('bedrooms')} className="w-full border p-2 rounded" />
              {errors.bedrooms && <p className="text-red-500">{errors.bedrooms.message}</p>}
            </div>
            <div>
              <label className="block font-medium">Bathrooms *</label>
              <input type="number" {...register('bathrooms')} className="w-full border p-2 rounded" />
              {errors.bathrooms && <p className="text-red-500">{errors.bathrooms.message}</p>}
            </div>
            <div>
              <label className='block font-medium'>Land Size (sq ft)</label>
              <input type="number" {...register('landSize')} className='w-full border p-2 rounded' />
              {errors.landSize && <p className="text-red-500">{errors.landSize.message}</p>}
            </div>
          </div>
        </div>

        {/* --- Location Section --- */}
        <div className='mb-4 bg-gray-600 p-2 rounded-lg'>
          <div className='flex items-center mb-1 flex-row gap-2'>
            <MapPin className='text-amber-300'/>
            <span className='text-2xl text-blue-600'>Location</span>
          </div>
          <div className='mb-6'>
            <p>Property address and location details</p>
          </div>
          <div>
            <label className="block font-medium">Street Address *</label>
            <input {...register('address')} className="w-full border p-2 rounded" />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className="block font-medium">City *</label>
              <input {...register('city')} className="w-full border p-2 rounded" />
              {errors.city && <p className="text-red-500">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block font-medium">Area *</label>
              <input {...register('area')} className="w-full border p-2 rounded" />
              {errors.area && <p className="text-red-500">{errors.area.message}</p>}
            </div>
          </div>
        </div>

        {/* --- Image Upload Section --- */}
        <div className='grid grid-cols-2 gap-4'>
            <div>
                <label className="block font-medium">Upload Image 1</label>
                <input type='file' accept='image/*' onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0], setImageUrl)} className="w-full border p-2 rounded" />
                {imageUrl && <img src={imageUrl} alt="Preview 1" className="mt-2 h-24 w-auto object-cover rounded" />}
            </div>
            <div>
                <label className="block font-medium">Upload Image 2</label>
                <input type='file' accept='image/*' onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0], setImageUr2)} className="w-full border p-2 rounded" />
                {imageUr2 && <img src={imageUr2} alt="Preview 2" className="mt-2 h-24 w-auto object-cover rounded" />}
            </div>
        </div>
        
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Property' : 'Create Property')}
        </button>
      </form>
    </Layout>
  );
}