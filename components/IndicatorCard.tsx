import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { C, Spacing, Radius, FontSize } from '@/constants/theme';
import { type Indicator } from '@/constants/indicators';
import { type QuoteData } from '@/lib/api';
import { formatValue, formatChange, formatChangePercent } from '@/lib/format';

interface Props {
  indicator: Indicator;
  data?: QuoteData;
  loading?: boolean;
}

export function IndicatorCard({ indicator, data, loading }: Props) {
  const [showDesc, setShowDesc] = useState(false);

  const isPositive = (data?.change ?? 0) >= 0;
  const changeColor = data?.change === 0 ? C.textSecondary : isPositive ? C.positive : C.negative;
  const arrow = data?.change === 0 ? '' : isPositive ? '▲' : '▼';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{indicator.name}</Text>
        <TouchableOpacity
          onPress={() => setShowDesc(v => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="설명 보기"
        >
          <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {showDesc && (
        <Text style={styles.description}>{indicator.description}</Text>
      )}

      {loading ? (
        <View style={styles.skeleton} />
      ) : data ? (
        <>
          <Text style={styles.value}>
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
        <Text style={styles.noData}>데이터 없음</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    color: C.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.sm,
  },
  infoIcon: {
    color: C.textMuted,
    fontSize: FontSize.md,
  },
  description: {
    color: C.textMuted,
    fontSize: FontSize.xs,
    lineHeight: 17,
    marginBottom: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: C.accent,
    paddingLeft: Spacing.sm,
  },
  value: {
    color: C.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  change: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  changePct: {
    fontSize: FontSize.sm,
  },
  skeleton: {
    backgroundColor: C.surfaceAlt,
    borderRadius: Radius.sm,
    height: 36,
    marginTop: Spacing.xs,
  },
  noData: {
    color: C.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
});
