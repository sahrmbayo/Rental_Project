'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { ObjectSchema } from 'yup';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  Settings,
  Bell,
  User,
  Menu,
  X,
  HousePlus,
  MapPin,
  Camera,
  Pencil,
} from 'lucide-react';
import { Property } from '../generated/prisma'; // Make sure this import path is correct for your project
import { UserButton } from '@clerk/nextjs';
import DashboardLayout from '../Dashboard/DashboardLayout';
// --- Type Definition ---
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

// --- Validation Schema ---
const propertySchema: ObjectSchema<PropertyFormData> = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  price: yup.number().transform(v => (isNaN(v) ? 0 : v)).positive('Price must be a positive number').required('Price is required'),
  propertyType: yup.string().oneOf(['apartment', 'house', 'condo', 'townhouse']).required('Property type is required'),
  landSize: yup.number().transform(v => (isNaN(v) ? 0 : v)).min(0, 'Land size cannot be negative').optional(),
  address: yup.string().required('Address is required'),
  area: yup.string().required('Area is required'),
  city: yup.string().required('City is required'),
  bedrooms: yup.number().transform(v => (isNaN(v) ? 0 : v)).integer('Bedrooms must be an integer').min(0).required('Bedrooms are required'),
  bathrooms: yup.number().transform(v => (isNaN(v) ? 0 : v)).integer('Bathrooms must be an integer').min(0).required('Bathrooms are required'),
});

// --- Main Component ---
type PropertyFormProps = {
  initialData?: Property | null;
};

export default function PropertyFormPage({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imageUr2, setImageUr2] = useState(initialData?.imageUr2 || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: yupResolver(propertySchema),
    defaultValues: isEditMode && initialData ? {
        ...initialData,
        price: Number(initialData.price),
        landSize: initialData.landSize ? Number(initialData.landSize) : undefined,
        propertyType: initialData.propertyType as 'apartment' | 'house' | 'condo' | 'townhouse',
    } : {
        propertyType: 'apartment',
    },
  });

  // --- FIXED: Restored your image upload function ---
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

  // --- FIXED: Restored your form submission function ---
  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    if (!isEditMode && (!imageUrl || !imageUr2)) {
      alert('Please upload both images for a new property.');
      setIsSubmitting(false);
      return;
    }

    const finalData = { ...data, imageUrl, imageUr2 };

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

  
  // const SidebarContent = () => (
  //   <div className="flex h-full flex-col">
  //     <div className="mb-10 flex items-center justify-between space-x-2">
  //       <div className='flex items-center space-x-2'>
  //         <Building className="h-8 w-8 text-blue-600" />
  //       <span className="text-xl font-bold text-gray-800">Sl Rental</span>
  //       </div>
  //       <div>
  //         <UserButton />
  //       </div>
  //     </div>

  //     <nav className="flex-grow space-y-2">
  //       <Link href="/dashboard" className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100">
  //         <LayoutDashboard className="h-5 w-5" />
  //         <span className="font-medium">Dashboard</span>
  //       </Link>
  //       <Link href="/dashboard/properties" className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100">
  //         <Building className="h-5 w-5" />
  //         <span className="font-medium">My Properties</span>
  //       </Link>
  //       <Link href="/dashboard/add-property" className="flex items-center space-x-3 rounded-lg bg-blue-100 px-4 py-2.5 text-blue-700">
  //         <PlusCircle className="h-5 w-5" />
  //         <span className="font-medium">Add Property</span>
  //       </Link>
  //     </nav>
  //     <div>
  //       <Link href="#" className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100">
  //         <Settings className="h-5 w-5" />
  //         <span className="font-medium">Settings</span>
  //       </Link>
  //     </div>
  //   </div>
  // );

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
                  <input {...register('title')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea {...register('description')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price *</label>
                  <input type="number" step="0.01" {...register('price')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Type *</label>
                  <select {...register('propertyType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedrooms *</label>
                  <input type="number" {...register('bedrooms')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bathrooms *</label>
                  <input type="number" {...register('bathrooms')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Land Size (sq ft)</label>
                  <input type="number" {...register('landSize')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
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
                        <input {...register('address')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City *</label>
                        <input {...register('city')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Area *</label>
                        <input {...register('area')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
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
                <p className="mt-1 text-sm text-gray-500">Upload two images of your property.</p>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image 1</label>
                        <input type='file' accept='image/*' onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0], setImageUrl)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"/>
                        {imageUrl && <img src={imageUrl} alt="Preview 1" className="mt-4 h-32 w-full rounded-md object-cover" />}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image 2</label>
                        <input type='file' accept='image/*' onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0], setImageUr2)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"/>
                        {imageUr2 && <img src={imageUr2} alt="Preview 2" className="mt-4 h-32 w-full rounded-md object-cover" />}
                    </div>
                </div>
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
