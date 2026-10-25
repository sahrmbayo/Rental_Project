// app/not-found.tsx
'use client'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import Header from './components/header'

export default function NotFound() {
    function goBack() {
        if (typeof window !== 'undefined') {
            window.history.back()
        }
    }
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-7xl font-extrabold tracking-tight text-brand-600">4<span className="text-accent-500">0</span>4</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Page not found
        </h2>
        <p className="text-gray-600 mt-2">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn btn-primary btn-lg"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => goBack()}
            className="btn btn-outline btn-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
    </>
  )
}