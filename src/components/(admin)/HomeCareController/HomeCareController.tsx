import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { getToken } from "../../utils/tokens";
import { showToast } from "../../utils/showToast";
import Button from "../../ui/button/Button";
import ViewHomecareModal from "./ViewHomeCareModal";
import HomecareTable from "./HomecareTable";
import HomecarePagination from "./HomecarePagination";
import AddHomecareModal from "./AddHomecareModal";
import EditHomecareModal from "./EditHomecare";

export default function HomecareController() {
    const [homecares, setHomecares] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editingHomecareId, setEditingHomecareId] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    // 👇 The state is already defined here
    const [isFetchingEditData, setIsFetchingEditData] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [viewingHomecareId, setViewingHomecareId] = useState(null);
    const [statusMenuOpen, setStatusMenuOpen] = useState(null);

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

    const createFormData = (data) => {
        const formData = new FormData();
        for (const key in data) {
            const value = data[key];
            if (value !== null && value !== undefined) {
                if (key === 'img' && value[0] instanceof File) {
                    formData.append(key, value[0]);
                } else if (typeof value === "boolean") {
                    formData.append(key, value ? "true" : "false");
                } else if (key !== 'img' && value !== '') {
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
            fetchHomecares(currentPage);
            setAddModalOpen(false);
        } catch (err) {
            console.error("Error adding homecare:", err);
            showToast(err.response?.data?.message || "Failed to add homecare.", "error");
        }
    };

    const handleUpdateHomecare = async (data) => {
        const accessToken = getToken();
        const formData = new FormData();
        formData.append("homeCareId", editingHomecareId);

        for (const key in data) {
            if (key !== "img" && key !== "password" && data[key] !== null && data[key] !== undefined) {
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
            fetchHomecares(currentPage);
            setEditModalOpen(false);
            setEditingHomecareId(null);
        } catch (err) {
            console.error("Error updating homecare:", err);
            showToast(err.response?.data?.message || "Failed to update homecare.", "error");
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
            fetchHomecares(currentPage);
        } catch (err) {
            console.error("Error deleting homecare:", err);
            showToast(err.response?.data?.message || "Failed to delete homecare.", "error");
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
            showToast(err.response?.data?.message || "Failed to update status.", "error");
        }
    };

    const openViewModal = (homecareId) => setViewingHomecareId(homecareId);
    const closeViewModal = () => setViewingHomecareId(null);
    const openAddModal = () => setAddModalOpen(true);
    const closeAddModal = () => setAddModalOpen(false);
    const openEditModal = (homecareId) => {
        // 👇 ADD THIS LINE to fix the issue
        setIsFetchingEditData(true);
        setEditingHomecareId(homecareId);
        setEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setEditingHomecareId(null);
        setEditModalOpen(false);
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Homecare Services
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* <Button variant="outline">Filter</Button>
                    <Button variant="outline">See All</Button> */}
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
                    <HomecareTable
                        homecares={homecares}
                        openViewModal={openViewModal}
                        openEditModal={openEditModal}
                        handleDeleteHomecare={handleDeleteHomecare}
                        handleUpdateStatus={handleUpdateStatus}
                        statusMenuOpen={statusMenuOpen}
                        setStatusMenuOpen={setStatusMenuOpen}
                    />
                    <HomecarePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePrevPage={handlePrevPage}
                        handleNextPage={handleNextPage}
                    />
                </>
            )}

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
                <ViewHomecareModal homecareId={viewingHomecareId} onClose={closeViewModal} />
            )}
        </div>
    );
}