// app/setup-phone/page.tsx
"use client";

import { useState } from "react";

export default function SetupPhone() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/setup-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      } else {
        // Redirect to dashboard/home
        window.location.href = "/Dashboard";
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-lg font-bold mb-4">Add your phone number</h1>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          required
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Phone"}
        </button>
      </form>
    </div>
  );
}
