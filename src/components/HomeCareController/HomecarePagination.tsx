import Button from "../ui/button/Button";

export default function HomecarePagination({
    currentPage,
    totalPages,
    handlePrevPage,
    handleNextPage,
}) {
    return (
        <div className="flex justify-between items-center mt-4 text-gray-600 dark:text-gray-400 flex-wrap gap-2">
            <div>
                Page {currentPage + 1} of {totalPages}
            </div>
            <div className="flex gap-2">
                <Button onClick={handlePrevPage} disabled={currentPage === 0} variant="outline">
                    Previous
                </Button>
                <Button onClick={handleNextPage} disabled={currentPage + 1 >= totalPages} variant="outline">
                    Next
                </Button>
            </div>
        </div>
    );
}