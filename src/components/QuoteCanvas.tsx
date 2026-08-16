import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type CanvasStyle = 'midnight' | 'kertas' | 'hujan' | 'starry_night' | 'black_coffee';
export type AspectRatioType = '9:16' | '1:1' | '4:3' | '16:9';

interface ThemeColors {
  background: string;
  quoteColor: string;
  authorColor: string;
  accent: string;
  watermark: string;
}

export const CANVAS_THEMES: Record<CanvasStyle, ThemeColors> = {
  midnight: {
    background: '#0a0a0a',
    quoteColor: '#f0f0f0',
    authorColor: '#888888',
    accent: '#222222',
    watermark: '#1e1e1e',
  },
  kertas: {
    background: '#f0ead6',
    quoteColor: '#1a1a1a',
    authorColor: '#7a6a52',
    accent: '#c8b89a',
    watermark: '#dcd1bd',
  },
  hujan: {
    background: '#15202b',
    quoteColor: '#ffffff',
    authorColor: '#8899a6',
    accent: '#38444d',
    watermark: '#192734',
  },
  starry_night: {
    background: '#0b1021',
    quoteColor: '#e8f1f2',
    authorColor: '#748296',
    accent: '#1c253d',
    watermark: '#131c33',
  },
  black_coffee: {
    background: '#1c1311',
    quoteColor: '#e5d9c5',
    authorColor: '#8c7b6d',
    accent: '#362723',
    watermark: '#2a1d1a',
  },
};

interface QuoteCanvasProps {
  quoteText: string;
  author: string;
  source?: string;
  canvasStyle: CanvasStyle;
  ratio?: AspectRatioType;
  size: number;
}

