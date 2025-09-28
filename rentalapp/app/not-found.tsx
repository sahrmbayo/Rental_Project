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
        <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Page not found
        </h2>
        <p className="text-gray-600 mt-2">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => goBack()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
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