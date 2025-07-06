import { Booking } from '../utils/types';

// Generate a random date within the last 30 days
const randomRecentDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString();
};

// Generate a random future date within the next 60 days
const randomFutureDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 60));
  return date.toISOString().split('T')[0];
};

// Generate a random time
const randomTime = () => {
  const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
  const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const statuses: Booking['status'][] = ['confirmed', 'pending', 'cancelled', 'completed'];

// Generate 50 mock bookings
export const generateMockBookings = (): Booking[] => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `BKG-${(1000 + i).toString()}`,
    customerName: [
      'Emma Thompson',
      'James Wilson',
      'Sophia Chen',
      'Michael Rodriguez',
      'Olivia Johnson',
      'William Davis',
      'Ava Martinez',
      'Alexander Kim',
      'Isabella Garcia',
      'Ethan Patel',
    ][Math.floor(Math.random() * 10)],
    location: [
      'Downtown District',
      'Harbor View',
      'Central Park',
      'Westside Mall',
      'North Beach',
      'East Village',
      'Riverside',
      'Uptown Heights',
      'Sunset Boulevard',
      'Metro Center',
    ][Math.floor(Math.random() * 10)],
    date: randomFutureDate(),
    time: randomTime(),
    duration: [1, 2, 3, 4][Math.floor(Math.random() * 4)],
    price: Math.floor(Math.random() * 200) + 50,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: randomRecentDate(),
  }));
};

export const mockBookings = generateMockBookings();