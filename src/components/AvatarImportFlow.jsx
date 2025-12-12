import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
  TextInput,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { getAvatarCreatorUrl, extractAvatarUrl, isValidAvatarUrl } from '../services/readyPlayerMe';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/fonts';

const AvatarImportFlow = ({ visible, onClose, onAvatarImported }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [loadTimeout, setLoadTimeout] = React.useState(false);
  const [manualUrl, setManualUrl] = React.useState('');
  const loadingRef = React.useRef(true);

  React.useEffect(() => {
    if (visible) {
      setLoading(true);
      setError(null);
      setLoadTimeout(false);
      setManualUrl('');
      loadingRef.current = true;
      
      // Set timeout for loading
      const timer = setTimeout(() => {
        if (loadingRef.current) {
          setLoadTimeout(true);
          setLoading(false);
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    
    // Check if this is the callback with avatar URL
    if (url.includes('?url=')) {
      const avatarUrl = extractAvatarUrl(url);
      
      if (avatarUrl && isValidAvatarUrl(avatarUrl)) {
        onAvatarImported(avatarUrl);
        onClose();
      } else {
        setError('Invalid avatar URL received');
      }
    }
  };

  const handleManualImport = () => {
    const trimmedUrl = manualUrl.trim();
    if (isValidAvatarUrl(trimmedUrl)) {
      onAvatarImported(trimmedUrl);
      onClose();
    } else {
      setError('Invalid avatar URL. Please enter a valid Ready Player Me .glb URL');
    }
  };

  const openInBrowser = () => {
    const url = getAvatarCreatorUrl();
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Import Avatar</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Create or select your Ready Player Me avatar, or paste your avatar URL below.
          </Text>
        </View>

        {/* Manual URL Input */}
        <View style={styles.urlInputSection}>
          <Text style={styles.urlInputLabel}>Or paste your avatar URL:</Text>
          <View style={styles.urlInputWrapper}>
            <TextInput
              style={styles.urlInput}
              placeholder="https://models.readyplayer.me/..."
              placeholderTextColor={colors.textSecondary}
              value={manualUrl}
              onChangeText={setManualUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={[styles.importButton, !manualUrl.trim() && styles.importButtonDisabled]}
              onPress={handleManualImport}
              disabled={!manualUrl.trim()}
            >
              <Text style={styles.importButtonText}>Import</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading state */}
        {loading && !loadTimeout && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.teal} />
            <Text style={styles.loadingText}>Loading avatar creator...</Text>
          </View>
        )}

        {/* Timeout/Error state */}
        {(loadTimeout || error) && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.healthYellow2} />
            <Text style={styles.errorTitle}>
              {error || 'Taking longer than expected'}
            </Text>
            <Text style={styles.errorSubtext}>
              You can open Ready Player Me in a new browser tab instead.
            </Text>
            <TouchableOpacity style={styles.browserButton} onPress={openInBrowser}>
              <Ionicons name="open-outline" size={20} color={colors.white} />
              <Text style={styles.browserButtonText}>Open in Browser</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => {
                setError(null);
                setLoadTimeout(false);
                setLoading(true);
              }}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* WebView */}
        {!error && !loadTimeout && (
          <WebView
            source={{ uri: getAvatarCreatorUrl() }}
            style={styles.webview}
            onLoadStart={() => {
              setLoading(true);
              loadingRef.current = true;
            }}
            onLoadEnd={() => {
              setLoading(false);
              loadingRef.current = false;
            }}
            onNavigationStateChange={handleNavigationStateChange}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              setError(`Failed to load: ${nativeEvent.description}`);
              setLoading(false);
              loadingRef.current = false;
            }}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes['2xl'],
    color: colors.textDark,
  },
  closeButton: {
    padding: 8,
  },
  instructions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
  },
  instructionText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textDark,
    lineHeight: 20,
  },
  urlInputSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  urlInputLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textDark,
    marginBottom: 8,
  },
  urlInputWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textDark,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  importButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.teal,
    borderRadius: 8,
    justifyContent: 'center',
  },
  importButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  importButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    zIndex: 10,
  },
  loadingText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.textDark,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.lg,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: 16,
  },
  errorSubtext: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  browserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.teal,
    borderRadius: 8,
    marginBottom: 12,
  },
  browserButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    color: colors.white,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.teal,
  },
  retryText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    color: colors.teal,
  },
});

export default AvatarImportFlow;
