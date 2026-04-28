import { useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { Spacing, FontSize } from '@/constants/theme';
import { KOREA_INDICATORS, GROUP_LABELS } from '@/constants/indicators';
import { useKoreanMarket } from '@/hooks/useKoreanMarket';
import { useTheme } from '@/contexts/ThemeContext';
import { BetaBanner } from '@/components/BetaBanner';
import { IndicatorCard } from '@/components/IndicatorCard';
import { IndicatorGroup as GroupSection } from '@/components/IndicatorGroup';
import { AdvanceDeclineCard } from '@/components/AdvanceDeclineCard';
import { InvestorCard } from '@/components/InvestorCard';
import { SnapshotButton } from '@/components/SnapshotButton';
import { formatTimestamp } from '@/lib/format';

export default function KoreaScreen() {
  const { colors } = useTheme();
  const { data, isLoading, isFetching, refetch, error } = useKoreanMarket();

  const getSnapshotData = useCallback((): Record<string, unknown> => {
    if (!data) return {};
    return {
      tab: 'korea',
      quotes: data.quotes,
      advanceDecline: data.advanceDecline,
      investorData: data.investorData,
      fetchedAt: data.fetchedAt,
    };
  }, [data]);

  const indexIndicators = KOREA_INDICATORS.filter(i => i.group === 'kr_index');
  const advanceIndicators = KOREA_INDICATORS.filter(i => i.group === 'kr_advance');
  const investorIndicators = KOREA_INDICATORS.filter(i => i.group === 'kr_investor');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BetaBanner />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={colors.accent}
          />
        }
      >
        <View style={styles.updateRow}>
          <Text style={[styles.updateText, { color: colors.textMuted }]}>
            {data ? `마지막 업데이트: ${formatTimestamp(data.fetchedAt)}` : '데이터 로딩 중...'}
          </Text>
          {error && <Text style={[styles.errorText, { color: colors.warning }]}>⚠ 일부 데이터를 불러오지 못했습니다.</Text>}
        </View>

        <GroupSection label={GROUP_LABELS['kr_index']}>
          {indexIndicators.map(ind => (
            <IndicatorCard
              key={ind.id}
              indicator={ind}
              data={data?.quotes[ind.id]}
              loading={isLoading}
            />
          ))}
        </GroupSection>

        <GroupSection label={GROUP_LABELS['kr_advance']}>
          {advanceIndicators.map(ind => (
            <AdvanceDeclineCard
              key={ind.id}
              name={ind.name}
              data={data?.advanceDecline[ind.id]}
              loading={isLoading}
            />
          ))}
        </GroupSection>

        <GroupSection label={GROUP_LABELS['kr_investor']}>
          {investorIndicators.map(ind => (
            <InvestorCard
              key={ind.id}
              name={ind.name}
              description={ind.description}
              data={data?.investorData[ind.id]}
              loading={isLoading}
            />
          ))}
        </GroupSection>

        <View style={styles.bottomPad} />
      </ScrollView>

      <SnapshotButton getSnapshotData={getSnapshotData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg },
  updateRow: { marginBottom: Spacing.lg },
  updateText: { fontSize: FontSize.xs },
  errorText: { fontSize: FontSize.xs, marginTop: 2 },
  bottomPad: { height: 100 },
});
