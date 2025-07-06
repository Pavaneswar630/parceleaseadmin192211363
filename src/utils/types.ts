// src/types.ts (or create this if it doesn't exist)
export type StatusType =
  | 'pending'
  | 'in-transit'
  | 'delivered'
  | 'cancelled'
  | 'active'
  | 'blocked'
  | 'open'
  | 'closed'
  | 'Confirmed'
  | 'failed';

export type DeliveryType = 'normal' | 'expressdelivery' ; // update as needed
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  customerName: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: BookingStatus;
  createdAt: string;
}
