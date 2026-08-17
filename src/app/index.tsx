import { StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

import { useQuotes, FilterCategory } from '../hooks/useQuotes';
import { useBookmarks } from '../hooks/useBookmarks';
import { useTheme } from '../context/ThemeContext';
import { useDailyQuote } from '../hooks/useDailyQuote';
import QuoteDisplay from '../components/QuoteDisplay';
import CategoryFilter from '../components/CategoryFilter';
import BookmarkButton from '../components/BookmarkButton';
import BottomNav, { TabName } from '../components/BottomNav';
import Toast from '../components/Toast';
import DailyQuoteCard from '../components/DailyQuoteCard';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ showQuoteId?: string }>();
  const { themeMode, theme } = useTheme();
  const { currentQuote, activeCategory, setCategory, nextQuote, setSpecificQuoteById } = useQuotes();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const { quote: dailyQuote, isLoading: isDailyLoading, formattedDate } = useDailyQuote();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // Cek apakah ada param showQuoteId untuk menampilkan quote tertentu dari koleksi
  useEffect(() => {
    if (params.showQuoteId) {
      setSpecificQuoteById(params.showQuoteId);
      // Reset param secara manual dengan replace agar tidak tersangkut jika user swipe kembali
      router.setParams({ showQuoteId: '' });
    }
  }, [params.showQuoteId, setSpecificQuoteById]);

  // Menangani pergantian kategori dengan haptic ringan
  const handleCategorySelect = (category: FilterCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCategory(category);
  };

  // Menangani tombol "CARI RASA" dengan haptic sedang
  const handleNextQuote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nextQuote();
  };

  // Menangani kopi ke clipboard dengan haptic sukses dan Toast
  const handleCopy = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const textToCopy = `"${currentQuote.text}"\n— ${currentQuote.author}`;
    await Clipboard.setStringAsync(textToCopy);
    showToast('Tersalin ✓');
  };

  // Menangani kopi kutipan harian ke clipboard
  const handleCopyDaily = async () => {
    if (!dailyQuote) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const textToCopy = `"${dailyQuote.text}"\n— ${dailyQuote.author}`;
    await Clipboard.setStringAsync(textToCopy);
    showToast('Tersalin ✓');
  };

  // Menangani simpan ke koleksi
  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const wasBookmarked = isBookmarked(currentQuote.id);
    toggleBookmark(currentQuote);
    showToast(wasBookmarked ? 'Dihapus dari koleksi' : 'Tersimpan di koleksi ✓');
  };

  // Menangani navigasi antar tab
  const handleTabPress = (tab: TabName) => {
    if (tab === 'index') return;
    router.replace(`/${tab}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + 16 }]}>
      <StatusBar
        barStyle={themeMode === 'midnight' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Nama aplikasi — tengah atas */}
      <Text style={[styles.appName, { color: theme.textGhost }]}>TITIK—KOMA</Text>

      {/* Kartu Kutipan Hari Ini */}
      {!isDailyLoading && dailyQuote && (
        <DailyQuoteCard
          quote={dailyQuote}
          formattedDate={formattedDate}
          onCopy={handleCopyDaily}
          theme={theme}
        />
      )}

      {/* Filter Kategori */}
      <View style={styles.filterArea}>
        <CategoryFilter
          activeCategory={activeCategory}
          onSelect={handleCategorySelect}
        />
      </View>

      {/* Area Konten Quote Utama */}
      <QuoteDisplay quote={currentQuote} onPress={handleCopy} />

      {/* Baris bawah: tombol bookmark + tombol utama + tombol share */}
      <View style={[styles.bottomBar, { marginBottom: 12 }]}>
        <BookmarkButton
          isBookmarked={isBookmarked(currentQuote.id)}
          onPress={handleBookmark}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.buttonBg, borderColor: theme.border }]}
          activeOpacity={0.7}
          onPress={handleNextQuote}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>CARI RASA</Text>
        </TouchableOpacity>
        {/* Tombol ke halaman Share as Image */}
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: theme.buttonBg, borderColor: theme.border }]}
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push({ pathname: '/share', params: { quoteId: currentQuote.id } });
          }}
        >
          <Ionicons name="paper-plane-outline" size={20} color={theme.buttonText} />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab="index" onTabPress={handleTabPress} />

      {/* Toast Notifikasi */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  appName: {
    color: '#2a2a2a',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 20,
  },
  filterArea: {
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    letterSpacing: 3,
  },
  shareButton: {
    width: 44,
    height: 56,
    borderWidth: 1,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
