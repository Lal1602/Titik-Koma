import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { Quote } from '../types/quotes';

interface DailyQuoteCardProps {
  quote: Quote;
  formattedDate: string;
  onCopy: () => void;
  theme: {
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    background: string;
  };
}

const DailyQuoteCard: React.FC<DailyQuoteCardProps> = ({ quote, formattedDate, onCopy, theme }) => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
  }, []);

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onCopy}
        accessibilityLabel={'Kutipan hari ini: ' + quote.text + ', oleh ' + quote.author}
        accessibilityHint="Ketuk untuk menyalin teks"
        style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        {/* Header row */}
        <View style={styles.header}>
          <Text style={[styles.label, { color: theme.textMuted }]}>KUTIPAN HARI INI</Text>
          <Ionicons name="calendar-outline" size={14} color={theme.textMuted} />
        </View>

        {/* Garis pemisah */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Teks quote */}
        <Text style={[styles.quoteText, { color: theme.textPrimary }]}>
          "{quote.text}"
        </Text>

        {/* Penulis */}
        <Text style={[styles.author, { color: theme.textSecondary }]}>
          — {quote.author}
        </Text>
      </TouchableOpacity>

      {/* Tanggal hari ini di bawah kartu */}
      <Text style={[styles.date, { color: theme.textMuted }]}>{formattedDate}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  card: {
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 2,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  quoteText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 10,
  },
  author: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    textAlign: 'right',
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 8,
  },
});

export default DailyQuoteCard;
