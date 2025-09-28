"use client";

import { useState } from "react";

type Property = {
  id: string;
  title: string;
  city: string;
  price: number;
  isAvailable: boolean;
};

export default function LatestProperties({ initialProps }: { initialProps: Property[] }) {
  const [props, setProps] = useState<Property[]>(initialProps);

  async function toggleAvailability(id: string) {
    try {
      const res = await fetch("/admin/toggle-property", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to toggle property");

      const updated = await res.json();

      setProps((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isAvailable: updated.isAvailable } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ul className="divide-y">
      {props.map((p) => (
        <li key={p.id} className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-gray-900">{p.title}</p>
            <p className="text-sm text-gray-500">
              {p.city} · NLe{p.price.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => toggleAvailability(p.id)}
            className={`rounded px-3 py-1 text-xs font-medium ${
              p.isAvailable
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {p.isAvailable ? "Block" : "Unblock"}
          </button>
        </li>
      ))}
    </ul>
  );
}