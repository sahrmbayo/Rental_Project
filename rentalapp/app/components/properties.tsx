import Layout from "../Dashboard/Layout";
import { FiMapPin, FiDollarSign, FiHome } from "react-icons/fi";

const mockProperties = [
  {
    id: 1,
    name: "Sunset Villa",
    location: "Freetown",
    price: 120000,
    type: "House",
  },
  {
    id: 2,
    name: "City Apartment",
    location: "Bo",
    price: 75000,
    type: "Apartment",
  },
  {
    id: 3,
    name: "Ocean View Studio",
    location: "Lungi",
    price: 45000,
    type: "Studio",
  },
];

export default function Properties() {
  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">My Properties</h2>
        <p className="text-gray-600 text-sm">
          Manage all your active listings here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProperties.map((property) => (
          <div key={property.id} className="bg-white shadow rounded p-4 space-y-2">
            <div className="text-lg font-semibold">{property.name}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <FiMapPin /> {property.location}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <FiDollarSign /> ${property.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <FiHome /> {property.type}
            </div>
            <button className="mt-3 bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
