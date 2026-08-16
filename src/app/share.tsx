import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Haptics from 'expo-haptics';

import QuoteCanvas, { CanvasStyle, CANVAS_THEMES, AspectRatioType } from '../components/QuoteCanvas';
import Toast from '../components/Toast';
import { useShareImage } from '../hooks/useShareImage';

// Semua quotes — diperlukan untuk mencari quote berdasarkan ID
import quotesData from '../../data/quotes_draft.json';
import { Quote } from '../types/quotes';

const allQuotes = quotesData as Quote[];

// Label tampilan untuk setiap gaya kanvas
const STYLE_OPTIONS: { key: CanvasStyle; label: string }[] = [
  { key: 'midnight', label: 'Hitam' },
  { key: 'kertas', label: 'Kertas' },
  { key: 'hujan', label: 'Abu' },
  { key: 'starry_night', label: 'Malam' },
  { key: 'black_coffee', label: 'Kopi' },
];

const RATIO_OPTIONS: { key: AspectRatioType; label: string }[] = [
  { key: '9:16', label: '9:16' },
  { key: '1:1', label: '1:1' },
  { key: '4:3', label: '4:3' },
  { key: '16:9', label: '16:9' },
];

export default function ShareScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ quoteId?: string; customText?: string; customAuthor?: string }>();
  const [activeStyle, setActiveStyle] = useState<CanvasStyle>('midnight');
  const [activeRatio, setActiveRatio] = useState<AspectRatioType>('9:16');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { canvasRef, isProcessing, saveToGallery, shareImage } = useShareImage();

  // Ukuran kanvas dinamis agar selalu fit di layar tanpa scroll
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Asumsi tinggi area kontrol bawah (sticky) + header atas + padding
  const reservedHeight = 440 + insets.top + insets.bottom; 
  const availableHeight = screenHeight - reservedHeight;
  const availableWidth = screenWidth - 64; // padding kiri-kanan 32

  let heightMultiplier = 16 / 9; // default 9:16
  if (activeRatio === '1:1') heightMultiplier = 1;
  else if (activeRatio === '4:3') heightMultiplier = 1440 / 1080; // 4:3 versi portrait (3:4)
  else if (activeRatio === '16:9') heightMultiplier = 1080 / 1920;
  
  const maxWidthByHeight = availableHeight / heightMultiplier;
  
  // Ambil ukuran terkecil agar kanvas tidak keluar dari batas lebar maupun tinggi
  const canvasSize = Math.min(availableWidth, maxWidthByHeight);

  // Helper untuk mendapatkan resolusi asli kanvas (HD)
  const getNativeWidth = (ratio: AspectRatioType) => {
    return ratio === '16:9' ? 1920 : 1080;
  };

  // Tentukan quote dari parameter (custom AI atau ID bawaan)
  let currentQuote = allQuotes[0];
  if (params.customText) {
    currentQuote = {
      id: 'custom',
      text: params.customText,
      author: params.customAuthor ?? 'Titik-Koma AI',
      source: '',
      category: allQuotes[0].category,
      language: allQuotes[0].language,
      length: allQuotes[0].length,
      tags: [],
    };
  } else if (params.quoteId) {
    currentQuote = allQuotes.find(q => q.id === params.quoteId) ?? allQuotes[0];
  }

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleStyleSelect = (style: CanvasStyle) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveStyle(style);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>PRATINJAU</Text>
        <View style={styles.closeButton} />
      </View>

      {/* Area Pratinjau Kanvas (Terlihat oleh User) */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.canvasScrollArea}
      >
        <View style={styles.canvasWrapper}>
          <View style={[styles.canvasFrame, { borderColor: '#1e1e1e' }]}>
            <QuoteCanvas
              quoteText={currentQuote.text}
              author={currentQuote.author}
              source={currentQuote.source}
              canvasStyle={activeStyle}
              ratio={activeRatio}
              size={canvasSize}
            />
          </View>
        </View>
      </ScrollView>

      {/* Kanvas High-Res Tersembunyi (Untuk di-capture oleh ViewShot) */}
      <View style={{ position: 'absolute', top: -10000, left: -10000 }} pointerEvents="none">
        <ViewShot
          ref={canvasRef}
          options={{ format: 'png', quality: 1.0, result: 'tmpfile' }}
        >
          <QuoteCanvas
            quoteText={currentQuote.text}
            author={currentQuote.author}
            source={currentQuote.source}
            canvasStyle={activeStyle}
            ratio={activeRatio}
            size={getNativeWidth(activeRatio)} // Resolusi native penuh tanpa di-scale down
          />
        </ViewShot>
      </View>

      {/* Area Kontrol (Sticky Bottom) */}
      <View style={[styles.controlsArea, { paddingBottom: insets.bottom + 24 }]}>
        {/* Pilihan Rasio */}
        <View style={styles.styleSection}>
          <Text style={styles.styleSectionLabel}>RASIO KANVAS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ratioList}>
            {RATIO_OPTIONS.map(({ key, label }) => {
              const isActive = activeRatio === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveRatio(key);
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.ratioTab,
                    isActive && styles.ratioTabActive
                  ]}
                >
                  <Text style={[
                    styles.ratioLabel,
                    isActive && styles.ratioLabelActive
                  ]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Pilihan Gaya */}
        <View style={styles.styleSection}>
          <Text style={styles.styleSectionLabel}>PILIH GAYA</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.styleList}
          >
            {STYLE_OPTIONS.map(({ key, label }) => {
              const theme = CANVAS_THEMES[key];
              const isActive = activeStyle === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleStyleSelect(key)}
                  activeOpacity={0.7}
                  style={styles.styleThumbnailWrapper}
                >
                  {/* Thumbnail mini preview warna */}
                  <View
                    style={[
                      styles.styleThumbnail,
                      {
                        backgroundColor: theme.background,
                        borderColor: isActive ? '#f0f0f0' : '#222',
                        borderWidth: isActive ? 1 : 1,
                      },
                    ]}
                  >
                    {/* Garis kecil simulasi teks */}
                    <View style={[styles.thumbLine, { backgroundColor: theme.quoteColor, width: '70%' }]} />
                    <View style={[styles.thumbLine, { backgroundColor: theme.quoteColor, width: '90%', marginTop: 4 }]} />
                    <View style={[styles.thumbLine, { backgroundColor: theme.quoteColor, width: '60%', marginTop: 4 }]} />
                    <View style={[styles.thumbLine, { backgroundColor: theme.authorColor, width: '40%', marginTop: 10 }]} />
                  </View>
                  <Text style={[styles.thumbLabel, isActive && styles.thumbLabelActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.actionRow}>
          {/* Simpan ke galeri */}
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonOutline]}
            activeOpacity={0.7}
            onPress={() => saveToGallery(showToast)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#f0f0f0" size="small" />
            ) : (
              <Text style={styles.actionButtonOutlineText}>SIMPAN</Text>
            )}
          </TouchableOpacity>

          {/* Bagikan langsung */}
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonFilled]}
            activeOpacity={0.7}
            onPress={() => shareImage(showToast)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text style={styles.actionButtonFilledText}>BAGIKAN</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  title: {
    color: '#2a2a2a',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 4,
    textAlign: 'center',
  },
  canvasScrollArea: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  controlsArea: {
    paddingHorizontal: 32,
    paddingTop: 16,
    gap: 28,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    backgroundColor: '#0a0a0a',
  },
  canvasWrapper: {
    alignItems: 'center',
  },
  canvasFrame: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  styleSection: {
    gap: 12,
  },
  styleSectionLabel: {
    color: '#444',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 2,
    paddingHorizontal: 0,
  },
  ratioList: {
    flexDirection: 'row',
    gap: 8,
  },
  ratioTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#0a0a0a',
  },
  ratioTabActive: {
    borderColor: '#f0f0f0',
    backgroundColor: '#f0f0f0',
  },
  ratioLabel: {
    color: '#888',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  ratioLabelActive: {
    color: '#0a0a0a',
    fontFamily: 'Inter_700Bold',
  },
  styleList: {
    flexDirection: 'row',
    gap: 12,
  },
  styleThumbnailWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  styleThumbnail: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  thumbLine: {
    height: 2,
    borderRadius: 1,
    opacity: 0.8,
  },
  thumbLabel: {
    color: '#444',
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  thumbLabelActive: {
    color: '#f0f0f0',
    fontFamily: 'Inter_500Medium',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonOutline: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonFilled: {
    backgroundColor: '#f0f0f0',
  },
  actionButtonOutlineText: {
    color: '#f0f0f0',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 2,
  },
  actionButtonFilledText: {
    color: '#000',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 2,
  },
});
