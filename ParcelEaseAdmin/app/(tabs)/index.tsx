import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/Colors';
import KpiCard from '../../components/KpiCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const screenWidth = Dimensions.get('window').width;

interface KpiData {
  title: string;
  value: string;
  icon: string;
  change: { value: number; type: 'increase' | 'decrease' };
  tooltipText: string;
}

interface RevenueData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export default function Dashboard() {
  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // Mock data for demo - replace with actual API calls
      const mockKpiData: KpiData[] = [
        {
          title: 'Total Bookings',
          value: '1,243',
          icon: 'cube',
          change: { value: 12.5, type: 'increase' },
          tooltipText: 'Total bookings in last 30 days',
        },
        {
          title: 'Revenue',
          value: '₹48,352',
          icon: 'cash',
          change: { value: 8.3, type: 'increase' },
          tooltipText: 'Total revenue generated',
        },
        {
          title: 'Active Deliveries',
          value: '78',
          icon: 'car',
          change: { value: 2.1, type: 'decrease' },
          tooltipText: 'Packages in transit',
        },
        {
          title: 'Open Tickets',
          value: '12',
          icon: 'help-circle',
          change: { value: 5.4, type: 'decrease' },
          tooltipText: 'Unresolved support tickets',
        },
      ];

      const mockRevenueData: RevenueData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43, 65],
            color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      };

      setKpiData(mockKpiData);
      setRevenueData(mockRevenueData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const pieData = [
    {
      name: 'Pending',
      population: 12,
      color: '#f59e0b',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'In Transit',
      population: 19,
      color: '#0066FF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Delivered',
      population: 65,
      color: '#10b981',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Cancelled',
      population: 4,
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
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Revenue Trend</Text>
          {revenueData && (
            <LineChart
              data={revenueData}
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
          )}
        </View>

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
});