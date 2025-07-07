import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import StatusBadge from '../../components/StatusBadge';
import { apiService, ParcelDetails, TrackingUpdate } from '../../services/api';

export default function Tracking() {
  const [parcelId, setParcelId] = useState('');
  const [parcelDetails, setParcelDetails] = useState<ParcelDetails | null>(null);
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTrackParcel = async () => {
    if (!parcelId.trim()) {
      Alert.alert('Error', 'Please enter a parcel ID');
      return;
    }

    setLoading(true);
    try {
      const [details, timeline] = await Promise.all([
        apiService.getParcelDetails(parcelId.trim()),
        apiService.getParcelTimeline(parcelId.trim()),
      ]);

      setParcelDetails(details);
      setTrackingUpdates(timeline);
    } catch (error) {
      console.error('Error fetching tracking info:', error);
      Alert.alert('Error', 'Parcel not found or failed to fetch tracking information');
      setParcelDetails(null);
      setTrackingUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = () => {
    if (!parcelDetails) return;

    Alert.prompt(
      'Update Status',
      'Enter new status:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (status) => {
            if (status?.trim()) {
              Alert.prompt(
                'Update Location',
                'Enter current location:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Update',
                    onPress: async (location) => {
                      if (location?.trim()) {
                        try {
                          await apiService.updateTracking(
                            parcelDetails.parcel_id,
                            status.trim(),
                            location.trim()
                          );
                          Alert.alert('Success', 'Tracking updated successfully');
                          // Refresh tracking data
                          handleTrackParcel();
                        } catch (error) {
                          console.error('Error updating tracking:', error);
                          Alert.alert('Error', 'Failed to update tracking');
                        }
                      }
                    },
                  },
                ]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Track Shipment</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Enter Parcel ID</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter parcel ID"
              value={parcelId}
              onChangeText={setParcelId}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleTrackParcel}
              disabled={loading}
            >
              <Ionicons
                name={loading ? 'hourglass-outline' : 'search'}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {parcelDetails && (
          <View style={styles.trackingSection}>
            <View style={styles.trackingHeader}>
              <Text style={styles.sectionTitle}>Parcel Information</Text>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateTracking}
              >
                <Ionicons name="create-outline" size={16} color="white" />
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.parcelInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Parcel ID:</Text>
                <Text style={styles.infoValue}>{parcelDetails.parcel_id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <StatusBadge status={parcelDetails.status} />
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Pickup:</Text>
                <Text style={styles.infoValue}>{parcelDetails.pickup_location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Drop:</Text>
                <Text style={styles.infoValue}>{parcelDetails.drop_location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sender:</Text>
                <Text style={styles.infoValue}>
                  {parcelDetails.sender_name} ({parcelDetails.sender_phone})
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Receiver:</Text>
                <Text style={styles.infoValue}>
                  {parcelDetails.receiver_name} ({parcelDetails.receiver_phone})
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>{parcelDetails.weight} kg</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Amount:</Text>
                <Text style={styles.infoValue}>₹{parcelDetails.amount}</Text>
              </View>
            </View>

            {trackingUpdates.length > 0 && (
              <View style={styles.timelineSection}>
                <Text style={styles.timelineTitle}>Tracking Timeline</Text>
                {trackingUpdates.map((update, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineMarker}>
                      <View style={styles.timelineDot} />
                      {index < trackingUpdates.length - 1 && (
                        <View style={styles.timelineLine} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineHeader}>
                        <StatusBadge status={update.status} size="sm" />
                        <Text style={styles.timelineTime}>
                          {new Date(update.timestamp).toLocaleString()}
                        </Text>
                      </View>
                      <Text style={styles.timelineLocation}>{update.location}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  parcelInfo: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  timelineSection: {
    marginTop: 8,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.lightGray,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
    color: Colors.gray,
  },
  timelineLocation: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});