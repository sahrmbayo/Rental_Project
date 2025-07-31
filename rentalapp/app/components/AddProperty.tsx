'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from '../Dashboard/Layout';
import {Home, HousePlus, MapPin } from "lucide-react"





const propertySchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  price: yup.number().positive('Price must be a positive number').required('Price is required'),
  propertyType: yup.string().oneOf(['apartment', 'house', 'condo', 'townhouse'], 'Invalid property type').required('Property type is required'),
  landSize: yup.number().integer('Enter a number').min(0, 'land size cannot be nagative'),
  address: yup.string().required('Location is required'),
  area: yup.string().required('Location is required'),
  city: yup.string().required('City is required'),
  bedrooms: yup.number().integer('Bedrooms must be an integer').min(0, 'Bedrooms cannot be negative').required('Bedrooms are required'),
  bathrooms: yup.number().integer('Bathrooms must be an integer').min(0, 'Bathrooms cannot be negative').required('Bathrooms are required'),
  imageUrl: yup.string().optional(),
  imageUr2: yup.string().optional(),
  // agentId: yup.string().required('Agent ID is required'),
});

type PropertyFormData ={
  title: string;
  description: string | "";
  price: number;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse';
  landSize: number;
  address: string;
  city: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string | "";
  imageUr2: string | "";
  // agentId: string;
};

export default function PropertyForm() {
  
  const [imageUrl, setImageUrl] = useState('');
  const [imageUr2, setImageUr2] = useState('');

  //img uploadr
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
    }
  };
};


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PropertyFormData>({
    resolver: yupResolver(propertySchema),
  });

  // onSubmit function
  const onSubmit = async (data: PropertyFormData) => {
  if (!imageUrl || !imageUr2) {
    alert('Please upload both images before submitting');
    return;
  }

  const finalData = {
    ...data,
    imageUrl,
    imageUr2,
  };

  try {
    const res = await fetch('/api/property', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData),
    });

    if (!res.ok) throw new Error('Failed to submit property');

    const result = await res.json();
    alert('Property submitted successfully ✅');
    console.log(result);

    reset();
    setImageUrl('');
    setImageUr2('');
  } catch (error) {
    console.error('Error submitting property:', error);
    alert('Something went wrong while submitting the property ❌');
  }
};



  return (
    <Layout>
      <div className='flex flex-col items-center mb-4'>
        <div className='bg-gradient-to-r p-4 rounded-lg mb-2 shadow-md'>
          <Home className=" text-blue-600 mb-2 h-8 w-8" />
        </div>
        
        <h1 className="text-2xl text-blue-800 font-bold mb-2">Add New Property</h1>
        <p className="text-gray-600 mb-4">Fill in the details below to add a new property.</p>
      </div>
      
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-70% mx-auto space-y-4 p-4">
      <div className='mb-4 outline-red-600 bg-gray-600 p-2 rounded-lg'>
        <div className='flex items-center mb-1 flex-row gap-2'>
          <HousePlus className='text-amber-300' />
          <span className='text-2xl text-blue-600'>Property Details</span>
        </div>
        <div className='mb-6'>
          <p>Basic infomation about your property</p>
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
        <label className="block font-medium">Price</label>
        <input type="number" step="0.01" {...register('price')} className="w-full border p-2 rounded" />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>
      <div>
        <label className="block font-medium">Property Type</label>
        <select {...register('propertyType')} className="w-full border p-2 rounded">
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="townhouse">Townhouse</option>
        </select>
      </div>
      </div>
      </div>
      {/* specification */}
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
          <label className="block font-medium">Bedrooms</label>
          <input type="number" {...register('bedrooms')} className="w-full border p-2 rounded" />
          {errors.bedrooms && <p className="text-red-500">{errors.bedrooms.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Bathrooms</label>
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
      {/* Location */}
      
      <div className='mb-4 bg-gray-600 p-2 rounded-lg'>
        <div className='flex items-center mb-1 flex-row gap-2'>
          <MapPin className='text-amber-300'/>
          <span className='text-2xl text-blue-600'>Location</span>
        </div>
        <div className='mb-6'>
          <p>Property address and location details</p>
        </div>

        <div>
          <label className="block font-medium">Street Address</label>
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
          <label className="block font-medium">Area</label>
          <input {...register('area')} className="w-full border p-2 rounded" />
          {errors.area && <p className="text-red-500">{errors.area.message}</p>}
        </div>
        </div>
      </div>


      

     <div className='grid grid-cols-2 gap-4'>
  <div>
    <label className="block font-medium">Upload Image 1</label>
    <input
      type='file'
      accept='image/*'
      onChange={(e) => {
        if (e.target.files?.[0]) {
          uploadToCloudinary(e.target.files[0], setImageUrl);
        }
      }}
      className="w-full border p-2 rounded"
    />
    {imageUrl && <p className="text-green-600 text-sm mt-1">Image 1 uploaded ✅</p>}
  </div>

  <div>
    <label className="block font-medium">Upload Image 2</label>
    <input
      type='file'
      accept='image/*'
      onChange={(e) => {
        if (e.target.files?.[0]) {
          uploadToCloudinary(e.target.files[0], setImageUr2);
        }
      }}
      className="w-full border p-2 rounded"
    />
    {imageUr2 && <p className="text-green-600 text-sm mt-1">Image 2 uploaded ✅</p>}
  </div>
</div>


      {/* <div>
        <label className="block font-medium">Agent ID</label>
        <input {...register('agentId')} className="w-full border p-2 rounded" />
        {errors.agentId && <p className="text-red-500">{errors.agentId.message}</p>}
      </div> */}

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Submit Property
      </button>
    </form>
    </Layout>
  );
}
