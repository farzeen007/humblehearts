import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { getToken } from "../../utils/tokens";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import Button from "../../ui/button/Button";
import { showToast } from "../../utils/showToast";
import ViewStudentModal from "./ViewStudentModal";
import { studentSchema } from "../../utils/schema/StudentControllerSchema";

export default function StudentsController() {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(null);
  const [viewingStudentId, setViewingStudentId] = useState(null);
  const [isFetchingStudent, setIsFetchingStudent] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [studentAvailabilities, setStudentAvailabilities] = useState([]);
  const [isFetchingAvailabilities, setIsFetchingAvailabilities] =
    useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null); // Added state to hold the current student's ID for assignment
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentSchema),
  });

  const fetchStudents = async (page = 0) => {
    setLoading(true);
    const accessToken = getToken();
    try {
      const res = await api.get(
        `/admin/student/all?sortBy=createdAt&pageSize=10&direction=next&page=${page}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = res.data?.data?.students || [];
      const metadata = res.data?.metadata;
      setStudents(data);
      setCurrentPage(metadata?.currentPage || 0);
      setTotalPages(metadata?.totalPages || 0);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) fetchStudents(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) fetchStudents(currentPage - 1);
  };

  const openEditModal = async (student) => {
    setEditingStudentId(student.studentId);
    setModalOpen(true);
    setIsFetchingStudent(true);
    const accessToken = getToken();
    try {
      const res = await api.get(`/admin/student/${student.studentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const fetchedStudent = res.data.data;
      reset(fetchedStudent);
    } catch (err) {
      console.error("Error fetching student details:", err);
      showToast("Failed to fetch student details.", "error");
      handleCloseModal();
    } finally {
      setIsFetchingStudent(false);
    }
  };

  const handleCloseModal = () => {
    setEditingStudentId(null);
    setModalOpen(false);
    reset({});
  };

  const handleUpdateStudent = async (data) => {
    const accessToken = getToken();
    try {
      const payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          if (key === "img" || key === "document") {
            if (data[key] && data[key][0]) {
              payload.append(key, data[key][0]);
            }
          } else {
            payload.append(key, data[key]);
            payload.append("studentId", editingStudentId);
          }
        }
      });
      const res = await api.put(`/admin/student/update`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showToast(res.data.message);
      fetchStudents(currentPage);
      handleCloseModal();
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const accessToken = getToken();
    try {
      await api.delete(`/admin/student/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchStudents(currentPage);
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const handleUpdateStatus = async (studentId, status) => {
    const accessToken = getToken();
    try {
      const res = await api.put(
        `/admin/student/status/update`,
        { studentId, status },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      showToast(res.data.message);
      fetchStudents(currentPage);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const openViewModal = (studentId) => {
    setViewingStudentId(studentId);
  };

  const closeViewModal = () => {
    setViewingStudentId(null);
  };

  const openAvailabilityModal = async (studentId) => {
    setCurrentStudentId(studentId); // Set the current student's ID
    setAvailabilityModalOpen(true);
    setIsFetchingAvailabilities(true);
    const accessToken = getToken();
    try {
      const res = await api.get(
        `/admin/manage/student/availability/get/all/${studentId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setStudentAvailabilities(res.data?.data?.availabilities || []);
    } catch (err) {
      console.error("Error fetching availabilities:", err);
      showToast("Failed to fetch student availabilities.", "error");
    } finally {
      setIsFetchingAvailabilities(false);
    }
  };

  const closeAvailabilityModal = () => {
    setAvailabilityModalOpen(false);
    setStudentAvailabilities([]);
    setCurrentStudentId(null); // Clear the current student's ID
  };

  const handleAssignToHomeCare = async (availability) => {
    console.log(availability);
    const accessToken = getToken();
    try {
      const payload = {
        date: availability.date,
        studentId: currentStudentId,
        homeCareId: availability.homeCareId,
      };
      const res = await api.post(
        `/admin/manage/student/availability/assign`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      showToast(res.data.message, "success");
      // Optionally, refetch availabilities to update the list
      openAvailabilityModal(currentStudentId);
    } catch (err) {
      console.error("Error assigning student:", err);
      showToast("Failed to assign student.", "error");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Students
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline">See All</Button>
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
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                  >
                    Email
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
                {students.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell className="py-3 text-gray-500 dark:text-white/90">
                      {student.name}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                      {student.email}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        size="sm"
                        color={
                          student.status === "APPROVED"
                            ? "success"
                            : student.status === "PENDING"
                            ? "warning"
                            : "error"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 flex gap-2 items-center">
                      <Button
                        variant="ghost"
                        onClick={() => openViewModal(student.studentId)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => openEditModal(student)}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => openAvailabilityModal(student.studentId)}
                      >
                        <CalendarDaysIcon className="h-5 w-5" />
                      </Button>
                      {/* <Button
                        variant="ghost"
                        onClick={() => handleDeleteStudent(student.studentId)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button> */}
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStatusMenuOpen(
                              statusMenuOpen === student.studentId
                                ? null
                                : student.studentId
                            )
                          }
                        >
                          Update Status
                        </Button>
                        {statusMenuOpen === student.studentId && (
                          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                            {["APPROVED", "BLOCKED", "REJECTED", "PENDING"].map(
                              (status) => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    handleUpdateStatus(
                                      student.studentId,
                                      status
                                    );
                                    setStatusMenuOpen(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {status}
                                </button>
                              )
                            )}
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

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl dark:bg-gray-900 dark:text-white/90 transform transition-all duration-300 scale-100 opacity-100 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
              <h2 className="text-2xl font-bold">Edit Student</h2>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {isFetchingStudent ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Fetching student data...
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(handleUpdateStudent)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("fullName")}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Password
                    </label>
                    <input
                      type="password"
                      {...register("password")}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Phone
                    </label>
                    <input
                      type="text"
                      {...register("phone")}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Second Email
                    </label>
                    <input
                      type="email"
                      {...register("secondEmail")}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.secondEmail
                          ? "border-red-500"
                          : "border-gray-300"
                      } shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700`}
                    />
                    {errors.secondEmail && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.secondEmail.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Gender
                    </label>
                    <input
                      type="text"
                      {...register("gender")}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {errors.gender && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      {...register("dateOfBirth")}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Nationality
                    </label>
                    <input
                      type="text"
                      {...register("nationality")}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {errors.nationality && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Country
                    </label>
                    <input
                      type="text"
                      {...register("country")}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      State
                    </label>
                    <input
                      type="text"
                      {...register("state")}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {errors.state && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      City
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Address
                    </label>
                    <input
                      type="text"
                      {...register("address")}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      {...register("postalCode")}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Profile Image
                    </label>
                    {students.find((s) => s.studentId === editingStudentId)
                      ?.img && (
                      <div className="mt-2">
                        <img
                          src={
                            students.find(
                              (s) => s.studentId === editingStudentId
                            )?.img
                          }
                          alt="Student Profile"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      {...register("img")}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Document
                    </label>
                    <input
                      type="file"
                      {...register("document")}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleCloseModal}
                    type="button"
                    disabled={isSubmitting}
                    className={
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }
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
                    {isSubmitting ? "Updating..." : "Update Student"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {viewingStudentId && (
        <ViewStudentModal
          studentId={viewingStudentId}
          onClose={closeViewModal}
        />
      )}

      {availabilityModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && closeAvailabilityModal()
          }
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl dark:bg-gray-900 dark:text-white/90 transform transition-all duration-300 scale-100 opacity-100 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
              <h2 className="text-2xl font-bold">Student Availability</h2>
              <button
                onClick={closeAvailabilityModal}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {isFetchingAvailabilities ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Fetching availability data...
                </p>
              </div>
            ) : studentAvailabilities.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                      >
                        Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                      >
                        Home Care
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
                        City
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
                    {studentAvailabilities.map((availability) => (
                      <TableRow key={availability.availabilityId}>
                        <TableCell className="py-3 text-gray-500 dark:text-white/90">
                          {availability.date}
                        </TableCell>
                        <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                          {availability.homeCareName}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            size="sm"
                            color={availability.accepted ? "success" : "error"}
                          >
                            {availability.accepted ? "Accepted" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            size="sm"
                            color={
                              availability.assigned ? "success" : "warning"
                            }
                          >
                            {availability.assigned
                              ? "Assigned"
                              : "Not Assigned"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                          {availability.city}
                        </TableCell>
                        {console.log(availability)}
                        <TableCell className="py-3">
                          <Button
                            variant="solid"
                            size="sm"
                            onClick={() => handleAssignToHomeCare(availability)}
                            disabled={availability.assigned}
                          >
                            Assign
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No availability data found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
