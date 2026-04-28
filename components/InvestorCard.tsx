import { View, Text, StyleSheet } from 'react-native';
import { C, Spacing, Radius, FontSize } from '@/constants/theme';
import { type InvestorData } from '@/lib/api';
import { formatKRW, formatKRWChange } from '@/lib/format';

interface Props {
  name: string;
  description: string;
  data?: InvestorData | null;
  loading?: boolean;
}

export function InvestorCard({ name, description, data, loading }: Props) {
  const isPositive = (data?.change ?? 0) >= 0;
  const changeColor = !data
    ? C.textMuted
    : data.change === 0
    ? C.textSecondary
    : isPositive
    ? C.positive
    : C.negative;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.t1Badge}>전일 기준</Text>
      </View>
      <Text style={styles.desc}>{description}</Text>

      {loading ? (
        <View style={styles.skeleton} />
      ) : data ? (
        <>
          <Text style={styles.amount}>{formatKRW(data.amount)}원</Text>
          <Text style={[styles.change, { color: changeColor }]}>
            전일대비 {formatKRWChange(data.change)}원
          </Text>
          {data.date && <Text style={styles.date}>{data.date} 기준</Text>}
        </>
      ) : (
        <Text style={styles.noData}>
          T+1 데이터 — Supabase 설정 후 이용 가능
        </Text>
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
    marginBottom: 2,
  },
  name: {
    color: C.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  t1Badge: {
    color: C.warning,
    fontSize: 9,
    fontWeight: '600',
    backgroundColor: '#2D2006',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  desc: {
    color: C.textMuted,
    fontSize: FontSize.xs,
    marginBottom: Spacing.sm,
    lineHeight: 16,
  },
  amount: {
    color: C.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: 2,
  },
  change: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  date: {
    color: C.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  skeleton: {
    backgroundColor: C.surfaceAlt,
    borderRadius: Radius.sm,
    height: 44,
    marginTop: Spacing.xs,
  },
  noData: {
    color: C.textMuted,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
});
