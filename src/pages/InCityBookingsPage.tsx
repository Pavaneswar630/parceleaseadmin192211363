import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Booking, BookingStatus } from '../utils/types';
import BookingsTable from '../components/bookings/BookingsTable';
import Pagination from '../components/ui/Pagination';

const InCityBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/incity-bookings');
        console.log('📦 InCity API response:', res.data);

        const mapped: Booking[] = res.data.map((item: any) => {
          const status = item.status?.toLowerCase().replace(/_/g, '-') || 'pending';


          return {
            id: item.parcel_id,
            customerName: item.sender_name || 'N/A',
            location: item.pickup_location || 'N/A',
            date: item.delivery_time?.split(' ')[0] || 'N/A',
            time: item.delivery_time?.split(' ')[1]?.slice(0, 5) || 'N/A',
            duration: 1,
            price: Number(item.amount || 0),
            status,
            createdAt: item.created_at || '',
          };
        });

        setBookings(mapped);
      } catch (err) {
        console.error('❌ Failed to fetch bookings', err);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    const query = searchQuery.toLowerCase();

    if (searchQuery) {
      result = result.filter(
        (b) =>
          b.id.toLowerCase().includes(query) ||
          b.customerName.toLowerCase().includes(query) ||
          b.location.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter);
    }

    return result;
  }, [bookings, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleExportCSV = () => {
    alert('CSV export functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">In-City Bookings</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
            className="border px-2 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="confirmed">Confirmed</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Export CSV
          </button>
        </div>
      </div>

      <BookingsTable
        bookings={filteredBookings}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default InCityBookingsPage;
