import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../../utils/api";
import { getToken } from "../../utils/tokens";
import { showToast } from "../../utils/showToast";
import Button from "../../ui/button/Button";
import ViewHomecareModal from "./ViewHomeCareModal";
import HomecareTable from "./HomecareTable";
import AddHomecareModal from "./AddHomecareModal";
import EditHomecareModal from "./EditHomecare";

export default function HomecareController() {
  const [homecares, setHomecares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingHomecareId, setEditingHomecareId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewingHomecareId, setViewingHomecareId] = useState(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [statusFilter, setStatusFilter] = useState(""); // New state for status filter
  const debounceTimeoutRef = useRef(null);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    nextPaginationToken: null,
    prevPaginationToken: null,
    totalItems: 0,
  });

  const fetchHomecares = async (
    direction = "next",
    token = "",
    search = "",
    status = ""
  ) => {
    setError(null);
    setLoading(true);
    const accessToken = getToken();
    try {
      const res = await api.get(
        `/admin/manage/homecare/search?sortBy=createdAt&pageSize=10&direction=${direction}&paginationToken=${token}&searchTerm=${search}&status=${status}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = res.data?.data?.homeCares || [];
      const metadata = res.data?.metadata;
      setHomecares(data);
      setPagination({
        currentPage: metadata?.currentPage || 0,
        totalPages: metadata?.totalPages || 0,
        nextPaginationToken: metadata?.nextPaginationToken || null,
        prevPaginationToken: metadata?.prevPaginationToken || null,
        totalItems: metadata?.totalItems || 0,
      });
    } catch (err) {
      console.error("Error fetching homecares:", err);
      setError("Failed to fetch Home care. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchHomecares("next", "", searchTerm, statusFilter);
    }, 500);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    debouncedSearch();
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedSearch]);

  const handleNextPage = () => {
    if (pagination.nextPaginationToken) {
      fetchHomecares(
        "next",
        pagination.nextPaginationToken,
        searchTerm,
        statusFilter
      );
    }
  };

  const handlePrevPage = () => {
    if (pagination.prevPaginationToken) {
      fetchHomecares(
        "prev",
        pagination.prevPaginationToken,
        searchTerm,
        statusFilter
      );
    }
  };

  const createFormData = (data) => {
    const formData = new FormData();
    for (const key in data) {
      const value = data[key];
      if (value !== null && value !== undefined) {
        if (key === "img" && value[0] instanceof File) {
          formData.append(key, value[0]);
        } else if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
        } else if (key !== "img" && value !== "") {
          formData.append(key, value);
        }
      }
    }
    return formData;
  };

  const handleAddHomecare = async (data) => {
    const accessToken = getToken();
    const formData = createFormData(data);
    try {
      const res = await api.post(`/admin/manage/homecare/add`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showToast(res.data.message);
      fetchHomecares("next", null, searchTerm, statusFilter); // Reset pagination on add
      setAddModalOpen(false);
    } catch (err) {
      console.error("Error adding homecare:", err);
      showToast(
        err.response?.data?.message || "Failed to add homecare.",
        "error"
      );
    }
  };

  const handleUpdateHomecare = async (data) => {
    const accessToken = getToken();
    const formData = new FormData();
    formData.append("homeCareId", editingHomecareId);

    for (const key in data) {
      if (
        key !== "img" &&
        key !== "password" &&
        data[key] !== null &&
        data[key] !== undefined
      ) {
        if (typeof data[key] === "boolean") {
          formData.append(key, data[key] ? "true" : "false");
        } else {
          formData.append(key, data[key]);
        }
      }
    }
    const newImageFile = data.img && data.img.length > 0 ? data.img[0] : null;
    if (newImageFile instanceof File) {
      formData.append("img", newImageFile);
    }

    try {
      const res = await api.put(`/admin/manage/homecare/update`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showToast(res.data.message);
      fetchHomecares("next", pagination.prevPaginationToken, searchTerm, statusFilter);
      setEditModalOpen(false);
      setEditingHomecareId(null);
    } catch (err) {
      console.error("Error updating homecare:", err);
      showToast(
        err.response?.data?.message || "Failed to update homecare.",
        "error"
      );
    }
  };

  const handleDeleteHomecare = async (id) => {
    if (!confirm("Are you sure you want to delete this homecare item?")) return;
    const accessToken = getToken();
    try {
      await api.delete(`/admin/manage/homecare/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      showToast("Homecare deleted successfully.");
      fetchHomecares("next", null, searchTerm, statusFilter); // Reset pagination on delete
    } catch (err) {
      console.error("Error deleting homecare:", err);
      showToast(
        err.response?.data?.message || "Failed to delete homecare.",
        "error"
      );
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
      fetchHomecares("next", pagination.prevPaginationToken, searchTerm, statusFilter);
    } catch (err) {
      console.error("Error updating status:", err);
      showToast(
        err.response?.data?.message || "Failed to update status.",
        "error"
      );
    }
  };

  const openViewModal = (homecareId) => setViewingHomecareId(homecareId);
  const closeViewModal = () => setViewingHomecareId(null);
  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);
  const openEditModal = (homecareId) => {
    setIsFetchingEditData(true);
    setEditingHomecareId(homecareId);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditingHomecareId(null);
    setEditModalOpen(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <h1 className="text-base font-semibold text-gray-700 animate-pulse">
              Loading data...
            </h1>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-lg text-red-600 dark:text-red-400 font-medium">
            Error: {error}
          </p>
        </div>
      );
    }

    if (homecares.length === 0) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            No homecare requests available. 📋
          </p>
        </div>
      );
    }

    return (
      <>
        <HomecareTable
          homecares={homecares}
          openViewModal={openViewModal}
          openEditModal={openEditModal}
          handleDeleteHomecare={handleDeleteHomecare}
          handleUpdateStatus={handleUpdateStatus}
          statusMenuOpen={statusMenuOpen}
          setStatusMenuOpen={setStatusMenuOpen}
        />
        <div className="flex justify-between items-center mt-4 text-gray-600 dark:text-gray-400 flex-wrap gap-2">
          <div>
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePrevPage}
              disabled={!pagination.prevPaginationToken}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={!pagination.nextPaginationToken}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Homecare Services
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search homecare..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          <Button onClick={openAddModal}>Add New</Button>
        </div>
      </div>
      {renderContent()}
      {addModalOpen && (
        <AddHomecareModal
          onClose={closeAddModal}
          onSubmit={handleAddHomecare}
        />
      )}
      {editModalOpen && (
        <EditHomecareModal
          homecareId={editingHomecareId}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateHomecare}
          isFetchingData={isFetchingEditData}
          setIsFetchingData={setIsFetchingEditData}
        />
      )}
      {viewingHomecareId && (
        <ViewHomecareModal
          homecareId={viewingHomecareId}
          onClose={closeViewModal}
        />
      )}
    </div>
  );
}