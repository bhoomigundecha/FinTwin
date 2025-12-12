import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const SideControls = ({ onAddPress, onBookPress, onNotificationPress, onVolumePress }) => {
  const controls = [
    { icon: 'add', onPress: onAddPress },
    { icon: 'book', onPress: onBookPress },
    { icon: 'notifications-outline', onPress: onNotificationPress },
    { icon: 'volume-high-outline', onPress: onVolumePress },
  ];

  return (
    <View style={styles.container}>
      {controls.map((control, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={control.onPress}
          activeOpacity={0.7}
        >
          <Ionicons name={control.icon} size={24} color={colors.teal} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    top: '15%',
    gap: 16,
    zIndex: 5,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(26, 29, 58, 0.6)',
    borderWidth: 2,
    borderColor: colors.controlBorder,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.teal,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default SideControls;
