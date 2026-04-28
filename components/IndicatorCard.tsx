import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize, cardShadow, type ThemeColors } from '@/constants/theme';
import { type Indicator } from '@/constants/indicators';
import { type QuoteData } from '@/lib/api';
import { formatValue, formatChange, formatChangePercent } from '@/lib/format';

interface Props {
  indicator: Indicator;
  data?: QuoteData;
  loading?: boolean;
}

export function IndicatorCard({ indicator, data, loading }: Props) {
  const { colors, isDark } = useTheme();
  const [showDesc, setShowDesc] = useState(false);

  const isPositive = (data?.change ?? 0) >= 0;
  const changeColor = data?.change === 0 ? colors.textSecondary : isPositive ? colors.positive : colors.negative;
  const arrow = data?.change === 0 ? '' : isPositive ? '▲' : '▼';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(isDark)]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.textSecondary }]} numberOfLines={1}>{indicator.name}</Text>
        <TouchableOpacity onPress={() => setShowDesc(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.infoIcon, { color: colors.textMuted }]}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {showDesc && (
        <Text style={[styles.description, { color: colors.textMuted, borderLeftColor: colors.accent }]}>
          {indicator.description}
        </Text>
      )}

      {loading ? (
        <View style={[styles.skeleton, { backgroundColor: colors.surfaceAlt }]} />
      ) : data ? (
        <>
          <Text style={[styles.value, { color: colors.text }]}>
            {formatValue(data.value, indicator.unit, indicator.decimals)}
          </Text>
          <View style={styles.changeRow}>
            <Text style={[styles.change, { color: changeColor }]}>
              {arrow} {formatChange(data.change, indicator.decimals)}
            </Text>
            <Text style={[styles.changePct, { color: changeColor }]}>
              ({formatChangePercent(data.changePercent)})
            </Text>
          </View>
        </>
      ) : (
        <Text style={[styles.noData, { color: colors.textMuted }]}>데이터 없음</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  name: { fontSize: FontSize.sm, fontWeight: '600', flex: 1, marginRight: Spacing.sm },
  infoIcon: { fontSize: FontSize.md },
  description: { fontSize: FontSize.xs, lineHeight: 17, marginBottom: Spacing.sm, borderLeftWidth: 2, paddingLeft: Spacing.sm },
  value: { fontSize: FontSize.xl, fontWeight: '700', letterSpacing: -0.5, marginBottom: 2 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  change: { fontSize: FontSize.sm, fontWeight: '600' },
  changePct: { fontSize: FontSize.sm },
  skeleton: { borderRadius: Radius.sm, height: 36, marginTop: Spacing.xs },
  noData: { fontSize: FontSize.sm, marginTop: Spacing.xs },
});
