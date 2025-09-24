import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { getToken } from "../../utils/tokens";
import { showToast } from "../../utils/showToast";
import Button from "../../ui/button/Button";
import ViewHomecareModal from "./ViewHomeCareModal";
import StudentRequestTable from "./StudentRequestTable";
import HomecarePagination from "../../(admin)/HomeCareController/HomecarePagination";

export default function StudentRequestController() {
  const [jobAssigned, setJobAssigned] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignedJobs = async (page = 0) => {
    setLoading(true);
    setError(null);
    const accessToken = getToken();
    try {
      const res = await api.get(
        `/homecare/manage/student/request/staff?sortBy=createdAt&pageSize=10&direction=next&page=${page}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = res.data?.data?.jobAssigned || [];
      const metadata = res.data?.metadata;
      setJobAssigned(data);
      setCurrentPage(metadata?.currentPage || 0);
      setTotalPages(metadata?.totalPages || 0);
    } catch (err) {
      console.error("Error fetching assigned jobs:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load assigned jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedJobs();
  }, []);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) fetchAssignedJobs(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) fetchAssignedJobs(currentPage - 1);
  };

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

  if (error || !jobAssigned) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error || "Assigned jobs not found."}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Assigned Homecare Jobs
        </h3>
      </div>
      <StudentRequestTable jobAssigned={jobAssigned} />
      <HomecarePagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
}
