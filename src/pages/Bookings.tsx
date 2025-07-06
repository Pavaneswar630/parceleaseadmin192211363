import { useState, useEffect } from 'react';
import { Filter, Download, Search, X } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { StatusType, DeliveryType } from '../utils/types';

interface Booking {
  parcel_id: string;
  user_id: string;
  pickup_location: string;
  drop_location: string;
  deliverytype: string;
  created_at: string;
  status: StatusType;
}

const validStatuses: StatusType[] = [
  'pending', 'in-transit', 'delivered', 'cancelled',
  'active', 'blocked', 'open', 'closed', 'Confirmed', 'failed',
];

const validDeliveryTypes: DeliveryType[] = ['normal', 'expressdelivery'];

function isValidStatus(status: string): status is StatusType {
  return validStatuses.includes(status as StatusType);
}
function isValidDeliveryType(type: string): type is DeliveryType {
  return validDeliveryTypes.includes(type as DeliveryType);
}

function exportConfirmedBookingsToCSV(data: Booking[], filename: string): void {
  const csvHeaders = [
    'Booking ID',
    'User ID',
    'Pickup Location',
    'Drop Location',
    'Delivery Type',
    'Date',
    'Status',
  ];

  const confirmedBookings = data.filter((b: Booking) => b.status === 'Confirmed');

  const rows = confirmedBookings.map((b: Booking) => [
    b.parcel_id,
    b.user_id,
    b.pickup_location,
    b.drop_location,
    b.deliverytype,
    new Date(b.created_at).toLocaleDateString(),
    b.status,
  ]);

  const csvContent = [csvHeaders, ...rows]
    .map(row =>
      row.map((value: string | number) => `"${String(value).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.click();
}

function convertBooking(raw: any): Booking {
  return {
    ...raw,
    status: isValidStatus(raw.status) ? raw.status : 'pending',
    deliverytype: isValidDeliveryType(raw.deliverytype) ? raw.deliverytype : 'normal',
  };
}

function Bookings() {
  type BookingTab = StatusType | 'all';
  const [activeTab, setActiveTab] = useState<BookingTab>('all');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(() => {});

  useEffect(() => {
    fetch('http://localhost:4000/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        const converted = data.map(convertBooking);
        setBookings(converted);
      })
      .catch((err) => console.error('Failed to fetch bookings:', err));
  }, []);

  const handleTabChange = (tab: BookingTab) => setActiveTab(tab);

  const handleSelectBooking = (id: string) => {
    setSelectedBookings((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBookings(filteredBookings.map((b) => b.parcel_id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDrawer(true);
  };

  const closeDrawer = () => setShowDrawer(false);

  const cancelBooking = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/bookings/${id}/cancel`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Failed to cancel booking');
      setBookings((prev) =>
        prev.map((b) => (b.parcel_id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const confirmBooking = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/bookings/${id}/confirm`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Failed to confirm booking');
      setBookings((prev) =>
        prev.map((b) => (b.parcel_id === id ? { ...b, status: 'Confirmed' } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmBooking = (id: string) => {
    setConfirmTitle('Confirm Booking');
    setConfirmMessage('Are you sure you want to confirm this booking?');
    setOnConfirmCallback(() => () => confirmBooking(id));
    setShowConfirmDialog(true);
  };

  const handleCancelBooking = (id: string) => {
    setConfirmTitle('Cancel Booking');
    setConfirmMessage('Are you sure you want to cancel this booking?');
    setOnConfirmCallback(() => () => cancelBooking(id));
    setShowConfirmDialog(true);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = activeTab === 'all' || b.status === activeTab;
    const search = searchTerm.toLowerCase();
    return (
      matchesStatus &&
      (b.parcel_id.toLowerCase().includes(search) ||
        b.user_id.toLowerCase().includes(search) ||
        b.pickup_location.toLowerCase().includes(search) ||
        b.drop_location.toLowerCase().includes(search))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Tools */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Bookings Management</h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter size={18} className="mr-2 text-gray-500" /> Filter
          </button>
          <button
            type="button"
            onClick={() => exportConfirmedBookingsToCSV(bookings, 'confirmed_bookings')}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Download size={18} className="mr-2 text-gray-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 border-b border-gray-200">
          {['all', 'pending', 'in-transit', 'delivered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange(tab as BookingTab)}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-custom overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600"
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup → Drop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.parcel_id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600"
                      checked={selectedBookings.includes(booking.parcel_id)}
                      onChange={() => handleSelectBooking(booking.parcel_id)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{booking.parcel_id}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{booking.user_id}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {booking.pickup_location} → {booking.drop_location}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{booking.deliverytype}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-3">
                    <button
                      className="text-primary-600 hover:text-primary-900"
                      onClick={() => handleViewBooking(booking)}
                    >
                      View
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handleConfirmBooking(booking.parcel_id)}
                      disabled={booking.status === 'Confirmed'}
                    >
                      Confirm
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleCancelBooking(booking.parcel_id)}
                      disabled={booking.status === 'cancelled'}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {showDrawer && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={closeDrawer}></div>
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Booking #{selectedBooking.parcel_id}</h2>
              <button onClick={closeDrawer}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <p><strong>User ID:</strong> {selectedBooking.user_id}</p>
              <p><strong>Pickup:</strong> {selectedBooking.pickup_location}</p>
              <p><strong>Drop:</strong> {selectedBooking.drop_location}</p>
              <p><strong>Type:</strong> {selectedBooking.deliverytype}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Date:</strong> {new Date(selectedBooking.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">{confirmTitle}</h2>
            <p className="text-sm text-gray-600 mb-4">{confirmMessage}</p>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={() => setShowConfirmDialog(false)}>Cancel</button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md" onClick={() => {
                onConfirmCallback();
                setShowConfirmDialog(false);
              }}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
