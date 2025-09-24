
export default function HomeCareRequestController() {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                Home Care Request Services
            </div>
        </div>
    );
}


// import { useEffect, useState } from "react";
// import { api } from "../utils/api";
// import { getToken } from "../utils/tokens";
// import HomeCareRequestTable from "./HomeCareRequestTable";
// import HomecarePagination from "../HomeCareController/HomecarePagination";
// import { showToast } from "../utils/showToast";

// export default function HomecareRequestController() {
//     const [requests, setRequests] = useState([]);
//     const [currentPage, setCurrentPage] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [viewingRequestId, setViewingRequestId] = useState(null);
//     const [statusMenuOpen, setStatusMenuOpen] = useState(null);

//     const fetchRequests = async (page = 0) => {
//         setLoading(true);
//         const accessToken = getToken();
//         try {
//             const res = await api.get(
//                 `/admin/manage/homecare/request/jobs?sortBy=createdAt&pageSize=10&direction=next&page=${page}`,
//                 { headers: { Authorization: `Bearer ${accessToken}` } }
//             );
//             console.log(res,"heyyyyyyyy ")
//             const data = res.data?.requests || [];
//             // const metadata = res.data?.metadata;
//             setRequests(data);
//             // setCurrentPage(metadata?.currentPage || 0);
//             // setTotalPages(metadata?.totalPages || 0);
//         } catch (err) {
//             console.error("Error fetching homecare requests:", err);
//             showToast("Failed to fetch requests", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchRequests();
//     }, []);

//     const handleNextPage = () => {
//         if (currentPage + 1 < totalPages) fetchRequests(currentPage + 1);
//     };

//     const handlePrevPage = () => {
//         if (currentPage > 0) fetchRequests(currentPage - 1);
//     };


//     const handleUpdateStatus = async (id, newStatus) => {
//         try {
//             const accessToken = getToken();
//             const res = await api.put(
//                 `/admin/manage/homecare/request/${id}/status`,
//                 { status: newStatus },
//                 { headers: { Authorization: `Bearer ${accessToken}` } }
//             );
//             if (res.status === 200) {
//                 showToast("Request status updated successfully", "success");
//                 fetchRequests(currentPage);
//             }
//         } catch (err) {
//             console.error("Error updating status:", err);
//             showToast("Failed to update status", "error");
//         } finally {
//             setStatusMenuOpen(null);
//         }
//     };

//     return (
//         <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
//             <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//                     Homecare Request Services
//                 </h3>
//             </div>

//             {loading ? (
//                 <div className="flex items-center justify-center h-[50vh]">
//                     <div className="flex flex-col items-center space-y-4">
//                         <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
//                         <h1 className="text-base font-semibold text-gray-700 animate-pulse">
//                             Loading data...
//                         </h1>
//                     </div>
//                 </div>
//             ) : (
//                 <>
//                     <HomeCareRequestTable
//                         requests={requests}
//                         // openViewModal={openViewModal}
//                         // openEditModal={openEditModal}
//                         handleUpdateStatus={handleUpdateStatus}
//                         statusMenuOpen={statusMenuOpen}
//                         setStatusMenuOpen={setStatusMenuOpen}
//                     />
//                     <HomecarePagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         handlePrevPage={handlePrevPage}
//                         handleNextPage={handleNextPage}
//                     />
//                 </>
//             )}
//         </div>
//     );
// }