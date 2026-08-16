import { useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';

// Mendeteksi apakah aplikasi sedang berjalan di dalam Expo Go
// Fitur simpan ke galeri membutuhkan build native, tidak bisa di Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

interface UseShareImageReturn {
  // Ref yang dipasang ke komponen ViewShot pembungkus QuoteCanvas
  canvasRef: React.MutableRefObject<ViewShot | null>;
  // Status loading saat proses capture sedang berjalan
  isProcessing: boolean;
  // Simpan gambar ke galeri foto HP
  saveToGallery: (onToast: (msg: string) => void) => Promise<void>;
  // Buka share sheet native HP
  shareImage: (onToast: (msg: string) => void) => Promise<void>;
}

/**
 * Hook yang mengelola logika capture kanvas dan berbagi/simpan gambar.
 * Menggunakan react-native-view-shot untuk capture,
 * expo-media-library untuk simpan ke galeri,
 * dan expo-sharing untuk share sheet native.
 */
export const useShareImage = (): UseShareImageReturn => {
  const canvasRef = useRef<ViewShot>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mengambil gambar dari kanvas, dengan delay agar font kustom sempat terrender
  const captureCanvas = async (): Promise<string | null> => {
    // Delay 150ms: memastikan Playfair Display sudah terrender sempurna
    await new Promise(r => setTimeout(r, 150));
    try {
      const uri = await canvasRef.current?.capture?.();
      return uri ?? null;
    } catch {
      return null;
    }
  };

  const saveToGallery = async (onToast: (msg: string) => void): Promise<void> => {
    if (isProcessing) return;

    // Fitur ini membutuhkan build native, tidak tersedia di Expo Go
    if (isExpoGo) {
      onToast('Fitur ini tersedia di APK build');
      return;
    }

    setIsProcessing(true);

    // Minta izin akses galeri
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      onToast('Akses galeri diperlukan');
      setIsProcessing(false);
      return;
    }

    const uri = await captureCanvas();
    if (!uri) {
      onToast('Gagal memproses gambar');
      setIsProcessing(false);
      return;
    }

    try {
      await MediaLibrary.saveToLibraryAsync(uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onToast('Tersimpan ke galeri ✓');
    } catch {
      onToast('Gagal menyimpan gambar');
    } finally {
      setIsProcessing(false);
    }
  };

  const shareImage = async (onToast: (msg: string) => void): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);

    const uri = await captureCanvas();
    if (!uri) {
      onToast('Gagal memproses gambar');
      setIsProcessing(false);
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        onToast('Fitur berbagi tidak tersedia di perangkat ini');
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Bagikan kalimat ini',
      });
    } catch {
      // User membatalkan share — bukan error fatal
    } finally {
      setIsProcessing(false);
    }
  };

  return { canvasRef, isProcessing, saveToGallery, shareImage };
};
