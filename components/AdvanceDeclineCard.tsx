import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize, cardShadow } from '@/constants/theme';
import { type AdvanceDecline } from '@/lib/api';

interface Props {
  name: string;
  data?: AdvanceDecline | null;
  loading?: boolean;
}

export function AdvanceDeclineCard({ name, data, loading }: Props) {
  const { colors, isDark } = useTheme();
  const total = (data?.advance ?? 0) + (data?.decline ?? 0) + (data?.unchanged ?? 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(isDark)]}>
      <Text style={[styles.name, { color: colors.textSecondary }]}>{name}</Text>
      {loading ? (
        <View style={[styles.skeleton, { backgroundColor: colors.surfaceAlt }]} />
      ) : data ? (
        <>
          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={[styles.count, { color: colors.positive }]}>{data.advance.toLocaleString('ko-KR')}</Text>
              <Text style={[styles.label, { color: colors.textMuted }]}>↑ 상승</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.item}>
              <Text style={[styles.count, { color: colors.negative }]}>{data.decline.toLocaleString('ko-KR')}</Text>
              <Text style={[styles.label, { color: colors.textMuted }]}>↓ 하락</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.item}>
              <Text style={[styles.count, { color: colors.textSecondary }]}>{data.unchanged.toLocaleString('ko-KR')}</Text>
              <Text style={[styles.label, { color: colors.textMuted }]}>→ 보합</Text>
            </View>
          </View>
          {total > 0 && (
            <View style={styles.barRow}>
              <View style={[styles.barSegment, { flex: data.advance, backgroundColor: colors.positive }]} />
              <View style={[styles.barSegment, { flex: data.unchanged, backgroundColor: colors.textMuted }]} />
              <View style={[styles.barSegment, { flex: data.decline, backgroundColor: colors.negative }]} />
            </View>
          )}
        </>
      ) : (
        <Text style={[styles.noData, { color: colors.textMuted }]}>데이터 없음</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  name: { fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  item: { alignItems: 'center', flex: 1 },
  count: { fontSize: FontSize.xl, fontWeight: '700' },
  label: { fontSize: FontSize.xs, marginTop: 2 },
  divider: { width: 1, height: 40 },
  barRow: { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden', marginTop: Spacing.md, gap: 1 },
  barSegment: { borderRadius: 2 },
  skeleton: { borderRadius: Radius.sm, height: 60, marginTop: Spacing.xs },
  noData: { fontSize: FontSize.sm, marginTop: Spacing.xs },
});
