import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import StatusBadge from '../../components/StatusBadge';

interface Booking {
  parcel_id: string;
  user_id: string;
  pickup_location: string;
  drop_location: string;
  deliverytype: string;
  created_at: string;
  status: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchBookings = async () => {
    try {
      // Mock data for demo - replace with actual API call
      const mockBookings: Booking[] = [
        {
          parcel_id: 'PKG001',
          user_id: 'USR001',
          pickup_location: 'Chennai Central',
          drop_location: 'T. Nagar',
          deliverytype: 'Express',
          created_at: new Date().toISOString(),
          status: 'pending',
        },
        {
          parcel_id: 'PKG002',
          user_id: 'USR002',
          pickup_location: 'Anna Nagar',
          drop_location: 'Velachery',
          deliverytype: 'Standard',
          created_at: new Date().toISOString(),
          status: 'in-transit',
        },
        // Add more mock data as needed
      ];

      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(
      (booking) =>
        booking.parcel_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.drop_location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleBookingPress = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
  };

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    Alert.alert(
      'Update Status',
      `Change status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setBookings((prev) =>
              prev.map((booking) =>
                booking.parcel_id === bookingId
                  ? { ...booking, status: newStatus }
                  : booking
              )
            );
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => handleBookingPress(item)}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingId}>{item.parcel_id}</Text>
        <StatusBadge status={item.status} />
      </View>
      <View style={styles.bookingDetails}>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={Colors.gray} />
          <Text style={styles.locationText}>
            {item.pickup_location} → {item.drop_location}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Type: {item.deliverytype}</Text>
          <Text style={styles.infoText}>
            Date: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookings..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.parcel_id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Booking Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBooking && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Booking Details</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={Colors.gray} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.detailLabel}>Booking ID:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.parcel_id}</Text>

                  <Text style={styles.detailLabel}>User ID:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.user_id}</Text>

                  <Text style={styles.detailLabel}>Pickup Location:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.pickup_location}</Text>

                  <Text style={styles.detailLabel}>Drop Location:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.drop_location}</Text>

                  <Text style={styles.detailLabel}>Delivery Type:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.deliverytype}</Text>

                  <Text style={styles.detailLabel}>Status:</Text>
                  <StatusBadge status={selectedBooking.status} />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={() => handleStatusUpdate(selectedBooking.parcel_id, 'Confirmed')}
                  >
                    <Text style={styles.actionButtonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleStatusUpdate(selectedBooking.parcel_id, 'cancelled')}
                  >
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  listContainer: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bookingDetails: {
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 12,
    color: Colors.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  modalBody: {
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.success,
  },
  cancelButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});