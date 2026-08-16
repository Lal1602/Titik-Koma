import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import BottomNav, { TabName } from '../components/BottomNav';
import Toast from '../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

// Key untuk counter statistik curhat
const CURHAT_COUNT_KEY = '@titikkoma_curhat_count';

// Daftar model Gemini yang tersedia untuk round-robin
// Urutan dari yang paling baru dan cepat ke yang lebih lama
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemma-4-27b-it',
  'gemma-4-12b-it',
];

// Posisi model saat ini — disimpan di luar komponen agar persisten (sticky)
// Tidak di-reset setiap kali komponen re-render
let currentModelIndex = 0;

// Batas maksimum karakter input
const MAX_INPUT_LENGTH = 280;

// System prompt yang dikirim ke Gemini API
const SYSTEM_PROMPT = `Kamu adalah penyair digital bernama "Titik-Koma". Tugasmu adalah mengubah perasaan yang diceritakan user menjadi satu kalimat yang puitis, estetis, dan relate — dalam gaya sastra Indonesia modern atau bahasa Inggris yang elegan.

Aturan ketat:
1. Output HANYA berupa satu kalimat quotes (bukan paragraf, bukan penjelasan, bukan intro)
2. Panjang maksimal 200 karakter
3. Gaya bahasa: sastrawi tapi tidak lebay, seperti Sapardi atau Rumi versi modern
4. Boleh menggunakan metafora alam, waktu, atau benda sehari-hari
5. TIDAK BOLEH menggunakan kata-kata klise seperti: "jangan menyerah", "kamu kuat", "semangat ya"
6. Tidak perlu menyebut nama penulis atau sumber — cukup kalimatnya saja

Input dari user:`;

