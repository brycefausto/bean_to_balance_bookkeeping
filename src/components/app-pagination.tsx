import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState } from "react"

export interface AppPaginationProps {
  initialPage?: number
  total: number
  onChangePage?: (page: number) => void
}

export const AppPagination: React.FC<AppPaginationProps> = ({
  initialPage = 1,
  total,
  onChangePage,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > total) return
    setCurrentPage(page)
    onChangePage?.(page)
  }

  const renderPageNumbers = () => {
    const pages: (number | "...")[] = []
    const maxVisiblePages = 5

    if (total <= maxVisiblePages) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      const start = Math.max(currentPage - 1, 2)
      const end = Math.min(currentPage + 1, total - 1)

      pages.push(1)
      if (start > 2) pages.push("...")

      for (let i = start; i <= end; i++) pages.push(i)

      if (end < total - 1) pages.push("...")
      pages.push(total)
    }

    return pages.map((page, index) => (
      <PaginationItem key={index}>
        {page === "..." ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            isActive={page === currentPage}
            onClick={() => handlePageChange(Number(page))}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ))
  }

  return (
    <Pagination className="mt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            aria-disabled={currentPage === total}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
