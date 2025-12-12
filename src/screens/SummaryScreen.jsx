import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';
import useStore from '../store/useStore';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/fonts';
import strings from '../locales/strings.json';

const { width } = Dimensions.get('window');

const SummaryScreen = ({ navigation }) => {
  const {
    summaryRange,
    setSummaryRange,
    weeklySpending,
    categoryDistribution,
    goalCompletionPercentage,
  } = useStore();

  const ranges = [30, 60, 90];

  // Prepare pie chart data
  const pieData = [
    {
      value: categoryDistribution.rent,
      svg: { fill: colors.chartPieRent },
      key: 'rent',
      label: strings.en.categories.rent,
    },
    {
      value: categoryDistribution.emi,
      svg: { fill: colors.chartPieEMI },
      key: 'emi',
      label: strings.en.categories.emi,
    },
    {
      value: categoryDistribution.miscellaneous,
      svg: { fill: colors.chartPieMisc },
      key: 'misc',
      label: strings.en.categories.miscellaneous,
    },
    {
      value: categoryDistribution.grocery,
      svg: { fill: colors.chartPieGrocery },
      key: 'grocery',
      label: strings.en.categories.grocery,
    },
    {
      value: categoryDistribution.travel,
      svg: { fill: colors.chartPieTravel },
      key: 'travel',
      label: strings.en.categories.travel,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={[colors.backgroundDark, colors.backgroundNavy, colors.backgroundTeal]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="person-circle-outline" size={40} color={colors.teal} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Avatar')} style={styles.bookButton}>
          <Ionicons name="book-outline" size={32} color={colors.teal} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and dropdown */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{strings.en.summary.title}</Text>
          <View style={styles.titleUnderline} />
        </View>

        <View style={styles.dropdownContainer}>
          {ranges.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.dropdownButton,
                summaryRange === range && styles.dropdownButtonActive,
              ]}
              onPress={() => setSummaryRange(range)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  summaryRange === range && styles.dropdownTextActive,
                ]}
              >
                {range} Days
              </Text>
              {summaryRange === range && (
                <Ionicons name="chevron-down" size={16} color={colors.textDark} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar Chart Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.en.summary.spending}</Text>
          
          <View style={styles.chartContainer}>
            <BarChart
              style={{ height: 200, flex: 1 }}
              data={weeklySpending}
              svg={{ fill: colors.chartBar }}
              contentInset={{ top: 20, bottom: 20 }}
              spacing={0.3}
              gridMin={0}
              gridMax={12000}
            />
          </View>
          
          <View style={styles.xAxisLabels}>
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((label, index) => (
              <Text key={index} style={styles.xAxisLabel}>
                {label}
              </Text>
            ))}
          </View>
        </View>

        {/* Pie Chart Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.en.summary.spendingDistribution}</Text>
          
          <View style={styles.pieChartContainer}>
            <PieChart
              style={{ height: 250, width: 250 }}
              data={pieData}
              innerRadius={0}
              outerRadius={'100%'}
              labelRadius={'110%'}
            />
          </View>
          
          {/* Legend */}
          <View style={styles.legend}>
            {pieData.map((item) => (
              <View key={item.key} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: item.svg.fill }]}
                />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Goal Completion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.en.summary.goalCompletion}</Text>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <LinearGradient
                colors={[colors.healthGreen1, colors.white]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressBarFill,
                  { width: `${goalCompletionPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercentage}>{goalCompletionPercentage}%</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {},
  bookButton: {},
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes['3xl'],
    color: colors.textPrimary,
  },
  titleUnderline: {
    width: 100,
    height: 3,
    backgroundColor: colors.teal,
    marginTop: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(77, 208, 225, 0.2)',
    gap: 6,
  },
  dropdownButtonActive: {
    backgroundColor: colors.teal,
  },
  dropdownText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  dropdownTextActive: {
    color: colors.textDark,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.xl,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  chartContainer: {
    height: 200,
    marginBottom: 10,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  xAxisLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  progressBarContainer: {
    position: 'relative',
  },
  progressBarBackground: {
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 15,
  },
  progressPercentage: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -20 }, { translateY: -10 }],
    fontFamily: fonts.bold,
    fontSize: fontSizes.base,
    color: colors.textDark,
  },
});

export default SummaryScreen;
