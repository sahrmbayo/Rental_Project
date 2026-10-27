'use client';

import dynamic from 'next/dynamic';

const loading = () => <div className="h-full w-full animate-pulse rounded-2xl bg-gray-100" />;

export const ResultsMap = dynamic(() => import('./MapInner').then((m) => m.ResultsMap), { ssr: false, loading });
export const AreaMap = dynamic(() => import('./MapInner').then((m) => m.AreaMap), { ssr: false, loading });
export const PickerMap = dynamic(() => import('./MapInner').then((m) => m.PickerMap), { ssr: false, loading });

export type { MapPin } from './MapInner';

export const CITY_CENTERS: Record<string, [number, number]> = {
  Freetown: [8.4657, -13.2317],
  Bo: [7.9647, -11.7383],
  Kenema: [7.8767, -11.1875],
  Makeni: [8.8833, -12.05],
};
