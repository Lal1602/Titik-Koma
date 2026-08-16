import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { useBookmarks } from '../hooks/useBookmarks';
import { Quote } from '../types/quotes';
import Toast from '../components/Toast';
import { useState } from 'react';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handlePressQuote = (quote: Quote) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/', params: { showQuoteId: quote.id } });
  };

  const handleDelete = (quote: Quote) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Hapus dari Koleksi?',
      `"${quote.text.slice(0, 50)}${quote.text.length > 50 ? '...' : ''}"`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            toggleBookmark(quote);
            showToast('Dihapus dari koleksi');
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Quote }) => (
    <View style={styles.card}>
      {/* Teks quote — bisa ditekan untuk copy */}
      <Pressable style={styles.cardContent} onPress={() => handlePressQuote(item)}>
        <Text style={styles.quoteText}>"{item.text}"</Text>
        <Text style={styles.authorText}>— {item.author}</Text>
        {item.source && <Text style={styles.sourceText}>{item.source}</Text>}
        <Text style={styles.categoryBadge}>{item.category.toUpperCase()}</Text>
      </Pressable>

      {/* Tombol hapus — pojok kanan atas */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        {/* Tombol kembali */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>KOLEKSI</Text>

        {/* Spacer agar title tetap di tengah */}
        <View style={styles.backButton} />
      </View>

      {/* Counter jumlah bookmark */}
      <Text style={styles.counter}>
        {bookmarks.length} {bookmarks.length === 1 ? 'kalimat' : 'kalimat'} tersimpan
      </Text>

      {/* Daftar atau tampilan kosong */}
      {bookmarks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>☆</Text>
          <Text style={styles.emptyText}>Belum ada yang disimpan.</Text>
          <Text style={styles.emptySubText}>
            Tekan ikon bintang di layar utama untuk menyimpan kalimat favoritmu.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 24 },
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  backText: {
    color: '#f0f0f0',
    fontSize: 22,
    fontFamily: 'Inter_400Regular',
  },
  title: {
    color: '#2a2a2a',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 4,
    textAlign: 'center',
  },
  counter: {
    color: '#444',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    letterSpacing: 0.5,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    padding: 20,
    backgroundColor: '#111',
    position: 'relative',
  },
  cardContent: {
    paddingRight: 32, // Beri ruang untuk tombol delete
  },
  quoteText: {
    color: '#f0f0f0',
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 12,
  },
  authorText: {
    color: '#888',
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
  },
  sourceText: {
    color: '#444',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 4,
  },
  categoryBadge: {
    color: '#333',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    color: '#444',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
    marginVertical: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyIcon: {
    fontSize: 40,
    color: '#222',
    marginBottom: 16,
  },
  emptyText: {
    color: '#444',
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#2a2a2a',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
