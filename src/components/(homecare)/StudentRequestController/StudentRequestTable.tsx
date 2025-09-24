import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";

export default function StudentRequestTable({ jobAssigned }) {
  return (
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
              City
            </TableCell>
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
              Status
            </TableCell>
            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
            >
              Total Hours
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 ">
          {jobAssigned.length > 0 ? (
            jobAssigned.map((job) => (
              <TableRow key={job.attendanceId}>
                <TableCell className="py-3 text-gray-800 dark:text-white/90">
                  {job.homeCareName}
                </TableCell>
                <TableCell className="py-3 text-gray-800 dark:text-white/90">
                  {job.city}
                </TableCell>
                <TableCell className="py-3 text-gray-800 dark:text-white/90">
                  {job.date}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={job.status === "DUE" ? "warning" : "success"}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-800 dark:text-white/90">
                  {job.formattedTotalHours}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan="5"
                className="text-center py-4 text-gray-500 dark:text-gray-400"
              >
                No assigned jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
