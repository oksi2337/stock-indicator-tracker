import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { C, Spacing, Radius, FontSize } from '@/constants/theme';
import { type FearGreedData } from '@/lib/api';
import { fearGreedLabel, fearGreedColor } from '@/lib/format';

interface Props {
  data?: FearGreedData | null;
  loading?: boolean;
}

export function FearGreedGauge({ data, loading }: Props) {
  const [showDesc, setShowDesc] = useState(false);

  const score = data?.score ?? 0;
  const color = fearGreedColor(score);
  const label = fearGreedLabel(score);
  const prevScore = data?.previousClose ?? 0;
  const diff = score - prevScore;
  const diffSign = diff >= 0 ? '+' : '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>공포탐욕지수</Text>
        <TouchableOpacity
          onPress={() => setShowDesc(v => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {showDesc && (
        <Text style={styles.description}>
          CNN이 7개 지표로 산출. 0=극공포, 100=극탐욕. 투자 심리를 한눈에.
        </Text>
      )}

      {loading ? (
        <View style={styles.skeleton} />
      ) : data ? (
        <>
          <View style={styles.gaugeRow}>
            {/* Simple horizontal bar */}
            <View style={styles.gaugeTrack}>
              <View style={[styles.gaugeFill, { width: `${score}%` as any, backgroundColor: color }]} />
              <View style={[styles.gaugeThumb, { left: `${score}%` as any, borderColor: color }]} />
            </View>
          </View>
          <View style={styles.valueRow}>
            <Text style={[styles.score, { color }]}>{score}</Text>
            <Text style={[styles.ratingLabel, { color }]}>{label}</Text>
          </View>
          <Text style={styles.prevText}>
            전일 {prevScore}  ({diffSign}{diff.toFixed(1)})
          </Text>
          <View style={styles.scaleRow}>
            {['극공포', '공포', '중립', '탐욕', '극탐욕'].map((l, i) => (
              <Text key={l} style={[styles.scaleLabel, i === 0 && { color: '#EF4444' }, i === 4 && { color: '#10B981' }]}>
                {l}
              </Text>
            ))}
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
  gaugeRow: {
    marginVertical: Spacing.md,
  },
  gaugeTrack: {
    height: 8,
    backgroundColor: C.surfaceAlt,
    borderRadius: 4,
    overflow: 'visible',
    position: 'relative',
  },
  gaugeFill: {
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  gaugeThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.surface,
    borderWidth: 2,
    position: 'absolute',
    top: -3,
    marginLeft: -7,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  score: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -1,
  },
  ratingLabel: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  prevText: {
    color: C.textMuted,
    fontSize: FontSize.xs,
    marginBottom: Spacing.sm,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
  skeleton: {
    backgroundColor: C.surfaceAlt,
    borderRadius: Radius.sm,
    height: 80,
    marginTop: Spacing.xs,
  },
  noData: {
    color: C.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
});
