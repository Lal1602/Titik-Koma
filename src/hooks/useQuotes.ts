import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote, QuoteCategory } from '../types/quotes';
import quotesData from '../../data/quotes_draft.json';
import { LanguagePref } from './useAppSettings';

// Casting data JSON ke type yang sudah didefinisikan
const allQuotes = quotesData as Quote[];

// Daftar filter kategori yang tersedia di UI
export const FILTER_CATEGORIES = ['Semua', 'Sastra', 'Film', 'Lagu', 'Relatable', 'IG Notes'] as const;
export type FilterCategory = typeof FILTER_CATEGORIES[number];

const LANG_STORAGE_KEY = '@titikkoma_lang';

const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Filter quotes berdasarkan kategori dan preferensi bahasa.
 * Bahasa difilter terlebih dahulu, lalu kategori.
 */
const filterQuotes = (category: FilterCategory, lang: LanguagePref): Quote[] => {
  // Filter bahasa terlebih dahulu
  let filtered = lang === 'all'
    ? allQuotes
    : allQuotes.filter(q => q.language === lang);

  // Lalu filter kategori
  if (category === 'Semua') return filtered;
  if (category === 'IG Notes') return filtered.filter(q => q.length === 'short');
  return filtered.filter(q => q.category === (category as QuoteCategory));
};

interface UseQuotesReturn {
  currentQuote: Quote;
  activeCategory: FilterCategory;
  setCategory: (category: FilterCategory) => void;
  nextQuote: () => void;
  setSpecificQuoteById: (id: string) => void;
}

export const useQuotes = (): UseQuotesReturn => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('Semua');
  const [langPref, setLangPref] = useState<LanguagePref>('all');
  const [currentQuote, setCurrentQuote] = useState<Quote>(() => getRandomItem(allQuotes));

  // Muat preferensi bahasa dari AsyncStorage saat pertama kali
  useEffect(() => {
    AsyncStorage.getItem(LANG_STORAGE_KEY).then(saved => {
      if (saved === 'id' || saved === 'en' || saved === 'all') {
        setLangPref(saved);
      }
    });
  }, []);

  const setCategory = useCallback((category: FilterCategory) => {
    setActiveCategory(category);
    const filtered = filterQuotes(category, langPref);
    if (filtered.length > 0) {
      setCurrentQuote(getRandomItem(filtered));
    }
  }, [langPref]);

  const nextQuote = useCallback(() => {
    const filtered = filterQuotes(activeCategory, langPref);
    if (filtered.length > 0) {
      // Pastikan quote berikutnya berbeda dari yang sekarang
      let next = getRandomItem(filtered);
      let attempts = 0;
      while (next.id === currentQuote.id && filtered.length > 1 && attempts < 10) {
        next = getRandomItem(filtered);
        attempts++;
      }
      setCurrentQuote(next);
    }
  }, [activeCategory, currentQuote.id, langPref]);

  const setSpecificQuoteById = useCallback((id: string) => {
    const found = allQuotes.find(q => q.id === id);
    if (found) {
      setCurrentQuote(found);
    }
  }, []);

  return { currentQuote, activeCategory, setCategory, nextQuote, setSpecificQuoteById };
};
