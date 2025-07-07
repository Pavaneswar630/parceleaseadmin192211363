import axios from 'axios';

// Configure your server URL here
const API_BASE_URL = 'http://localhost:4000'; // Change this to your server IP for mobile testing
// For testing on physical device, use your computer's IP address:
// const API_BASE_URL = 'http://192.168.1.100:4000'; // Replace with your actual IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  bookingsCount: number;
}

export interface Booking {
  parcel_id: string;
  user_id: string;
  pickup_location: string;
  drop_location: string;
  deliverytype: string;
  created_at: string;
  status: string;
}

export interface KpiData {
  title: string;
  value: string;
  icon: string;
  change: { value: number; type: 'increase' | 'decrease' };
  tooltipText: string;
}

export interface RevenueData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface Payment {
  id: number;
  user_id: number;
  parcel_id: string | null;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  message: string;
  response: string;
  status: string;
  created_at: string;
}

export interface ParcelDetails {
  parcel_id: string;
  user_id: string;
  pickup_location: string;
  drop_location: string;
  deliverytype: string;
  status: string;
  created_at: string;
  sender_name: string;
  sender_phone: string;
  receiver_name: string;
  receiver_phone: string;
  delivery_time: string;
  amount: string;
  weight: string;
  package_type: string;
}

export interface TrackingUpdate {
  parcel_id: string;
  status: string;
  location: string;
  timestamp: string;
}

// API Service Functions
export const apiService = {
  // Dashboard APIs
  async getKpis(): Promise<KpiData[]> {
    const response = await api.get('/api/dashboard/kpis');
    return response.data;
  },

  async getRevenueData(): Promise<RevenueData> {
    const response = await api.get('/api/dashboard/revenue');
    return response.data;
  },

  // Users APIs
  async getUsers(): Promise<User[]> {
    const response = await api.get('/api/users');
    return response.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/api/users/${userId}`);
  },

  // Bookings APIs
  async getBookings(): Promise<Booking[]> {
    const response = await api.get('/api/bookings');
    return response.data;
  },

  async confirmBooking(bookingId: string): Promise<void> {
    await api.put(`/api/bookings/${bookingId}/confirm`);
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await api.put(`/api/bookings/${bookingId}/cancel`);
  },

  // In-City Bookings
  async getInCityBookings(): Promise<any[]> {
    const response = await api.get('/api/incity-bookings');
    return response.data;
  },

  // Payments APIs
  async getPayments(): Promise<Payment[]> {
    const response = await api.get('/api/payments');
    return response.data;
  },

  // Support Tickets APIs
  async getSupportTickets(): Promise<SupportTicket[]> {
    const response = await api.get('/api/support-tickets');
    return response.data;
  },

  async deleteSupportTicket(ticketId: number): Promise<void> {
    await api.delete(`/api/support-tickets/${ticketId}`);
  },

  // Tracking APIs
  async getParcelDetails(parcelId: string): Promise<ParcelDetails> {
    const response = await api.get(`/api/parcel/${parcelId}`);
    return response.data;
  },

  async getParcelTimeline(parcelId: string): Promise<TrackingUpdate[]> {
    const response = await api.get(`/api/parcel_timeline/${parcelId}`);
    return response.data;
  },

  async updateTracking(parcelId: string, status: string, location: string): Promise<void> {
    await api.post('/api/parcel_timeline', {
      parcel_id: parcelId,
      status,
      location,
    });
  },

  // FAQs API
  async getFaqs(): Promise<any[]> {
    const response = await api.get('/api/faqs');
    return response.data;
  },
};

export default api;