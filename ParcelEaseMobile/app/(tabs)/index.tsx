import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/Colors';
import KpiCard from '../../components/KpiCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { apiService, KpiData, RevenueData, Booking } from '../../services/api';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [kpis, revenue, bookings] = await Promise.all([
        apiService.getKpis(),
        apiService.getRevenueData(),
        apiService.getBookings(),
      ]);

      setKpiData(kpis);
      setRevenueData(revenue);
      setRecentBookings(bookings.slice(0, 5)); // Show only recent 5 bookings
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Convert revenue data for chart
  const chartData = revenueData ? {
    labels: revenueData.labels,
    datasets: [{
      data: revenueData.datasets[0]?.data || [],
      color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
      strokeWidth: 2,
    }],
  } : null;

  // Pie chart data for booking status
  const pieData = [
    {
      name: 'Pending',
      population: recentBookings.filter(b => b.status === 'pending').length,
      color: '#f59e0b',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'In Transit',
      population: recentBookings.filter(b => b.status === 'in-transit').length,
      color: '#0066FF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Delivered',
      population: recentBookings.filter(b => b.status === 'delivered').length,
      color: '#10b981',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Cancelled',
      population: recentBookings.filter(b => b.status === 'cancelled').length,
      color: '#ef4444',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiContainer}>
          {kpiData.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
          ))}
        </View>

        {/* Revenue Chart */}
        {chartData && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Revenue Trend</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#0066FF',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* Booking Status Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Booking Status Distribution</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Recent Bookings */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Recent Bookings</Text>
          {recentBookings.map((booking, index) => (
            <View key={index} style={styles.bookingItem}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingId}>{booking.parcel_id}</Text>
                <Text style={styles.bookingStatus}>{booking.status}</Text>
              </View>
              <Text style={styles.bookingLocation}>
                {booking.pickup_location} → {booking.drop_location}
              </Text>
              <Text style={styles.bookingDate}>
                {new Date(booking.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
  },
  chartContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
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
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: Colors.textPrimary,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  bookingItem: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bookingStatus: {
    fontSize: 12,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  bookingLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  bookingDate: {
    fontSize: 10,
    color: Colors.gray,
  },
});