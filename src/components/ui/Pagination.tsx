import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>
        );
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            i === currentPage
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end\" className="px-2">
            ...
          </span>
        );
      }
      
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            <div className="flex items-center">
              {renderPageNumbers()}
            </div>
            
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
      
      {/* Mobile pagination */}
      <div className="flex sm:hidden justify-between w-full">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 bg-white ring-1 ring-gray-300 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        <p className="text-sm text-gray-700 self-center">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 bg-white ring-1 ring-gray-300 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;