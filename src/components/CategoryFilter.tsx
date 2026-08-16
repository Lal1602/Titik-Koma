import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FilterCategory, FILTER_CATEGORIES } from '../hooks/useQuotes';

import { useTheme } from '../context/ThemeContext';

interface CategoryFilterProps {
  activeCategory: FilterCategory;
  onSelect: (category: FilterCategory) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onSelect }) => {
  const { theme } = useTheme();
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTER_CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[
              styles.pill,
              { borderColor: isActive ? theme.textPrimary : theme.border },
              isActive ? { backgroundColor: theme.textPrimary } : { backgroundColor: 'transparent' }
            ]}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.pillText,
              { color: isActive ? theme.background : theme.textSecondary },
              isActive && styles.pillTextActive
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 4,
  },
  pillText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  pillTextActive: {
    fontFamily: 'Inter_700Bold',
  },
});

export default CategoryFilter;
