import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

import BottomNav, { TabName } from '../components/BottomNav';
import Toast from '../components/Toast';
import { useBookmarks } from '../hooks/useBookmarks';
import { useTheme } from '../context/ThemeContext';
import { useAppSettings, LanguagePref } from '../hooks/useAppSettings';

const APP_VERSION = '1.0.0';

// Label tampilan untuk pilihan bahasa
const LANG_OPTIONS: { value: LanguagePref; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'id', label: 'Indonesia' },
  { value: 'en', label: 'English' },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { bookmarks } = useBookmarks();
  const { themeMode, theme, toggleTheme } = useTheme();
  const { 
    langPref, 
    curhatCount, 
    notificationEnabled, 
    notificationTime, 
    setLangPref,
    setNotificationEnabled,
    setNotificationTime
  } = useAppSettings();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const handleTabPress = (tab: TabName) => {
    if (tab === 'more') return;
    router.replace(tab === 'index' ? '/' : `/${tab}`);
  };

  const handleAbout = () => {
    Alert.alert(
      'Titik—Koma',
      `Versi ${APP_VERSION}\n\nAplikasi penghasil kata-kata estetis untuk Gen Z.\n\nDibuat dengan ❤ menggunakan React Native + Expo.`,
      [{ text: 'Tutup', style: 'cancel' }]
    );
  };

  const handleShareApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync('https://titikkoma.app', {
          dialogTitle: 'Bagikan Titik-Koma',
        });
      } else {
        showToast('Fitur berbagi tidak tersedia');
      }
    } catch {
      // User membatalkan share
    }
  };

  // Preview 3 bookmark teratas
  const previewBookmarks = bookmarks.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + 16 }]}>
      <StatusBar
        barStyle={themeMode === 'midnight' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <Text style={[styles.appName, { color: theme.textGhost }]}>TITIK—KOMA</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 16 }]}
      >
        {/* ── SEKSI KOLEKSI ── */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>TERSIMPAN</Text>

        {bookmarks.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Belum ada yang disimpan.</Text>
        ) : (
          <>
            {previewBookmarks.map((quote) => (
              <TouchableOpacity
                key={quote.id}
                style={styles.previewItem}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push({ pathname: '/', params: { showQuoteId: quote.id } });
                }}
              >
                <Text style={[styles.previewQuote, { color: theme.textPrimary }]} numberOfLines={1}>
                  "{quote.text.slice(0, 60)}{quote.text.length > 60 ? '...' : ''}"
                </Text>
                <Text style={[styles.previewAuthor, { color: theme.textSecondary }]}>— {quote.author}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.seeAllButton}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/saved');
              }}
            >
              <Text style={[styles.seeAllText, { color: theme.textMuted }]}>
                Lihat Semua ({bookmarks.length})
              </Text>
              <Ionicons name="chevron-forward" size={14} color={theme.textMuted} />
            </TouchableOpacity>
          </>
        )}

        {/* Garis pemisah */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* ── SEKSI STATISTIK ── */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>STATISTIKMU</Text>

        <View style={styles.statsRow}>
          {/* Stat: kalimat tersimpan */}
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: theme.textPrimary }]}>
              {bookmarks.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>kalimat{'\n'}tersimpan</Text>
          </View>
          {/* Stat: curhat ke AI */}
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: theme.textPrimary }]}>
              {curhatCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>kali{'\n'}curhat</Text>
          </View>
        </View>

        {/* Garis pemisah */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* ── SEKSI PENGATURAN ── */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>PENGATURAN</Text>

        {/* Pengaturan: Tema Tampilan */}
        <View style={[styles.settingRow, { borderBottomColor: theme.borderSubtle }]}>
          <View style={styles.settingLeft}>
            <Text style={[styles.settingLabel, { color: theme.textSecondary }]}>Tema Tampilan</Text>
            <Text style={[styles.settingValue, { color: theme.textMuted }]}>
              {themeMode === 'midnight' ? 'Midnight (Gelap)' : 'Kertas Tua (Terang)'}
            </Text>
          </View>
          <Switch
            value={themeMode === 'kertas'}
            onValueChange={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleTheme();
            }}
            trackColor={{ false: '#2a2a2a', true: '#888888' }}
            thumbColor={themeMode === 'kertas' ? theme.textPrimary : '#555'}
          />
        </View>

        {/* Pengaturan: Bahasa Quote */}
        <View style={[styles.settingBlock, { borderBottomColor: theme.borderSubtle }]}>
          <Text style={[styles.settingLabel, { color: theme.textSecondary }]}>Bahasa Quote</Text>
          <View style={styles.chipRow}>
            {LANG_OPTIONS.map(({ value, label }) => {
              const isActive = langPref === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? theme.textPrimary : 'transparent',
                      borderColor: isActive ? theme.textPrimary : theme.border,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setLangPref(value);
                    showToast('Preferensi bahasa disimpan');
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    { color: isActive ? theme.background : theme.textMuted },
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pengaturan: Pengingat Harian */}
        <View style={[styles.settingBlock, { borderBottomColor: theme.borderSubtle }]}>
          <View style={styles.settingRowInner}>
            <Text style={[styles.settingLabel, { color: theme.textSecondary }]}>Pengingat Harian</Text>
            <Switch
              value={notificationEnabled}
              onValueChange={(val) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setNotificationEnabled(val);
                showToast(val ? 'Pengingat diaktifkan' : 'Pengingat dimatikan');
              }}
              trackColor={{ false: '#2a2a2a', true: '#888888' }}
              thumbColor={notificationEnabled ? theme.textPrimary : '#555'}
            />
          </View>
          
          {notificationEnabled && (
            <View style={styles.hourList}>
              {(['08:00', '12:00', '20:00'] as const).map((time) => {
                const isActive = notificationTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.hourChip,
                      {
                        backgroundColor: isActive ? theme.textPrimary : 'transparent',
                        borderColor: isActive ? theme.textPrimary : theme.border,
                      },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setNotificationTime(time);
                      showToast(`Diingatkan pada ${time}`);
                    }}
                  >
                    <Text style={[
                      styles.hourText,
                      { color: isActive ? theme.background : theme.textMuted },
                    ]}>
                      {time === '08:00' ? 'Pagi (08:00)' : time === '12:00' ? 'Siang (12:00)' : 'Malam (20:00)'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Garis pemisah */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* ── SEKSI INFO ── */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>LAINNYA</Text>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: theme.borderSubtle }]}
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleAbout();
          }}
        >
          <Text style={[styles.menuLabel, { color: theme.textSecondary }]}>Tentang Aplikasi</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: theme.borderSubtle }]}
          activeOpacity={0.7}
          onPress={handleShareApp}
        >
          <Text style={[styles.menuLabel, { color: theme.textSecondary }]}>Bagikan Aplikasi</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
        </TouchableOpacity>

        <View style={[styles.menuItem, styles.menuItemDisabled, { borderBottomColor: 'transparent' }]}>
          <Text style={[styles.menuLabelMuted, { color: theme.textMuted }]}>Versi {APP_VERSION}</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="more" onTabPress={handleTabPress} />

      {/* Toast */}
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
  },
  appName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 28,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 16,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginBottom: 8,
  },
  previewItem: {
    marginBottom: 14,
  },
  previewQuote: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  previewAuthor: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 4,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingVertical: 4,
  },
  seeAllText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    marginVertical: 28,
  },
  // Statistik
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  statBox: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 20,
  },
  statNumber: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 36,
    lineHeight: 40,
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    letterSpacing: 1,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  // Pengaturan
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingBlock: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingRowInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  settingValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  // Chip bahasa
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  // Pilihan jam notifikasi
  hourList: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
  },
  hourChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  hourText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  // Menu info
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemDisabled: {
    borderBottomWidth: 0,
  },
  menuLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  menuLabelMuted: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
});
