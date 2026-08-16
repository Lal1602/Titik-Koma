export type QuoteCategory = 'Sastra' | 'Film' | 'Lagu' | 'Relatable';
export type QuoteLanguage = 'id' | 'en';
export type QuoteLength = 'short' | 'medium' | 'long';

export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: QuoteCategory;
  language: QuoteLanguage;
  length: QuoteLength;
  tags: string[];
}
