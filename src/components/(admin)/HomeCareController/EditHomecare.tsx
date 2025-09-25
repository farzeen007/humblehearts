import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../utils/api";
import { getToken } from "../../utils/tokens";
import { showToast } from "../../utils/showToast";
import Button from "../../ui/button/Button";
import { XCircleIcon } from "@heroicons/react/24/solid";

// Zod schema for validation (Assuming this schema is correct and stable)
const homecareSchema = z.object({
  homeCareId: z.number().optional(),
  img: z.any().optional(),
  imgUrl: z.string().nullish(),
  homeCareName: z.string().min(1, "Homecare name is required"),
  providerName: z.string().min(1, "Provider name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  serviceType: z.string().min(1, "Service type is required"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().nullish(),
  city: z.string().min(1, "City is required"),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .regex(
      /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0AA)$/i,
      "Postcode must be a valid UK format (e.g. SW1A 1AA)"
    ),
  country: z
    .string()
    .min(1, "Country is required")
    .refine(
      (value) =>
        ["UK", "Scotland", "Wales", "Northern Ireland", "England"].includes(
          value
        ),
      "Country must be UK or one of its regions"
    ),
  fullAddress: z.string().nullish(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+44|0)7\d{9}$/,
      "Phone must be a valid UK mobile number (e.g. +447912345678 or 07123456789)"
    ),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
  website: z.string().nullish(),
  contactPerson: z.string().nullish(),
  regulatedByCQC: z.boolean().optional(),
  registrationDate: z.string().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  active: z.boolean().optional(),
  notes: z.string().nullish(),
});

export default function EditHomecareModal({ homecareId, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(homecareSchema),
  });

  const [loading, setLoading] = useState(true);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const watchImg = watch("img");

  useEffect(() => {
    if (!homecareId) return;

    let isMounted = true; // Flag to prevent state updates on unmounted component
    setLoading(true);
    setEditImagePreview(null); // Reset preview on new fetch

    const fetchHomecareData = async () => {
      const accessToken = getToken();
      try {
        const res = await api.get(`/admin/manage/homecare/${homecareId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const fetchedData = res.data.data;
        console.log(fetchedData);
        if (fetchedData.registrationDate) {
          fetchedData.registrationDate = new Date(fetchedData.registrationDate)
            .toISOString()
            .split("T")[0];
        }

        if (isMounted) {
          reset(fetchedData);
          setEditImagePreview(fetchedData.imgUrl || null);
        }
      } catch (err) {
        console.error("Error fetching homecare details for edit:", err);
        showToast(
          err.response?.data?.message || "Failed to fetch homecare details.",
          "error"
        );
        if (isMounted) {
          onClose();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHomecareData();

    return () => {
      isMounted = false;
    };
  }, [homecareId, reset, onClose]); // Now the dependency array is more stable.

  useEffect(() => {
    const file = watchImg && watchImg.length > 0 ? watchImg[0] : null; // If a new file is selected, create a new preview

    if (file instanceof File) {
      const newPreview = URL.createObjectURL(file);
      setEditImagePreview(newPreview);
      return () => URL.revokeObjectURL(newPreview);
    } // If no file is selected but a blob URL exists, clear it
    else if (editImagePreview && editImagePreview.startsWith("blob:")) {
      setEditImagePreview(null);
    }
}, [watchImg]); // Correct dependency: only watchImg

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 pt-0 w-full max-w-4xl dark:bg-gray-900 dark:text-white/90 transform transition-all duration-300 scale-100 opacity-100 relative my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between pt-2 items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Edit Homecare
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors absolute top-1 right-4"
            aria-label="Close modal"
          >
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Homecare Name *
                </label>
                <input
                  type="text"
                  {...register("homeCareName")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.homeCareName ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.homeCareName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.homeCareName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Provider Name *
                </label>
                <input
                  type="text"
                  {...register("providerName")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.providerName ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.providerName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.providerName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Registration Number *
                </label>
                <input
                  type="text"
                  {...register("registrationNumber")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.registrationNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.registrationNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.registrationNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Service Type *
                </label>
                <input
                  type="text"
                  {...register("serviceType")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.serviceType ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.serviceType && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.serviceType.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Homecare Image
                </label>
                {editImagePreview && (
                  <div className="mt-2 mb-4">
                    <img
                      src={editImagePreview}
                      alt="Current Homecare"
                      className="w-32 h-32 object-cover rounded-md shadow-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  {...register("img")}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Phone *
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Email *
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Website
                </label>
                <input
                  type="url"
                  {...register("website")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.website ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Contact Person
                </label>
                <input
                  type="text"
                  {...register("contactPerson")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.contactPerson ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  {...register("addressLine1")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.addressLine1 ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.addressLine1.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Address Line 2
                </label>
                <input
                  type="text"
                  {...register("addressLine2")}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  City *
                </label>
                <input
                  type="text"
                  {...register("city")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Postcode *
                </label>
                <input
                  type="text"
                  {...register("postcode")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.postcode ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.postcode && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.postcode.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Country *
                </label>
                <input
                  type="text"
                  {...register("country")}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  } shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.country && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("regulatedByCQC")}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Regulated by CQC
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("active")}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Active
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Registration Date
                </label>
                <input
                  type="date"
                  {...register("registrationDate")}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("latitude", { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("longitude", { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Notes
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-end mt-8 gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                type="button"
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className={`transition-all duration-200 ${
                  isSubmitting
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSubmitting ? "Updating..." : "Update Homecare"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
