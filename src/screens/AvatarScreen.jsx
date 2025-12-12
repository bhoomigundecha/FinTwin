import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import AvatarPlaceholder from '../components/AvatarPlaceholder';
import SideControls from '../components/SideControls';
import HealthBar from '../components/HealthBar';
import AvatarImportFlow from '../components/AvatarImportFlow';
import useStore from '../store/useStore';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/fonts';
import strings from '../locales/strings.json';

const { width, height } = Dimensions.get('window');

const AvatarScreen = ({ navigation }) => {
  const { avatarUrl, healthScore, setAvatarUrl } = useStore();
  const [showImportModal, setShowImportModal] = React.useState(false);

  const handleAvatarImported = (url) => {
    setAvatarUrl(url);
  };

  const getHealthMessage = () => {
    if (healthScore >= 81) return strings.en.home.healthMessageExcellent;
    if (healthScore >= 61) return strings.en.home.healthMessageGood;
    if (healthScore >= 41) return strings.en.home.healthMessageFair;
    if (healthScore >= 21) return strings.en.home.healthMessagePoor;
    return strings.en.home.healthMessagePoor;
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={[colors.backgroundDark, colors.backgroundNavy, colors.backgroundTeal]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Particle background */}
      <ParticleBackground />

      {/* Profile icon (top left) */}
      <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
        <Ionicons name="person-circle-outline" size={40} color={colors.teal} />
      </TouchableOpacity>

      {/* Side controls */}
      <SideControls
        onAddPress={() => setShowImportModal(true)}
        onBookPress={() => navigation.navigate('Summary')}
        onNotificationPress={() => navigation.navigate('Chat')}
        onVolumePress={() => navigation.navigate('Chat')}
      />

      {/* Avatar container */}
      <View style={styles.avatarContainer}>
        <AvatarPlaceholder avatarUrl={avatarUrl} healthScore={healthScore} />
      </View>

      {/* Bottom panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.panelContent}>
          <Text style={styles.healthMessage}>{getHealthMessage()}</Text>
          <HealthBar score={healthScore} />
        </View>
        
        {/* Bottom indicator */}
        <View style={styles.bottomIndicator} />
      </View>

      {/* Avatar Import Modal */}
      <AvatarImportFlow
        visible={showImportModal}
        onClose={() => setShowImportModal(false)}
        onAvatarImported={handleAvatarImported}
      />
    </View>
  );
};

// Particle background component
const ParticleBackground = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
  }));

  return (
    <View style={styles.particleContainer}>
      {particles.map((particle) => (
        <Particle key={particle.id} {...particle} />
      ))}
    </View>
  );
};

const Particle = ({ x, y, size }) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 2000 + Math.random() * 2000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  particleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: colors.white,
  },
  profileButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  avatarContainer: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: [{ translateX: -width * 0.35 }],
    width: width * 0.7,
    height: height * 0.5,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 29, 58, 0.9)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 30,
  },
  panelContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  healthMessage: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  bottomIndicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.textSecondary,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
});

export default AvatarScreen;
