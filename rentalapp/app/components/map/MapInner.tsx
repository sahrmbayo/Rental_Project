'use client';

// Leaflet touches `window`, so this file is only ever loaded via next/dynamic with ssr: false.
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { useEffect } from 'react';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

const BRAND = '#148656';
const ACCENT = '#f5780b';

export type MapPin = { id: string; title: string; price: number; city: string; isAvailable: boolean; lat: number; lng: number };

function Tiles() {
  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
}

function FitToPins({ pins }: { pins: MapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    if (pins.length === 1) map.setView([pins[0].lat, pins[0].lng], 14);
    else map.fitBounds(pins.map((p) => [p.lat, p.lng] as [number, number]), { padding: [30, 30], maxZoom: 15 });
  }, [map, pins]);
  return null;
}

export function ResultsMap({ pins }: { pins: MapPin[] }) {
  return (
    <MapContainer center={[8.46, -13.23]} zoom={8} scrollWheelZoom className="isolate h-full w-full">
      <Tiles />
      <FitToPins pins={pins} />
      {pins.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={10}
          pathOptions={{ color: '#fff', weight: 2, fillColor: p.isAvailable ? BRAND : ACCENT, fillOpacity: 0.95 }}
        >
          <Popup>
            <Link href={`/properties/${p.id}`} className="font-semibold text-brand-700">{p.title}</Link>
            <br />
            NLe {p.price.toLocaleString()}/yr · {p.city}
            {!p.isAvailable && <><br /><em>Reserved</em></>}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

/** Shows a ~600 m circle around an already-offset point, never the exact address. */
export function AreaMap({ lat, lng }: { lat: number; lng: number }) {
  const center: LatLngExpression = [lat, lng];
  return (
    <MapContainer center={center} zoom={14} scrollWheelZoom={false} className="isolate h-full w-full">
      <Tiles />
      <Circle center={center} radius={600} pathOptions={{ color: BRAND, fillColor: BRAND, fillOpacity: 0.2 }} />
    </MapContainer>
  );
}

function ClickToSet({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export function PickerMap({
  value,
  fallbackCenter,
  onPick,
}: {
  value: { lat: number; lng: number } | null;
  fallbackCenter: [number, number];
  onPick: (lat: number, lng: number) => void;
}) {
  const center: [number, number] = value ? [value.lat, value.lng] : fallbackCenter;
  return (
    <MapContainer center={center} zoom={value ? 16 : 13} scrollWheelZoom className="isolate h-full w-full cursor-crosshair">
      <Tiles />
      <ClickToSet onPick={onPick} />
      {!value && <Recenter center={fallbackCenter} zoom={13} />}
      {value && (
        <CircleMarker
          center={[value.lat, value.lng]}
          radius={9}
          pathOptions={{ color: '#fff', weight: 3, fillColor: ACCENT, fillOpacity: 1 }}
        />
      )}
    </MapContainer>
  );
}
