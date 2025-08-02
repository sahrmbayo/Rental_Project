"use client";
import Layout from "./Layout";
import StatCard from "../components/StatCard";
import { FiDatabase, FiUsers, FiTrendingUp } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Link } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const handleClick = (check) => {
    if (check==1) {
      router.push("/Dashboard/add-property");
    }
    if (check==2){
      router.push("/Dashboard/properties");
    }
    
  };
  
  return (
    <Layout>
      <div className="text-2xl font-semibold mb-4 flex justify-center text-green-800">Welcome to PropPulse</div>
      <p className="text-gray-600 mb-6 flex justify-center">
        Manage your properties with ease. Track listings, monitor performance, and grow your real estate portfolio.
      </p>

      <div  className="flex gap-4 mb-6 flex-wrap justify-center">
        <button onClick={()=>handleClick(1)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add New Property
        </button>

        <button onClick={()=>handleClick(2)} className="bg-white border px-4 py-2 rounded hover:bg-gray-100" >
          View Properties
        </button>
      
      </div>

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center" >
        <StatCard
          title="Total Properties"
          value="12"
          icon={<FiDatabase />}
          subtitle="Active listings"
        />
        <StatCard
          title="New Inquiries"
          value="8"
          icon={<FiUsers />}
          subtitle="This week"
        />
        <StatCard
          title="Revenue"
          value="$24,500"
          icon={<FiTrendingUp />}
          subtitle="This month"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li>
            <a href="" className="hover:text-teal-600">
              ➕ Add a New Property
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-teal-600">
              🗂 View Property List
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-teal-600">
              👤 Update Profile
            </a>
          </li>
        </ul>
        </div>

            {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <ul className="text-sm text-gray-700 space-y-3">
                  <li>📬 3 new inquiries received</li>
                  <li>🏠 Property “Sunset Villa” added</li>
                  <li>💰 Monthly revenue updated</li>
                </ul>
              </div>
          </div>

      </div>
    </Layout>
  );
}