const QuoteCanvas: React.FC<QuoteCanvasProps> = ({
  quoteText,
  author,
  source,
  canvasStyle,
  ratio = '9:16',
  size,
}) => {
  const theme = CANVAS_THEMES[canvasStyle];

  let nativeWidth = 1080;
  let nativeHeight = 1920;

  switch (ratio) {
    case '1:1':
      nativeHeight = 1080;
      break;
    case '4:3':
      nativeHeight = 1440;
      break;
    case '16:9':
      nativeWidth = 1920;
      nativeHeight = 1080;
      break;
    case '9:16':
    default:
      nativeHeight = 1920;
      break;
  }
  
  const scaleRatio = size / nativeWidth;
  const previewHeight = size * (nativeHeight / nativeWidth);
  const isLandscape = ratio === '16:9';

  // Helper untuk membersihkan quote panjang
  const shortQuote = quoteText.length > 150 ? quoteText.substring(0, 150) + '...' : quoteText;

  // Render spesifik untuk setiap gaya
  const renderStyleContent = () => {
    switch (canvasStyle) {
      
      // 1. TEMA HITAM (Neo-Brutalism)
      case 'midnight':
        return (
          <View style={[styles.containerMidnight, { padding: isLandscape ? 80 : 120 }]}>
            <View style={styles.contentMidnight}>
              <Text style={[styles.textMidnightQuote, { color: theme.quoteColor, fontSize: isLandscape ? 80 : 72 }]}>
                {quoteText}
              </Text>
              <Text style={[styles.textMidnightAuthor, { color: theme.authorColor }]}>
                {author.toUpperCase()} {source ? `— ${source.toUpperCase()}` : ''}
              </Text>
            </View>
            <View style={styles.watermarkMidnightContainer}>
              <Text style={[styles.watermarkMidnight, { color: theme.watermark }]}>
                TITIK—KOMA
              </Text>
            </View>
          </View>
        );

      // 2. TEMA KERTAS (Vintage Polaroid)
      case 'kertas':
        return (
          <View style={[styles.containerKertas, { paddingHorizontal: isLandscape ? 120 : 100, paddingVertical: isLandscape ? 80 : 160 }]}>
            <View style={[styles.innerFrameKertas, { borderColor: theme.accent }]} />
            <Text style={[styles.hugeQuoteMark, { color: theme.accent }]}>“</Text>
            
            <View style={styles.contentKertas}>
              <Text style={[styles.textKertasQuote, { color: theme.quoteColor, fontSize: isLandscape ? 56 : 50 }]}>
                {quoteText}
              </Text>
              <View style={[styles.lineKertas, { backgroundColor: theme.accent }]} />
              <Text style={[styles.textKertasAuthor, { color: theme.authorColor }]}>
                — {author}
              </Text>
            </View>

            <View style={styles.footerKertas}>
              <Text style={[styles.watermarkKertas, { color: theme.watermark }]}>
                TITIK—KOMA
              </Text>
            </View>
          </View>
        );

      // 3. TEMA ABU (Gaya Kicauan / Thread X)
      case 'hujan':
        return (
          <View style={[styles.containerHujan, { padding: isLandscape ? 80 : 120 }]}>
            <View style={styles.headerHujan}>
              <View style={[styles.avatarHujan, { backgroundColor: theme.accent }]} />
              <View>
                <Text style={[styles.textHujanAuthor, { color: theme.quoteColor }]}>
                  {author}
                </Text>
                <Text style={[styles.textHujanHandle, { color: theme.authorColor }]}>
                  @{author.toLowerCase().replace(/\s+/g, '')}
                </Text>
              </View>
            </View>
            
            <View style={styles.contentHujan}>
              <Text style={[styles.textHujanQuote, { color: theme.quoteColor, fontSize: isLandscape ? 56 : 50 }]}>
                {quoteText}
              </Text>
            </View>

            <View style={[styles.footerHujan, { borderTopColor: theme.accent }]}>
              <Text style={[styles.textHujanTimestamp, { color: theme.authorColor }]}>
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
              <Text style={[styles.watermarkHujan, { color: theme.accent }]}>
                TITIK—KOMA
              </Text>
            </View>
          </View>
        );

      // 4. TEMA MALAM (Spotify Lyrics)
      case 'starry_night':
        return (
          <View style={[styles.containerStarry, { padding: isLandscape ? 100 : 120 }]}>
            <View style={styles.headerStarry}>
              <View style={[styles.albumArtStarry, { backgroundColor: theme.accent }]} />
              <View>
                <Text style={[styles.songTitleStarry, { color: theme.quoteColor }]}>Thoughts</Text>
                <Text style={[styles.artistNameStarry, { color: theme.authorColor }]}>{author}</Text>
              </View>
            </View>
            
            <View style={styles.contentStarry}>
              <Text style={[styles.textStarryQuote, { color: theme.quoteColor, fontSize: isLandscape ? 72 : 64 }]}>
                {shortQuote}
              </Text>
            </View>

            <View style={styles.footerStarry}>
              <View style={[styles.progressBarBg, { backgroundColor: theme.accent }]}>
                <View style={[styles.progressBarFill, { backgroundColor: theme.quoteColor }]} />
              </View>
              <Text style={[styles.watermarkStarry, { color: theme.watermark }]}>
                TITIK—KOMA
              </Text>
            </View>
          </View>
        );

      // 5. TEMA KOPI (Editorial Magazine)
      case 'black_coffee':
        return (
          <View style={[styles.containerCoffee, { padding: isLandscape ? 80 : 120 }]}>
            <View style={styles.contentCoffee}>
              <View style={styles.coffeeAuthorWrapper}>
                <Text style={[styles.textCoffeeAuthor, { color: theme.authorColor }]} numberOfLines={1}>
                  {author.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.coffeeQuoteWrapper, { borderColor: theme.accent }]}>
                <Text style={[styles.textCoffeeQuote, { color: theme.quoteColor, fontSize: isLandscape ? 60 : 56 }]}>
                  {quoteText}
                </Text>
              </View>
            </View>
            <Text style={[styles.watermarkCoffee, { color: theme.watermark }]}>
              TITIK—KOMA
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.outerWrapper, { width: size, height: previewHeight }]}>
      <View
        style={[
          styles.canvas,
          {
            width: nativeWidth,
            height: nativeHeight,
            backgroundColor: theme.background,
            transformOrigin: 'top left',
            transform: [{ scale: scaleRatio }]
          }
        ]}
      >
        {renderStyleContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    overflow: 'hidden',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  
  // --- 1. MIDNIGHT (Neo-Brutalism) ---
  containerMidnight: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  contentMidnight: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 100, // Ruang untuk watermark
  },
  textMidnightQuote: {
    fontFamily: 'Inter_700Bold',
    lineHeight: 90,
    marginBottom: 40,
    letterSpacing: -2,
  },
  textMidnightAuthor: {
    fontFamily: 'Inter_500Medium',
    fontSize: 24,
    letterSpacing: 4,
  },
  watermarkMidnightContainer: {
    position: 'absolute',
    right: 60,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermarkMidnight: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    letterSpacing: 20,
    transform: [{ rotate: '90deg' }],
  },

  // --- 2. KERTAS (Vintage Polaroid) ---
  containerKertas: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerFrameKertas: {
    position: 'absolute',
    top: 60,
    left: 60,
    right: 60,
    bottom: 60,
    borderWidth: 2,
    opacity: 0.6,
  },
  hugeQuoteMark: {
    position: 'absolute',
    top: 100,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 400,
    opacity: 0.1,
    lineHeight: 400,
  },
  contentKertas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  textKertasQuote: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    lineHeight: 80,
    textAlign: 'center',
  },
  lineKertas: {
    width: 60,
    height: 2,
    marginVertical: 40,
  },
  textKertasAuthor: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 28,
  },
  footerKertas: {
    alignItems: 'center',
    marginBottom: 20,
  },
  watermarkKertas: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    letterSpacing: 16,
  },

  // --- 3. HUJAN (Thread X / Kicauan) ---
  containerHujan: {
    flex: 1,
    justifyContent: 'center',
  },
  headerHujan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 40,
  },
  avatarHujan: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  textHujanAuthor: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
  },
  textHujanHandle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    marginTop: 4,
  },
  contentHujan: {
    marginBottom: 40,
  },
  textHujanQuote: {
    fontFamily: 'Inter_400Regular',
    lineHeight: 76,
  },
  footerHujan: {
    borderTopWidth: 2,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textHujanTimestamp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
  },
  watermarkHujan: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    letterSpacing: 4,
  },

  // --- 4. STARRY NIGHT (Spotify) ---
  containerStarry: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerStarry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  albumArtStarry: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  songTitleStarry: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    marginBottom: 8,
  },
  artistNameStarry: {
    fontFamily: 'Inter_500Medium',
    fontSize: 24,
  },
  contentStarry: {
    flex: 1,
    justifyContent: 'center',
  },
  textStarryQuote: {
    fontFamily: 'Inter_700Bold',
    lineHeight: 90,
  },
  footerStarry: {
    gap: 40,
  },
  progressBarBg: {
    height: 6,
    width: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '45%',
    borderRadius: 3,
  },
  watermarkStarry: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: 10,
    textAlign: 'center',
    opacity: 0.2,
  },

  // --- 5. BLACK COFFEE (Editorial) ---
  containerCoffee: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentCoffee: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coffeeAuthorWrapper: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCoffeeAuthor: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    letterSpacing: 12,
    transform: [{ rotate: '-90deg' }],
    width: 600, // Lebar statis agar teks panjang bisa diputar rapi
    textAlign: 'center',
  },
  coffeeQuoteWrapper: {
    flex: 1,
    borderLeftWidth: 3,
    paddingLeft: 60,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  textCoffeeQuote: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    lineHeight: 84,
    textAlign: 'left',
  },
  watermarkCoffee: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    letterSpacing: 16,
    textAlign: 'right',
    marginTop: 60,
    opacity: 0.3,
  },
});

export default QuoteCanvas;
