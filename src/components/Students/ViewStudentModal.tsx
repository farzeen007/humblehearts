import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { getToken } from "../utils/tokens";
import Badge from "../ui/badge/Badge";

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
        // Adjusting for the 'data.data.student' or 'data.data' structure
        const studentData = res.data?.data?.student || res.data?.data;
        setStudent(studentData);
      } catch (err) {
        console.error("Error fetching student details:", err);
        setError("Failed to load student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl dark:bg-gray-900 dark:text-white/90 transform transition-all duration-300 scale-100 opacity-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-bold">Student Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            &times;
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <h1 className="text-base font-semibold text-gray-700 animate-pulse">
                Loading student details...
              </h1>
            </div>
          </div>
        )}

        {error && <div className="text-red-500 text-center py-8">{error}</div>}

        {student && !loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Full Name
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Email
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.phone}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Second Email
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.secondEmail || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Gender
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.gender}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Date of Birth
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Nationality
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.nationality}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Country
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.country}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  State
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.state}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  City
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.city}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Address
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.address}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Postal Code
                </p>
                <p className="text-gray-900 dark:text-white/90">
                  {student.postalCode}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Status
                </p>
                <Badge
                  size="sm"
                  color={
                    student.status === "ACTIVE"
                      ? "success"
                      : student.status === "PENDING"
                      ? "warning"
                      : "error"
                  }
                >
                  {student.status}
                </Badge>
              </div>
              {student.documentType && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Document Type
                  </p>
                  <p className="text-gray-900 dark:text-white/90">
                    {student.documentType}
                  </p>
                </div>
              )}
              {student.documentNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Document Number
                  </p>
                  <p className="text-gray-900 dark:text-white/90">
                    {student.documentNumber}
                  </p>
                </div>
              )}
              {student.documentExpiry && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Document Expiry
                  </p>
                  <p className="text-gray-900 dark:text-white/90">
                    {new Date(student.documentExpiry).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {(student.profileImage || student.document) && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <p className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                  Attachments
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {student.profileImage && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                        Profile Image
                      </p>
                      {/* Assuming profileImage is a URL. If it's base64, you'd use `data:${student.profileType};base64,${student.profileImageBlog}` for img src */}
                      <a
                        href={student.profileImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Image
                      </a>
                      {/* Optional: Display image thumbnail if it's a direct URL */}
                      {/* <img src={student.profileImage} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded-md" /> */}
                    </div>
                  )}
                  {student.document && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                        Document
                      </p>
                      <a
                        href={student.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
