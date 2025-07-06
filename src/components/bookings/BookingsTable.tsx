import React, { useState, useMemo } from 'react';
import { ArrowUpDown, MoreHorizontal, FileText, Edit, Trash2 } from 'lucide-react';
import { Booking, BookingStatus } from '../../utils/types';
import BookingStatusBadge from './BookingStatusBadge';

interface BookingsTableProps {
  bookings: Booking[];
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  statusFilter: BookingStatus | 'all';
}

type SortField = keyof Booking | null;
type SortDirection = 'asc' | 'desc';

const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  currentPage,
  itemsPerPage,
  searchQuery,
  statusFilter,
}) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (booking) =>
          booking.id.toLowerCase().includes(query) ||
          booking.customerName.toLowerCase().includes(query) ||
          booking.location.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [bookings, searchQuery, statusFilter, sortField, sortDirection]);

  // Calculate current page items
  const currentBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown
      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
        sortField === field
          ? sortDirection === 'asc'
            ? 'text-blue-500 transform rotate-0'
            : 'text-blue-500 transform rotate-180'
          : 'text-gray-400'
      }`}
    />
  );

  const toggleRowActions = (id: string) => {
    setActiveRowId(activeRowId === id ? null : id);
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              <button
                className="group inline-flex items-center"
                onClick={() => handleSort('id')}
              >
                Booking ID
                <SortIcon field="id" />
              </button>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              <button
                className="group inline-flex items-center"
                onClick={() => handleSort('customerName')}
              >
                Customer
                <SortIcon field="customerName" />
              </button>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              <button
                className="group inline-flex items-center"
                onClick={() => handleSort('location')}
              >
                Location
                <SortIcon field="location" />
              </button>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              <button
                className="group inline-flex items-center"
                onClick={() => handleSort('date')}
              >
                Date
                <SortIcon field="date" />
              </button>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              <button
                className="group inline-flex items-center"
                onClick={() => handleSort('time')}
              >
                Time
                <SortIcon field="time" />
              </button>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              <button
                className="group inline-flex items-center"
                onClick={() => handleSort('price')}
              >
                Price
                <SortIcon field="price" />
              </button>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              <button
                className="group inline-flex items-center"
                onClick={() => handleSort('status')}
              >
                Status
                <SortIcon field="status" />
              </button>
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {currentBookings.length > 0 ? (
            currentBookings.map((booking) => (
              <tr 
                key={booking.id} 
                className="hover:bg-gray-50 transition-colors duration-150"
                onMouseLeave={() => setActiveRowId(null)}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {booking.id}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {booking.customerName}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {booking.location}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {booking.date}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {booking.time}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  ${booking.price}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => toggleRowActions(booking.id)}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {activeRowId === booking.id && (
                      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <FileText className="mr-3 h-4 w-4" />
                            View Details
                          </button>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <Edit className="mr-3 h-4 w-4" />
                            Edit Booking
                          </button>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <Trash2 className="mr-3 h-4 w-4" />
                            Cancel Booking
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                No bookings found matching your criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;