import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote } from '../types/quotes';
import quotesData from '../../data/quotes_draft.json';

const allQuotes = quotesData as Quote[];

const STORAGE_KEY = '@titikkoma_daily_quote';

interface DailyQuoteState {
  quote: Quote | null;
  isLoading: boolean;
  formattedDate: string;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function formatDate(dateKey: string): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const [year, month, day] = dateKey.split('-').map(Number);
  const dt = new Date(year, month - 1, day);
  return days[dt.getDay()] + ', ' + dt.getDate() + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear();
}

export function useDailyQuote(): DailyQuoteState {
  const [state, setState] = useState<DailyQuoteState>({
    quote: null,
    isLoading: true,
    formattedDate: '',
  });

  useEffect(() => {
    const load = async () => {
      const todayKey = getTodayKey();
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.dateKey === todayKey) {
          setState({ quote: parsed.quote, isLoading: false, formattedDate: formatDate(todayKey) });
          return;
        }
      }
      const hash = simpleHash(todayKey);
      const index = hash % allQuotes.length;
      const todayQuote = allQuotes[index];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ dateKey: todayKey, quote: todayQuote }));
      setState({ quote: todayQuote, isLoading: false, formattedDate: formatDate(todayKey) });
    };
    load().catch(console.error);
  }, []);

  return state;
}
