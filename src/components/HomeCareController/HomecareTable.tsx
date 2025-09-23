import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Button from "../ui/button/Button";

export default function HomecareTable({
    homecares,
    openViewModal,
    openEditModal,
    handleDeleteHomecare,
    handleUpdateStatus,
    statusMenuOpen,
    setStatusMenuOpen
}) {
    return (
        <div className="overflow-x-auto w-full">
            <Table className="min-w-[600px] md:min-w-full">
                <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                    <TableRow>
                        <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                            Homecare Name
                        </TableCell>
                        <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                            Homecare Image
                        </TableCell>
                        <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                            Status
                        </TableCell>
                        <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 ">
                    {homecares.map((homecare) => (
                        <TableRow key={homecare.homeCareId}>
                            <TableCell className="py-3 text-gray-800 dark:text-white/90">
                                {homecare.homeCareName}
                            </TableCell>
                            <TableCell className="py-3 text-gray-800 dark:text-white/90">
                                {homecare.img ? (
                                    <img
                                        src={`data:image/png;base64,${homecare.img}`}
                                        alt="Homecare"
                                        className="mt-2 w-10 h-10 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                                    />
                                ) : (
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">No Image</p>
                                )}
                            </TableCell>
                            <TableCell className="py-3">
                                <Badge size="sm" color={homecare.status === "ACTIVE" ? "success" : "error"}>
                                    {homecare.status === "ACTIVE" ? "ACTIVE" : "BLOCKED"}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-3 flex gap-2 items-center">
                                <Button variant="ghost" onClick={() => openViewModal(homecare.homeCareId)}>
                                    <EyeIcon className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" onClick={() => openEditModal(homecare.homeCareId)}>
                                    <PencilSquareIcon className="h-5 w-5" />
                                </Button>
                                {/* <Button variant="ghost" onClick={() => handleDeleteHomecare(homecare.homeCareId)}>
                                    <TrashIcon className="h-5 w-5" />
                                </Button> */}
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setStatusMenuOpen(statusMenuOpen === homecare.homeCareId ? null : homecare.homeCareId)
                                        }
                                    >
                                        Update Status
                                    </Button>
                                    {statusMenuOpen === homecare.homeCareId && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                                            {["ACTIVE", "BLOCKED"].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => {
                                                        handleUpdateStatus(homecare.homeCareId, status);
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
    );
}