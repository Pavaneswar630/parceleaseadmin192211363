import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface KpiCardProps {
  title: string;
  value: string;
  icon: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  tooltipText?: string;
}

export default function KpiCard({ title, value, icon, change }: KpiCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={24} color={Colors.primary} />
        </View>
        {change && (
          <View style={[
            styles.changeContainer,
            { backgroundColor: change.type === 'increase' ? Colors.success : Colors.error }
          ]}>
            <Ionicons 
              name={change.type === 'increase' ? 'trending-up' : 'trending-down'} 
              size={12} 
              color="white" 
            />
            <Text style={styles.changeText}>{change.value}%</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  changeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});