import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { getToken } from "../utils/tokens";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/button/Button";
import { showToast } from "../utils/showToast";
import ViewHomecareModal from "./ViewHomecareModal";

// Zod schema for homecare data validation
const homecareSchema = z.object({
  homeCareId: z.number().optional(),
  img: z.string().optional(),
  homeCareName: z.string().min(1, "Homecare name is required"),
  providerName: z.string().min(1, "Provider name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  serviceType: z.string().min(1, "Service type is required"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
  fullAddress: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  website: z.string().optional(),
  contactPerson: z.string().optional(),
  regulatedByCQC: z.boolean().optional(),
  registrationDate: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  active: z.boolean().optional(),
  notes: z.string().optional(),
});

export default function HomecareController() {
  const [homecares, setHomecares] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingHomecareId, setEditingHomecareId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(null);
  const [viewingHomecareId, setViewingHomecareId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(homecareSchema),
  });

  const fetchHomecares = async (page = 0) => {
    setLoading(true);
    const accessToken = getToken();
    try {
      const res = await api.get(
        `/admin/manage/homecare/search?sortBy=createdAt&pageSize=10&direction=next&page=${page}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = res.data?.data?.homeCares || [];
      const metadata = res.data?.metadata;
      setHomecares(data);
      setCurrentPage(metadata?.currentPage || 0);
      setTotalPages(metadata?.totalPages || 0);
    } catch (err) {
      console.error("Error fetching homecares:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomecares();
  }, []);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) fetchHomecares(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) fetchHomecares(currentPage - 1);
  };

  const openAddModal = () => {
    reset({}); // Reset form for new entry
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    reset({});
  };

  const handleAddHomecare = async (data) => {
    const accessToken = getToken();
    try {
      const res = await api.post(`/admin/manage/homecare/add`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      showToast(res.data.message);
      fetchHomecares(currentPage);
      closeAddModal();
    } catch (err) {
      console.error("Error adding homecare:", err);
      showToast(err.response?.data?.message || "Failed to add homecare.");
    }
  };

  const openEditModal = (homecare) => {
    setEditingHomecareId(homecare.homeCareId);
    reset(homecare);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingHomecareId(null);
    setEditModalOpen(false);
    reset({});
  };

  const handleUpdateHomecare = async (data) => {
    const accessToken = getToken();
    try {
      const payload = { ...data, homeCareId: editingHomecareId };
      const res = await api.put(`/admin/manage/homecare/update`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      showToast(res.data.message);
      fetchHomecares(currentPage);
      handleCloseEditModal();
    } catch (err) {
      console.error("Error updating homecare:", err);
    }
  };

  const handleDeleteHomecare = async (id) => {
    if (!confirm("Are you sure you want to delete this homecare item?")) return;
    const accessToken = getToken();
    try {
      await api.delete(`/admin/manage/homecare/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchHomecares(currentPage);
    } catch (err) {
      console.error("Error deleting homecare:", err);
    }
  };

  const handleUpdateStatus = async (homeCareId, status) => {
    const accessToken = getToken();
    try {
      const res = await api.put(
        `/admin/manage/homecare/status/update`,
        { homeCareId, status },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      showToast(res.data.message);
      fetchHomecares(currentPage);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const openViewModal = (homecareId) => {
    setViewingHomecareId(homecareId);
  };

  const closeViewModal = () => {
    setViewingHomecareId(null);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Homecare Services
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">See All</Button>
          <Button onClick={openAddModal}>Add New</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <h1 className="text-base font-semibold text-gray-700 animate-pulse">
              Loading data...
            </h1>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[600px] md:min-w-full">
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                  >
                    Homecare Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                  >
                    Provider Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                  >
                    Service Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                  >
                    City
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {homecares.map((homecare) => (
                  <TableRow key={homecare.homeCareId}>
                    <TableCell className="py-3 text-gray-800 dark:text-white/90">
                      {homecare.homeCareName}
                    </TableCell>
                    <TableCell className="py-3 text-gray-800 dark:text-white/90">
                      {homecare.providerName}
                    </TableCell>
                    <TableCell className="py-3 text-gray-800 dark:text-white/90">
                      {homecare.serviceType}
                    </TableCell>
                    <TableCell className="py-3 text-gray-800 dark:text-white/90">
                      {homecare.city}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        size="sm"
                        color={homecare.active ? "success" : "error"}
                      >
                        {homecare.active ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 flex gap-2 items-center">
                      <Button
                        variant="ghost"
                        onClick={() => openViewModal(homecare.homeCareId)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => openEditModal(homecare)}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteHomecare(homecare.homeCareId)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStatusMenuOpen(
                              statusMenuOpen === homecare.homeCareId
                                ? null
                                : homecare.homeCareId
                            )
                          }
                        >
                          Update Status
                        </Button>
                        {statusMenuOpen === homecare.homeCareId && (
                          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                            {["ACTIVE", "INACTIVE"].map((status) => (
                              <button
                                key={status}
                                onClick={() => {
                                  handleUpdateStatus(
                                    homecare.homeCareId,
                                    status
                                  );
                                  setStatusMenuOpen(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4 text-gray-600 dark:text-gray-400 flex-wrap gap-2">
            <div>
              Page {currentPage + 1} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={currentPage + 1 >= totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl dark:bg-gray-900 dark:text-white/90 transform transition-all duration-300 scale-100 opacity-100 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
              <h2 className="text-2xl font-bold">Add New Homecare</h2>
              <button
                onClick={closeAddModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={handleSubmit(handleAddHomecare)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Homecare Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Homecare Name *</label>
                  <input
                    type="text"
                    {...register("homeCareName")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.homeCareName ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.homeCareName && (
                    <p className="mt-1 text-xs text-red-500">{errors.homeCareName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Provider Name *</label>
                  <input
                    type="text"
                    {...register("providerName")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.providerName ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.providerName && (
                    <p className="mt-1 text-xs text-red-500">{errors.providerName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Registration Number *</label>
                  <input
                    type="text"
                    {...register("registrationNumber")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.registrationNumber ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.registrationNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.registrationNumber.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Service Type *</label>
                  <input
                    type="text"
                    {...register("serviceType")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.serviceType ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.serviceType && (
                    <p className="mt-1 text-xs text-red-500">{errors.serviceType.message}</p>
                  )}
                </div>
                {/* Contact Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Phone *</label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email *</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Password *</label>
                  <input
                    type="password"
                    {...register("password")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Website</label>
                  <input
                    type="url"
                    {...register("website")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.website ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Contact Person</label>
                  <input
                    type="text"
                    {...register("contactPerson")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.contactPerson ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                </div>
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Address Line 1 *</label>
                  <input
                    type="text"
                    {...register("addressLine1")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.addressLine1 ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1 text-xs text-red-500">{errors.addressLine1.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Address Line 2</label>
                  <input
                    type="text"
                    {...register("addressLine2")}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">City *</label>
                  <input
                    type="text"
                    {...register("city")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Postcode *</label>
                  <input
                    type="text"
                    {...register("postcode")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.postcode ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.postcode && (
                    <p className="mt-1 text-xs text-red-500">{errors.postcode.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Country *</label>
                  <input
                    type="text"
                    {...register("country")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>
                  )}
                </div>
                {/* Misc. fields */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("regulatedByCQC")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Regulated by CQC</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("active")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Active</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Registration Date</label>
                  <input
                    type="date"
                    {...register("registrationDate")}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register("latitude", { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register("longitude", { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Notes</label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                ></textarea>
              </div>

              <div className="flex justify-end mt-6 gap-2">
                <Button
                  variant="ghost"
                  onClick={closeAddModal}
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
                      ? "bg-green-400 text-white cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isSubmitting ? "Adding..." : "Add Homecare"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl dark:bg-gray-900 dark:text-white/90 transform transition-all duration-300 scale-100 opacity-100 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
              <h2 className="text-2xl font-bold">Edit Homecare</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={handleSubmit(handleUpdateHomecare)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Homecare Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Homecare Name</label>
                  <input
                    type="text"
                    {...register("homeCareName")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.homeCareName ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.homeCareName && (
                    <p className="mt-1 text-xs text-red-500">{errors.homeCareName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Provider Name</label>
                  <input
                    type="text"
                    {...register("providerName")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.providerName ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.providerName && (
                    <p className="mt-1 text-xs text-red-500">{errors.providerName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Registration Number</label>
                  <input
                    type="text"
                    {...register("registrationNumber")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.registrationNumber ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.registrationNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.registrationNumber.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Service Type</label>
                  <input
                    type="text"
                    {...register("serviceType")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.serviceType ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.serviceType && (
                    <p className="mt-1 text-xs text-red-500">{errors.serviceType.message}</p>
                  )}
                </div>
                {/* Contact Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Phone</label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Website</label>
                  <input
                    type="url"
                    {...register("website")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.website ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Contact Person</label>
                  <input
                    type="text"
                    {...register("contactPerson")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.contactPerson ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                </div>
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Address Line 1</label>
                  <input
                    type="text"
                    {...register("addressLine1")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.addressLine1 ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1 text-xs text-red-500">{errors.addressLine1.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Address Line 2</label>
                  <input
                    type="text"
                    {...register("addressLine2")}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">City</label>
                  <input
                    type="text"
                    {...register("city")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Postcode</label>
                  <input
                    type="text"
                    {...register("postcode")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.postcode ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.postcode && (
                    <p className="mt-1 text-xs text-red-500">{errors.postcode.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Country</label>
                  <input
                    type="text"
                    {...register("country")}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>
                  )}
                </div>
                {/* Misc. fields */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("regulatedByCQC")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Regulated by CQC</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("active")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Active</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Registration Date</label>
                  <input
                    type="date"
                    {...register("registrationDate")}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register("latitude", { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register("longitude", { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Notes</label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                ></textarea>
              </div>

              <div className="flex justify-end mt-6 gap-2">
                <Button
                  variant="ghost"
                  onClick={handleCloseEditModal}
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
          </div>
        </div>
      )}

      {viewingHomecareId && (
        <ViewHomecareModal homecareId={viewingHomecareId} onClose={closeViewModal} />
      )}
    </div>
  );
}