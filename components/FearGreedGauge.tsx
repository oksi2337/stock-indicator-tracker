import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize, cardShadow } from '@/constants/theme';
import { type FearGreedData } from '@/lib/api';
import { fearGreedLabel, fearGreedColor } from '@/lib/format';

interface Props {
  data?: FearGreedData | null;
  loading?: boolean;
}

export function FearGreedGauge({ data, loading }: Props) {
  const { colors, isDark } = useTheme();
  const [showDesc, setShowDesc] = useState(false);

  const score = data?.score ?? 0;
  const color = fearGreedColor(score);
  const label = fearGreedLabel(score);
  const prevScore = data?.previousClose ?? 0;
  const diff = score - prevScore;
  const diffSign = diff >= 0 ? '+' : '';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(isDark)]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.textSecondary }]}>공포탐욕지수</Text>
        <TouchableOpacity onPress={() => setShowDesc(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.infoIcon, { color: colors.textMuted }]}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {showDesc && (
        <Text style={[styles.description, { color: colors.textMuted, borderLeftColor: colors.accent }]}>
          CNN이 7개 지표로 산출. 0=극공포, 100=극탐욕. 투자 심리를 한눈에.
        </Text>
      )}

      {loading ? (
        <View style={[styles.skeleton, { backgroundColor: colors.surfaceAlt }]} />
      ) : data ? (
        <>
          <View style={styles.gaugeRow}>
            <View style={[styles.gaugeTrack, { backgroundColor: colors.surfaceAlt }]}>
              <View style={[styles.gaugeFill, { width: `${score}%` as any, backgroundColor: color }]} />
              <View style={[styles.gaugeThumb, { left: `${score}%` as any, borderColor: color, backgroundColor: colors.surface }]} />
            </View>
          </View>
          <View style={styles.valueRow}>
            <Text style={[styles.score, { color }]}>{score}</Text>
            <Text style={[styles.ratingLabel, { color }]}>{label}</Text>
          </View>
          <Text style={[styles.prevText, { color: colors.textMuted }]}>
            전일 {prevScore}  ({diffSign}{diff.toFixed(1)})
          </Text>
          <View style={styles.scaleRow}>
            {['극공포', '공포', '중립', '탐욕', '극탐욕'].map((l, i) => (
              <Text key={l} style={[styles.scaleLabel, { color: colors.textMuted }, i === 0 && { color: '#EF4444' }, i === 4 && { color: '#10B981' }]}>
                {l}
              </Text>
            ))}
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
  name: { fontSize: FontSize.sm, fontWeight: '600' },
  infoIcon: { fontSize: FontSize.md },
  description: { fontSize: FontSize.xs, lineHeight: 17, marginBottom: Spacing.sm, borderLeftWidth: 2, paddingLeft: Spacing.sm },
  gaugeRow: { marginVertical: Spacing.md },
  gaugeTrack: { height: 8, borderRadius: 4, overflow: 'visible', position: 'relative' },
  gaugeFill: { height: 8, borderRadius: 4, position: 'absolute', left: 0, top: 0 },
  gaugeThumb: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, position: 'absolute', top: -3, marginLeft: -7 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm, marginBottom: 2 },
  score: { fontSize: FontSize.xxl, fontWeight: '800', letterSpacing: -1 },
  ratingLabel: { fontSize: FontSize.lg, fontWeight: '600' },
  prevText: { fontSize: FontSize.xs, marginBottom: Spacing.sm },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scaleLabel: { fontSize: 9 },
  skeleton: { borderRadius: Radius.sm, height: 80, marginTop: Spacing.xs },
  noData: { fontSize: FontSize.sm, marginTop: Spacing.xs },
});
