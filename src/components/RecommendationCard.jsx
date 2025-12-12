import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/fonts';

const RecommendationCard = ({ pros = [], cons = [], overall = '' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Pros section */}
        {pros.length > 0 && (
          <View style={styles.section}>
            {pros.map((pro, index) => (
              <View key={`pro-${index}`} style={styles.item}>
                <Ionicons name="checkmark-circle" size={20} color={colors.healthGreen1} />
                <Text style={styles.itemText}>{pro}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Cons section */}
        {cons.length > 0 && (
          <View style={styles.section}>
            {cons.map((con, index) => (
              <View key={`con-${index}`} style={styles.item}>
                <Ionicons name="close-circle" size={20} color={colors.healthRed} />
                <Text style={styles.itemText}>{con}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Overall section */}
        {overall && (
          <View style={styles.overallSection}>
            <Text style={styles.overallLabel}>Overall :</Text>
            <Text style={styles.overallText}>{overall}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: 'rgba(26, 29, 58, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(77, 208, 225, 0.2)',
    padding: 16,
  },
  section: {
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  itemText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  overallSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(77, 208, 225, 0.2)',
  },
  overallLabel: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
    color: colors.teal,
    marginBottom: 4,
  },
  overallText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default RecommendationCard;
