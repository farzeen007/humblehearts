import React from "react";

export default function JobDetailModal({ isOpen, onClose, job }) {
  if (!isOpen || !job) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose} // Close the modal when clicking outside
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 overflow-y-auto max-h-[90vh] p-6"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
          {/* Attendance ID */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Attendance ID
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.attendanceId}
            </p>
          </div>
          {/* Date */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.date}
            </p>
          </div>
          {/* Homecare Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Homecare Name
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.homeCareName}
            </p>
          </div>
          {/* City */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.city}
            </p>
          </div>
          {/* Student Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Student Name
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.studentName}
            </p>
          </div>
          {/* Student Email */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Student Email
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.studentEmail}
            </p>
          </div>
          {/* Phone */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.phone}
            </p>
          </div>
          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.status}
            </p>
          </div>
          {/* Total Hours */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Hours
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.totalHours}
            </p>
          </div>
          {/* Total Minutes */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Minutes
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.totalMinutes}
            </p>
          </div>
          {/* Check-In */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check-In</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.checkIn ? job.checkIn : "Not checked in"}
            </p>
          </div>
          {/* Check-Out */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Check-Out
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
              {job.checkOut ? job.checkOut : "Not checked out"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}