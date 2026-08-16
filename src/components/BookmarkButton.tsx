import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../context/ThemeContext';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onPress: () => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onPress }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(1.3, { damping: 5 }, () => {
      scale.value = withSpring(1, { damping: 8 });
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.button, { borderColor: theme.border, backgroundColor: theme.buttonBg }]}
    >
      <Animated.Text style={[styles.icon, animatedStyle, { color: theme.buttonText }]}>
        {isBookmarked ? '★' : '☆'}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 56,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  icon: {
    fontSize: 20,
  },
});

export default BookmarkButton;
