import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { getToken } from "../utils/tokens";
import Badge from "../ui/badge/Badge";

export default function ViewHomecareModal({ homecareId, onClose }) {
  const [homecare, setHomecare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!homecareId) return;

    const fetchHomecare = async () => {
      setLoading(true);
      setError(null);
      const accessToken = getToken();
      try {
        const res = await api.get(`/admin/manage/homecare/${homecareId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setHomecare(res.data.data);
      } catch (err) {
        console.error("Error fetching homecare details:", err);
        setError("Failed to load homecare details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomecare();
  }, [homecareId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md dark:bg-gray-900 dark:text-white/90 text-center">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p>Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !homecare) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md dark:bg-gray-900 dark:text-white/90">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Error</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">&times;</button>
          </div>
          <p>{error || "Homecare details not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl dark:bg-gray-900 dark:text-white/90 transform transition-all duration-300 scale-100 opacity-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-bold">Homecare Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            &times;
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
          {/* General Information */}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Homecare Name</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.homeCareName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Provider Name</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.providerName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Number</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.registrationNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Type</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.serviceType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">
              <Badge color={homecare.active ? "success" : "error"}>
                {homecare.active ? "Active" : "Inactive"}
              </Badge>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Regulated by CQC</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">
              <Badge color={homecare.regulatedByCQC ? "success" : "default"}>
                {homecare.regulatedByCQC ? "Yes" : "No"}
              </Badge>
            </p>
          </div>
          {homecare.registrationDate && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Date</p>
              <p className="mt-1 font-semibold text-gray-800 dark:text-white">{new Date(homecare.registrationDate).toLocaleDateString()}</p>
            </div>
          )}
          
          {/* Contact Information */}
          <div className="col-span-full border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-2">Contact Details</h3>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</p>
            <p className="mt-1 font-semibold text-blue-600 dark:text-blue-400 truncate">
              <a href={homecare.website} target="_blank" rel="noopener noreferrer">{homecare.website || "N/A"}</a>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.contactPerson || "N/A"}</p>
          </div>

          {/* Location Information */}
          <div className="col-span-full border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-2">Address</h3>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address Line 1</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.addressLine1}</p>
          </div>
          {homecare.addressLine2 && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address Line 2</p>
              <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.addressLine2}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">City</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.city}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Postcode</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.postcode}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</p>
            <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.country}</p>
          </div>
          {homecare.latitude && homecare.longitude && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Latitude</p>
                <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.latitude}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Longitude</p>
                <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.longitude}</p>
              </div>
            </>
          )}
          
          {homecare.notes && (
            <div className="col-span-full border-t pt-4 border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</p>
              <p className="mt-1 font-semibold text-gray-800 dark:text-white">{homecare.notes}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}