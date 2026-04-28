import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize, cardShadow } from '@/constants/theme';
import { type InvestorData } from '@/lib/api';
import { formatKRW, formatKRWChange } from '@/lib/format';

interface Props {
  name: string;
  description: string;
  data?: InvestorData | null;
  loading?: boolean;
}

export function InvestorCard({ name, description, data, loading }: Props) {
  const { colors, isDark } = useTheme();
  const isPositive = (data?.change ?? 0) >= 0;
  const changeColor = !data ? colors.textMuted : data.change === 0 ? colors.textSecondary : isPositive ? colors.positive : colors.negative;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(isDark)]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.textSecondary }]}>{name}</Text>
        <View style={[styles.t1Badge, { backgroundColor: colors.warningBg }]}>
          <Text style={[styles.t1Text, { color: colors.warning }]}>전일 기준</Text>
        </View>
      </View>
      <Text style={[styles.desc, { color: colors.textMuted }]}>{description}</Text>
      {loading ? (
        <View style={[styles.skeleton, { backgroundColor: colors.surfaceAlt }]} />
      ) : data ? (
        <>
          <Text style={[styles.amount, { color: colors.text }]}>{formatKRW(data.amount)}원</Text>
          <Text style={[styles.change, { color: changeColor }]}>전일대비 {formatKRWChange(data.change)}원</Text>
          {data.date && <Text style={[styles.date, { color: colors.textMuted }]}>{data.date} 기준</Text>}
        </>
      ) : (
        <Text style={[styles.noData, { color: colors.textMuted }]}>T+1 데이터 — Supabase 설정 후 이용 가능</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  name: { fontSize: FontSize.sm, fontWeight: '600' },
  t1Badge: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  t1Text: { fontSize: 9, fontWeight: '600' },
  desc: { fontSize: FontSize.xs, marginBottom: Spacing.sm, lineHeight: 16 },
  amount: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: 2 },
  change: { fontSize: FontSize.sm, fontWeight: '600' },
  date: { fontSize: FontSize.xs, marginTop: 2 },
  skeleton: { borderRadius: Radius.sm, height: 44, marginTop: Spacing.xs },
  noData: { fontSize: FontSize.xs, marginTop: Spacing.xs, fontStyle: 'italic' },
});
