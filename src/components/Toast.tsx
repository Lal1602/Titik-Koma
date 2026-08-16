import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

/**
 * Komponen notifikasi sementara yang muncul dari bawah dan otomatis menghilang.
 * Digunakan sebagai pengganti Alert.alert() agar terasa lebih premium.
 */
const Toast: React.FC<ToastProps> = ({ visible, message, onHide }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      // Muncul
      opacity.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) });
      translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });

      // Auto-dismiss setelah 2 detik
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(20, { duration: 300 });
        setTimeout(onHide, 300);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, animatedStyle]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  toastText: {
    color: '#f0f0f0',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});

export default Toast;