export default function CurhatScreen() {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { theme } = useTheme();

  // Animasi fade in untuk hasil quote
  const resultOpacity = useSharedValue(0);
  const resultTranslateY = useSharedValue(12);

  const resultAnimStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [{ translateY: resultTranslateY.value }],
  }));

  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const isApiKeyMissing = !apiKey;
  const isInputEmpty = inputText.trim().length === 0;

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  /**
   * Mencoba memanggil satu model Gemini.
   * Mengembalikan teks hasil, atau melempar error dengan status HTTP.
   */
  const callModel = async (modelName: string, prompt: string): Promise<string> => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey ?? '',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 100,
            temperature: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      // Lempar error dengan status agar caller bisa cek apakah 429
      throw new Error(`HTTP:${response.status}`);
    }

    const data = await response.json();
    const result: string = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) throw new Error('EMPTY_RESPONSE');
    return result;
  };

  /**
   * Sticky round-robin: mulai dari model terakhir yang berhasil.
   * Jika 429 (rate limit), geser ke model berikutnya.
   * Jika semua model habis, lempar error.
   */
  const callWithFallback = async (prompt: string): Promise<string> => {
    const totalModels = GEMINI_MODELS.length;

    for (let attempt = 0; attempt < totalModels; attempt++) {
      const index = (currentModelIndex + attempt) % totalModels;
      const modelName = GEMINI_MODELS[index];

      try {
        const result = await callModel(modelName, prompt);
        // Berhasil — simpan posisi ini sebagai "sticky" untuk request berikutnya
        currentModelIndex = index;
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        const isRateLimit = message.includes('HTTP:429');
        const isNotFound = message.includes('HTTP:404');

        if (isRateLimit || isNotFound) {
          // Rate limit atau model tidak tersedia — coba model berikutnya
          continue;
        }
        // Error lain (401, 500, network) — langsung lempar, tidak perlu coba model lain
        throw err;
      }
    }

    throw new Error('ALL_MODELS_EXHAUSTED');
  };

  // Mengirim request ke Gemini API dengan sticky round-robin fallback
  const handleGenerate = async () => {
    if (isInputEmpty || isLoading) return;

    setIsLoading(true);
    setGeneratedQuote(null);
    resultOpacity.value = 0;
    resultTranslateY.value = 12;

    try {
      const prompt = `${SYSTEM_PROMPT}\n\n${inputText.trim()}`;
      const result = await callWithFallback(prompt);

      // Bersihkan tanda kutip jika AI menambahkannya sendiri
      const cleaned = result.trim().replace(/^[""""]|[""""]$/g, '');
      setGeneratedQuote(cleaned);

      // Animasi fade in + slide up untuk menampilkan hasil
      resultOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
      resultTranslateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Tambah counter statistik curhat
      const current = await AsyncStorage.getItem(CURHAT_COUNT_KEY);
      const count = current ? parseInt(current, 10) + 1 : 1;
      await AsyncStorage.setItem(CURHAT_COUNT_KEY, String(count));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message === 'ALL_MODELS_EXHAUSTED') {
        showToast('Semua model sedang sibuk, coba beberapa saat lagi');
      } else if (message.includes('HTTP:401') || message.includes('HTTP:403')) {
        showToast('API key tidak valid');
      } else if (message.includes('HTTP:')) {
        // Tampilkan kode error untuk debugging sementara
        showToast(`Error ${message.replace('HTTP:', '')} — coba lagi`);
      } else {
        showToast('Gagal terhubung, coba lagi');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleCopy = async () => {
    if (!generatedQuote) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Clipboard.setStringAsync(`"${generatedQuote}"\n— Titik-Koma AI`);
    showToast('Tersalin ✓');
  };

  const handleShare = () => {
    if (!generatedQuote) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/share',
      params: { customText: generatedQuote, customAuthor: 'Titik-Koma AI' }
    });
  };

  const handleTabPress = (tab: TabName) => {
    if (tab === 'curhat') return;
    router.replace(tab === 'index' ? '/' : `/${tab}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + 16, backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background} />

        {/* Header */}
        <Text style={[styles.appName, { color: theme.textGhost }]}>TITIK—KOMA</Text>

        <ScrollView
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Label area input */}
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>CERITAKAN PERASAANMU</Text>

          {/* Area input curhat */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, { color: theme.textPrimary }]}
              multiline
              maxLength={MAX_INPUT_LENGTH}
              placeholder="ceritakan dulu, biar aku cariin kata-katanya..."
              placeholderTextColor={theme.textMuted}
              value={inputText}
              onChangeText={setInputText}
              textAlignVertical="top"
            />
            {/* Counter karakter */}
            <Text style={[styles.charCounter, { color: theme.textMuted }]}>
              {inputText.length}/{MAX_INPUT_LENGTH}
            </Text>
          </View>

          {/* Sentuhan Aesthetic saat kosong */}
          {!generatedQuote && isInputEmpty && (
            <View style={styles.emptyStateContainer}>
              <Text style={[styles.emptyStateText, { color: theme.textGhost }]}>
                Ruang aman untuk ceritamu.
              </Text>
            </View>
          )}

          {/* Pesan error jika API key tidak ada */}
          {isApiKeyMissing && (
            <Text style={[styles.apiKeyWarning, { color: theme.textSecondary }]}>
              ⚠ Fitur AI belum dikonfigurasi. Tambahkan EXPO_PUBLIC_GEMINI_API_KEY di file .env
            </Text>
          )}

          {/* Area hasil quote dari AI */}
          {generatedQuote && (
            <Animated.View style={[styles.resultArea, resultAnimStyle]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCopy}
                style={[styles.poetryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Text style={[styles.resultQuote, { color: theme.textPrimary }]}>"{generatedQuote}"</Text>
                <Text style={[styles.resultByline, { color: theme.textSecondary }]}>— Titik-Koma AI</Text>
                
                {/* Tombol Bagikan Kecil di Sudut */}
                <TouchableOpacity
                  style={[styles.miniShareBtn, { backgroundColor: theme.buttonBg, borderColor: theme.border }]}
                  activeOpacity={0.7}
                  onPress={handleShare}
                >
                  <Ionicons name="share-social" size={20} color={theme.buttonText} />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>

        {/* Tombol generate — di atas BottomNav */}
        <TouchableOpacity
          style={[
            styles.generateBtn,
            { backgroundColor: theme.buttonBg, borderColor: theme.border },
            (isInputEmpty || isApiKeyMissing) && { borderColor: theme.borderSubtle },
          ]}
          activeOpacity={0.7}
          onPress={handleGenerate}
          disabled={isInputEmpty || isLoading || isApiKeyMissing}
        >
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={theme.textMuted} />
              <Text style={[styles.generateBtnText, { color: theme.buttonText }]}>sedang meracik...</Text>
            </View>
          ) : (
            <Text style={[styles.generateBtnText, { color: theme.buttonText }]}>RACIK KATA-KATA</Text>
          )}
        </TouchableOpacity>

        {/* Bottom Navigation */}
        <BottomNav activeTab="curhat" onTabPress={handleTabPress} />

        {/* Toast Notifikasi */}
        <Toast
          visible={toastVisible}
          message={toastMessage}
          onHide={() => setToastVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexGrow: 1,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 16,
  },
  inputWrapper: {
    paddingTop: 8,
  },
  textInput: {
    color: '#f0f0f0',
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 24,
    lineHeight: 36,
    minHeight: 160,
    backgroundColor: 'transparent',
  },
  charCounter: {
    color: '#333',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyStateText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  apiKeyWarning: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 16,
    lineHeight: 18,
  },
  resultArea: {
    marginTop: 32,
  },
  poetryCard: {
    padding: 32,
    borderWidth: 1,
    minHeight: 180,
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  resultQuote: {
    color: '#f0f0f0',
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 24,
    lineHeight: 38,
    marginBottom: 24,
    textAlign: 'center',
  },
  resultByline: {
    color: '#555',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 3,
  },
  miniShareBtn: {
    position: 'absolute',
    bottom: -22,
    right: 32,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateBtn: {
    marginHorizontal: 24,
    marginBottom: 12,
    height: 56,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateBtnDisabled: {
    borderColor: '#1e1e1e',
  },
  generateBtnText: {
    color: '#f0f0f0',
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    letterSpacing: 2,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
