import { View, Text, StyleSheet } from 'react-native';
import { C, Spacing, Radius, FontSize } from '@/constants/theme';
import { type AdvanceDecline } from '@/lib/api';

interface Props {
  name: string;
  data?: AdvanceDecline | null;
  loading?: boolean;
}

export function AdvanceDeclineCard({ name, data, loading }: Props) {
  const total = (data?.advance ?? 0) + (data?.decline ?? 0) + (data?.unchanged ?? 0);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>

      {loading ? (
        <View style={styles.skeleton} />
      ) : data ? (
        <>
          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={[styles.count, { color: C.positive }]}>{data.advance.toLocaleString('ko-KR')}</Text>
              <Text style={styles.label}>↑ 상승</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.item}>
              <Text style={[styles.count, { color: C.negative }]}>{data.decline.toLocaleString('ko-KR')}</Text>
              <Text style={styles.label}>↓ 하락</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.item}>
              <Text style={[styles.count, { color: C.textSecondary }]}>{data.unchanged.toLocaleString('ko-KR')}</Text>
              <Text style={styles.label}>→ 보합</Text>
            </View>
          </View>
          {total > 0 && (
            <View style={styles.barRow}>
              <View style={[styles.barSegment, { flex: data.advance, backgroundColor: C.positive }]} />
              <View style={[styles.barSegment, { flex: data.unchanged, backgroundColor: C.textMuted }]} />
              <View style={[styles.barSegment, { flex: data.decline, backgroundColor: C.negative }]} />
            </View>
          )}
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
  name: {
    color: C.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  count: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  label: {
    color: C.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: C.border,
  },
  barRow: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: Spacing.md,
    gap: 1,
  },
  barSegment: {
    borderRadius: 2,
  },
  skeleton: {
    backgroundColor: C.surfaceAlt,
    borderRadius: Radius.sm,
    height: 60,
    marginTop: Spacing.xs,
  },
  noData: {
    color: C.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
});
