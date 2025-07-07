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

interface TrackingInfo {
  parcel_id: string;
  status: string;
  location: string;
  timestamp: string;
  updates: TrackingUpdate[];
}

interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export default function Tracking() {
  const [parcelId, setParcelId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrackParcel = async () => {
    if (!parcelId.trim()) {
      Alert.alert('Error', 'Please enter a parcel ID');
      return;
    }

    setLoading(true);
    try {
      // Mock tracking data - replace with actual API call
      const mockTrackingInfo: TrackingInfo = {
        parcel_id: parcelId,
        status: 'in-transit',
        location: 'Chennai Sorting Facility',
        timestamp: new Date().toISOString(),
        updates: [
          {
            status: 'picked-up',
            location: 'Chennai Central',
            timestamp: '2024-01-15T10:00:00Z',
            description: 'Package picked up from sender',
          },
          {
            status: 'in-transit',
            location: 'Chennai Sorting Facility',
            timestamp: '2024-01-15T14:30:00Z',
            description: 'Package arrived at sorting facility',
          },
          {
            status: 'out-for-delivery',
            location: 'T. Nagar Hub',
            timestamp: '2024-01-16T09:00:00Z',
            description: 'Out for delivery',
          },
        ],
      };

      setTrackingInfo(mockTrackingInfo);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tracking information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = () => {
    Alert.prompt(
      'Update Tracking',
      'Enter new status:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (status) => {
            if (status && trackingInfo) {
              Alert.prompt(
                'Update Tracking',
                'Enter location:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Update',
                    onPress: (location) => {
                      if (location) {
                        const newUpdate: TrackingUpdate = {
                          status: status,
                          location: location,
                          timestamp: new Date().toISOString(),
                          description: `Status updated to ${status}`,
                        };
                        setTrackingInfo({
                          ...trackingInfo,
                          status: status,
                          location: location,
                          timestamp: new Date().toISOString(),
                          updates: [...trackingInfo.updates, newUpdate],
                        });
                        Alert.alert('Success', 'Tracking updated successfully');
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
              placeholder="Enter parcel ID (e.g., PKG001)"
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

        {trackingInfo && (
          <View style={styles.trackingSection}>
            <View style={styles.trackingHeader}>
              <Text style={styles.sectionTitle}>Tracking Information</Text>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateTracking}
              >
                <Ionicons name="create-outline" size={16} color="white" />
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.currentStatus}>
              <View style={styles.statusRow}>
                <Text style={styles.parcelId}>Parcel ID: {trackingInfo.parcel_id}</Text>
                <StatusBadge status={trackingInfo.status} />
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color={Colors.gray} />
                <Text style={styles.currentLocation}>{trackingInfo.location}</Text>
              </View>
              <Text style={styles.timestamp}>
                Last updated: {new Date(trackingInfo.timestamp).toLocaleString()}
              </Text>
            </View>

            <View style={styles.timelineSection}>
              <Text style={styles.timelineTitle}>Tracking Timeline</Text>
              {trackingInfo.updates.map((update, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineMarker}>
                    <View style={styles.timelineDot} />
                    {index < trackingInfo.updates.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <StatusBadge status={update.status} />
                      <Text style={styles.timelineTime}>
                        {new Date(update.timestamp).toLocaleString()}
                      </Text>
                    </View>
                    <Text style={styles.timelineLocation}>{update.location}</Text>
                    <Text style={styles.timelineDescription}>{update.description}</Text>
                  </View>
                </View>
              ))}
            </View>
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
  currentStatus: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  parcelId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  currentLocation: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray,
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
    marginBottom: 2,
  },
  timelineDescription: {
    fontSize: 12,
    color: Colors.gray,
  },
});