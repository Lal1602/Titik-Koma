import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote } from '../types/quotes';

const STORAGE_KEY = '@titikkoma_bookmarks';

interface UseBookmarksReturn {
  bookmarks: Quote[];
  isBookmarked: (quoteId: string) => boolean;
  toggleBookmark: (quote: Quote) => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook untuk mengelola koleksi quotes yang disimpan (bookmark).
 * Data disimpan secara persisten menggunakan AsyncStorage.
 */
export const useBookmarks = (): UseBookmarksReturn => {
  const [bookmarks, setBookmarks] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Muat bookmark dari storage saat pertama kali hook digunakan
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setBookmarks(JSON.parse(stored));
        }
      } catch (err) {
        // Gagal muat tidak fatal, mulai dengan array kosong
      } finally {
        setIsLoading(false);
      }
    };
    loadBookmarks();
  }, []);

  // Simpan ke storage setiap kali bookmark berubah (setelah loading selesai)
  const saveToStorage = useCallback(async (newBookmarks: Quote[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
    } catch (err) {
      // Simpan gagal — tidak melempar error ke UI
    }
  }, []);

  const isBookmarked = useCallback(
    (quoteId: string) => bookmarks.some(q => q.id === quoteId),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (quote: Quote) => {
      setBookmarks(prev => {
        const exists = prev.some(q => q.id === quote.id);
        const updated = exists
          ? prev.filter(q => q.id !== quote.id) // Hapus bookmark
          : [quote, ...prev]; // Tambah di depan (terbaru di atas)
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  return { bookmarks, isBookmarked, toggleBookmark, isLoading };
};
