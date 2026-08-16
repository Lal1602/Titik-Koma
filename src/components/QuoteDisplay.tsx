import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Quote } from '../types/quotes';
import { useTheme } from '../context/ThemeContext';

interface QuoteDisplayProps {
  quote: Quote;
  onPress: () => void;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, onPress }) => {
  const { theme } = useTheme();
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const previousQuoteId = useRef(quote.id);

  useEffect(() => {
    if (previousQuoteId.current !== quote.id) {
      previousQuoteId.current = quote.id;

      opacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.in(Easing.ease),
      });
      translateY.value = withTiming(-8, { duration: 200 });

      opacity.value = withDelay(
        300,
        withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
      );
      translateY.value = withDelay(
        300,
        withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
      );
    }
  }, [quote.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const dynamicStyles = useMemo(() => {
    const len = quote.text.length;
    if (len > 120) {
      return { fontSize: 18, lineHeight: 28 };
    } else if (len > 70) {
      return { fontSize: 21, lineHeight: 32 };
    } else if (len > 40) {
      return { fontSize: 24, lineHeight: 36 };
    }
    return { fontSize: 28, lineHeight: 40 };
  }, [quote.text.length]);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Animated.View style={[animatedStyle, { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }]}>
        <Text 
          style={[styles.quoteText, { color: theme.textPrimary }, dynamicStyles]}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.5}
          numberOfLines={10}
        >
          "{quote.text}"
        </Text>
        <Text style={[styles.authorText, { color: theme.textSecondary }]}>— {quote.author}</Text>
        {quote.source && (
          <Text style={[styles.sourceText, { color: theme.textMuted }]}>{quote.source}</Text>
        )}
        <Text style={[styles.hintText, { color: theme.textGhost }]}>↑ sentuh untuk menyalin</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  quoteText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  authorText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 15,
    textAlign: 'center',
  },
  sourceText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  hintText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 40,
    letterSpacing: 0.5,
  },
});

export default QuoteDisplay;
