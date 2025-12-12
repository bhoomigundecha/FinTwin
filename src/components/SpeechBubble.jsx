import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/fonts';

const SpeechBubble = ({ text, visible = true }) => {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(200)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      {/* Pointer triangle */}
      <View style={styles.pointer} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '25%',
    right: 20,
    maxWidth: 200,
    zIndex: 10,
  },
  bubble: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.textDark,
    lineHeight: 22,
  },
  pointer: {
    position: 'absolute',
    bottom: -8,
    left: 30,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.white,
  },
});

export default SpeechBubble;
