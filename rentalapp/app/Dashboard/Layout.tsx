"use client";
import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import { FiMenu } from "react-icons/fi";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-white shadow-md transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:static md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-gray-700">
            <FiMenu />
          </button>
          <div className="font-semibold text-lg">PropPulse</div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Layout;
