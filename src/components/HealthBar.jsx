import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const HealthBar = ({ score = 63 }) => {
  const animatedWidth = useSharedValue(0);

  React.useEffect(() => {
    animatedWidth.value = withSpring(score, {
      damping: 15,
      stiffness: 100,
    });
  }, [score]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      {/* Heart icon */}
      <View style={styles.heartContainer}>
        <Ionicons
          name="heart"
          size={28}
          color={colors.healthRed}
        />
      </View>

      {/* Gradient bar */}
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, animatedStyle]}>
          <LinearGradient
            colors={[
              colors.healthRed,
              '#FF6B35',
              '#FF8C42',
              '#FFA500',
              '#FFB84D',
              '#FFD166',
              '#F4E04D',
              '#C7EA46',
              '#A8E05F',
              '#8FD14F',
              colors.healthGreen1,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  heartContainer: {
    marginRight: 12,
  },
  barBackground: {
    flex: 1,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    height: '100%',
  },
});

export default HealthBar;
