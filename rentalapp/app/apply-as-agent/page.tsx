'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import BackToHomeButton from '../components/BackToHomeButton';
import Header from '../components/header';

export default function ApplyAsAgent() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    yearsExperience: '',
    message: '',
    website: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/agent-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
        <>
        <Header />
      <div className="min-h-screen flex items-center justify-center px-6 flex-col bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Application sent!</h2>
          <p className="text-slate-600 mt-2">We’ll review it and get back to you soon.</p>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
            <div>
                <p className="text-center text-xs text-slate-400 mt-6">
                    Please feel free to reach out to us at <a href="mailto:salonetechdepot@gmail.com" className="text-brand-500 hover:underline">salonetechdepot@gmail.com</a> Or Call: <a href="tel:+23275088079" className="text-brand-500 hover:underline">+1 (232) 750-88079</a> if you have any questions or need further assistance.
                </p>
            </div>
            <BackToHomeButton variant="home" />
        </div>
      </div>
        </>
        
    );
  }

  return (
    <><Header />
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Partner with us
          </h1>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Join our curated network of rental pros. Fill in the basics and we’ll reach out within 24 h.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot for bots: hidden from people and screen readers */}
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="fullName"
                placeholder="Full name"
                onChange={handleChange}
                required
                className="text-gray-700 w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                onChange={handleChange}
                required
                className="text-gray-700 w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone number"
                onChange={handleChange}
                required
                className="text-gray-700 w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name="yearsExperience"
                type="number"
                min="0"
                placeholder="Years of experience"
                onChange={handleChange}
                required
                className="text-gray-700 w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <textarea
              name="message"
              placeholder="Why do you want to partner with us?"
              onChange={handleChange}
              rows={4}
              className="text-gray-700 w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full md:w-auto"
            >
              {loading ? 'Sending…' : 'Send application'}
            </button>
          </form>
        </div>

        {/* Trust badges / micro-copy */}
        <p className="text-center text-xs text-slate-400 mt-6">
          We respect your privacy and won&apos;t share your details with anyone.
        </p>
      </div>
    </div>
    </>
  );
}