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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Loading
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md text-center">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">Loading details...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !homecare) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Error</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-3xl leading-none"
            >
              &times;
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{error || "Homecare details not found."}</p>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl transform transition-all duration-300 overflow-y-auto max-h-[90vh] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-bold">Homecare Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
          {/* General Information */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Homecare Name</p>
            <p className="mt-1 font-semibold">{homecare.homeCareName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Provider Name</p>
            <p className="mt-1 font-semibold">{homecare.providerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Registration Number</p>
            <p className="mt-1 font-semibold">{homecare.registrationNumber}</p>
          </div>

          {/* Image */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Homecare Image</p>
            {homecare.img ? (
              <img
                src={`data:image/png;base64,${homecare.img}`}
                alt="Homecare"
                className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <p className="mt-1 text-gray-600 dark:text-gray-400">No Image Yet</p>
            )}
          </div>

          {/* Service Type */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Service Type</p>
            <p className="mt-1 font-semibold">{homecare.serviceType}</p>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <Badge color={homecare.active ? "success" : "error"}>
              {homecare.active ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* CQC */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Regulated by CQC</p>
            <Badge color={homecare.regulatedByCQC ? "success" : "default"}>
              {homecare.regulatedByCQC ? "Yes" : "No"}
            </Badge>
          </div>

          {/* Registration Date */}
          {homecare.registrationDate && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Registration Date</p>
              <p className="mt-1 font-semibold">
                {new Date(homecare.registrationDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="col-span-full border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-2">Contact Details</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="mt-1 font-semibold">{homecare.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="mt-1 font-semibold">{homecare.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
            <a
              href={homecare.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 font-semibold text-blue-600 dark:text-blue-400 break-words"
            >
              {homecare.website || "N/A"}
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
            <p className="mt-1 font-semibold">{homecare.contactPerson || "N/A"}</p>
          </div>

          {/* Address */}
          <div className="col-span-full border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-2">Address</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Address Line 1</p>
            <p className="mt-1 font-semibold">{homecare.addressLine1}</p>
          </div>
          {homecare.addressLine2 && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Address Line 2</p>
              <p className="mt-1 font-semibold">{homecare.addressLine2}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
            <p className="mt-1 font-semibold">{homecare.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Postcode</p>
            <p className="mt-1 font-semibold">{homecare.postcode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
            <p className="mt-1 font-semibold">{homecare.country}</p>
          </div>
          {homecare.latitude && homecare.longitude && (
            <>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Latitude</p>
                <p className="mt-1 font-semibold">{homecare.latitude}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Longitude</p>
                <p className="mt-1 font-semibold">{homecare.longitude}</p>
              </div>
            </>
          )}

          {/* Notes */}
          {homecare.notes && (
            <div className="col-span-full border-t pt-4 border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
              <p className="mt-1 font-semibold">{homecare.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
