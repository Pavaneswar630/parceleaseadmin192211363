import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: Colors.warning, text: 'Pending' };
      case 'in-transit':
      case 'in_transit':
        return { bg: Colors.primary, text: 'In Transit' };
      case 'delivered':
        return { bg: Colors.success, text: 'Delivered' };
      case 'cancelled':
        return { bg: Colors.error, text: 'Cancelled' };
      case 'confirmed':
        return { bg: Colors.success, text: 'Confirmed' };
      case 'active':
        return { bg: Colors.success, text: 'Active' };
      case 'blocked':
        return { bg: Colors.error, text: 'Blocked' };
      case 'open':
        return { bg: Colors.primary, text: 'Open' };
      case 'closed':
        return { bg: Colors.gray, text: 'Closed' };
      case 'failed':
        return { bg: Colors.error, text: 'Failed' };
      case 'picked-up':
        return { bg: Colors.primary, text: 'Picked Up' };
      case 'out-for-delivery':
        return { bg: Colors.accent, text: 'Out for Delivery' };
      default:
        return { bg: Colors.gray, text: status };
    }
  };

  const config = getStatusConfig();
  const isSmall = size === 'sm';

  return (
    <View style={[
      styles.container,
      { backgroundColor: config.bg },
      isSmall ? styles.small : styles.medium
    ]}>
      <Text style={[
        styles.text,
        isSmall ? styles.smallText : styles.mediumText
      ]}>
        {config.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
});