import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { getToken } from "../utils/tokens";
import Badge from "../ui/badge/Badge";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ViewStudentModal({ studentId, onClose }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentDetails = async () => {
      setLoading(true);
      setError(null);
      const accessToken = getToken();
      try {
        const res = await api.get(`/admin/student/${studentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const studentData = res.data?.data?.student || res.data?.data;
        setStudent(studentData);
      } catch (err) {
        console.error("Error fetching student details:", err);
        setError("Failed to load student details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Loading state
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

  // Error state
  if (error || !student) {
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
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{error || "Student details not found."}</p>
        </div>
      </div>
    );
  }

  // Success state (student data loaded)
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
          <h2 className="text-2xl font-bold">Student Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
          {/* Personal Information */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
            <p className="mt-1 font-semibold">{student.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="mt-1 font-semibold">{student.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="mt-1 font-semibold">{student.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Second Email</p>
            <p className="mt-1 font-semibold">{student.secondEmail || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
            <p className="mt-1 font-semibold">{student.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
            <p className="mt-1 font-semibold">
              {new Date(student.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nationality</p>
            <p className="mt-1 font-semibold">{student.nationality}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <Badge
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
          </div>

          {/* Address */}
          <div className="col-span-full border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-2">Address</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
            <p className="mt-1 font-semibold">{student.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
            <p className="mt-1 font-semibold">{student.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">State</p>
            <p className="mt-1 font-semibold">{student.state}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
            <p className="mt-1 font-semibold">{student.country}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Postal Code</p>
            <p className="mt-1 font-semibold">{student.postalCode}</p>
          </div>

          {/* Document Details */}
          {(student.documentType || student.documentNumber || student.documentExpiry) && (
            <div className="col-span-full border-t pt-4 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-2">Document Details</h3>
            </div>
          )}
          {student.documentType && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Document Type</p>
              <p className="mt-1 font-semibold">{student.documentType}</p>
            </div>
          )}
          {student.documentNumber && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Document Number</p>
              <p className="mt-1 font-semibold">{student.documentNumber}</p>
            </div>
          )}
          {student.documentExpiry && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Document Expiry</p>
              <p className="mt-1 font-semibold">
                {new Date(student.documentExpiry).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Attachments */}
          {(student.profileImage || student.document) && (
            <div className="col-span-full border-t pt-4 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-2">Attachments</h3>
            </div>
          )}
          {student.profileImage && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Profile Image</p>
              <a
                href={student.profileImage}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Image
              </a>
            </div>
          )}
          {student.document && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Document</p>
              <a
                href={student.document}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Document
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}