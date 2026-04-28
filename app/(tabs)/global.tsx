import { useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { Spacing, FontSize } from '@/constants/theme';
import { GLOBAL_INDICATORS, GROUP_LABELS, type IndicatorGroup } from '@/constants/indicators';
import { useGlobalMarket } from '@/hooks/useGlobalMarket';
import { useTheme } from '@/contexts/ThemeContext';
import { BetaBanner } from '@/components/BetaBanner';
import { IndicatorCard } from '@/components/IndicatorCard';
import { IndicatorGroup as GroupSection } from '@/components/IndicatorGroup';
import { FearGreedGauge } from '@/components/FearGreedGauge';
import { SnapshotButton } from '@/components/SnapshotButton';
import { formatTimestamp } from '@/lib/format';

const GROUPS: IndicatorGroup[] = ['stocks', 'volatility', 'bonds', 'currency'];

export default function GlobalScreen() {
  const { colors } = useTheme();
  const { data, isLoading, isFetching, refetch, error } = useGlobalMarket();

  const getSnapshotData = useCallback((): Record<string, unknown> => {
    if (!data) return {};
    return {
      tab: 'global',
      quotes: data.quotes,
      fearGreed: data.fearGreed,
      fredData: data.fredData,
      fetchedAt: data.fetchedAt,
    };
  }, [data]);

  const allQuotes = { ...(data?.quotes ?? {}), ...(data?.fredData ?? {}) };

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
          {error && (
            <Text style={[styles.errorText, { color: colors.warning }]}>⚠ 일부 데이터를 불러오지 못했습니다.</Text>
          )}
        </View>

        {GROUPS.map(group => {
          const indicators = GLOBAL_INDICATORS.filter(ind => ind.group === group);
          return (
            <GroupSection key={group} label={GROUP_LABELS[group]}>
              {indicators.map(ind => {
                if (ind.id === 'fear_greed') {
                  return (
                    <FearGreedGauge
                      key={ind.id}
                      data={data?.fearGreed}
                      loading={isLoading}
                    />
                  );
                }
                return (
                  <IndicatorCard
                    key={ind.id}
                    indicator={ind}
                    data={allQuotes[ind.id]}
                    loading={isLoading}
                  />
                );
              })}
            </GroupSection>
          );
        })}

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
