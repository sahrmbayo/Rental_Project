import React from "react";
import { FiHome, FiUser, FiPlusCircle, FiList } from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md h-screen p-4 hidden md:block">
      <div className="text-xl font-bold mb-8 flex items-center gap-2">
        <span className="bg-teal-500 text-white p-2 rounded-md">🏠</span>
        PropPulse
      </div>
      <nav className="space-y-4 text-gray-600 font-medium">
        <a href="#" className="flex items-center gap-2 hover:text-teal-600">
          <FiHome /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-teal-600">
          <FiUser /> Profile
        </a>
        <a href="/add-property" className="flex items-center gap-2 hover:text-teal-600">
            <FiPlusCircle /> Add Property
        </a>

        <a href="/properties" className="flex items-center gap-2 hover:text-teal-600">
            <FiList /> My Properties
        </a>

      </nav>
    </aside>
  );
};

export default Sidebar;
