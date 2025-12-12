import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { getAvatarViewerUrl } from '../services/readyPlayerMe';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/fonts';

const AvatarPlaceholder = ({ avatarUrl, healthScore = 63, onAvatarLoaded }) => {
  const [loading, setLoading] = React.useState(false);
  const [cacheKey] = React.useState(Date.now()); // Cache-busting key

  // Get overlay color based on health score
  const getOverlayColor = () => {
    if (healthScore >= 81) return 'rgba(68, 255, 136, 0.2)'; // Green glow
    if (healthScore >= 61) return 'rgba(136, 255, 68, 0.2)'; // Lime glow
    if (healthScore >= 41) return 'rgba(255, 221, 68, 0.2)'; // Yellow tint
    if (healthScore >= 21) return 'rgba(255, 136, 68, 0.2)'; // Orange tint
    return 'rgba(255, 68, 68, 0.3)'; // Red vignette
  };

  if (!avatarUrl) {
    // Placeholder skeleton
    return (
      <View style={styles.placeholder}>
        <View style={styles.skeletonHead} />
        <View style={styles.skeletonBody} />
        <Text style={styles.placeholderText}>No avatar loaded</Text>
        <Text style={styles.placeholderSubtext}>Import from Ready Player Me</Text>
      </View>
    );
  }

  const viewerUrl = getAvatarViewerUrl(avatarUrl) + `#${cacheKey}`;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.teal} />
        </View>
      )}
      
      {Platform.OS === 'web' ? (
        <iframe
          src={viewerUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: 'transparent',
          }}
          onLoad={() => {
            setLoading(false);
            onAvatarLoaded?.();
          }}
        />
      ) : (
        <WebView
          source={{ uri: viewerUrl }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => {
            setLoading(false);
            onAvatarLoaded?.();
          }}
        />
      )}
      
      {/* Health-based overlay */}
      <View
        style={[
          styles.overlay,
          { backgroundColor: getOverlayColor() },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  skeletonHead: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(77, 208, 225, 0.3)',
    marginBottom: 16,
  },
  skeletonBody: {
    width: 120,
    height: 160,
    borderRadius: 60,
    backgroundColor: 'rgba(77, 208, 225, 0.2)',
    marginBottom: 16,
  },
  placeholderText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginTop: 16,
  },
  placeholderSubtext: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
});

export default AvatarPlaceholder;
