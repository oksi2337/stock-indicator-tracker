import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSnapshots, useDeleteSnapshot, type Snapshot } from '@/hooks/useSnapshots';
import { SnapshotRow } from '@/components/SnapshotRow';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize, type ThemeColors } from '@/constants/theme';
import { isSupabaseConfigured } from '@/lib/supabase';
import { formatTimestamp, formatValue } from '@/lib/format';
import { GLOBAL_INDICATORS, KOREA_INDICATORS } from '@/constants/indicators';

const ALL_INDICATORS = [...GLOBAL_INDICATORS, ...KOREA_INDICATORS];

function SnapshotDetail({ snapshot, colors }: { snapshot: Snapshot; colors: ThemeColors }) {
  const data = snapshot.data as any;
  const quotes: Record<string, any> = { ...(data?.quotes ?? {}), ...(data?.fredData ?? {}) };
  const fearGreed = data?.fearGreed;
  const advDec: Record<string, any> = data?.advanceDecline ?? {};

  return (
    <>
      {Object.keys(quotes).length > 0 && (
        <>
          <Text style={[styles.detailGroupTitle, { color: colors.textSecondary }]}>지수 / 가격</Text>
          {Object.entries(quotes).map(([id, q]) => {
            const ind = ALL_INDICATORS.find(i => i.id === id);
            if (!ind || !q) return null;
            return (
              <View key={id} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailName, { color: colors.textSecondary }]}>{ind.name}</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatValue(q.value, ind.unit, ind.decimals)}
                </Text>
              </View>
            );
          })}
        </>
      )}

      {fearGreed && (
        <>
          <Text style={[styles.detailGroupTitle, { color: colors.textSecondary }]}>공포탐욕</Text>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailName, { color: colors.textSecondary }]}>공포탐욕지수</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{fearGreed.score} ({fearGreed.rating})</Text>
          </View>
        </>
      )}

      {Object.keys(advDec).length > 0 && (
        <>
          <Text style={[styles.detailGroupTitle, { color: colors.textSecondary }]}>시장 등락</Text>
          {Object.entries(advDec).map(([id, v]: any) => (
            <View key={id} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailName, { color: colors.textSecondary }]}>{id === 'kospi_adv' ? '코스피' : '코스닥'} 등락</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>↑{v.advance} ↓{v.decline} →{v.unchanged}</Text>
            </View>
          ))}
        </>
      )}
    </>
  );
}

export default function SnapshotsScreen() {
  const { colors } = useTheme();
  const { data: snapshots, isLoading } = useSnapshots();
  const deleteSnapshot = useDeleteSnapshot();
  const [selected, setSelected] = useState<Snapshot | null>(null);

  if (!isSupabaseConfigured) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Supabase 미설정</Text>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          .env 파일에 Supabase URL과 Key를 설정하면{'\n'}스냅샷 기능을 사용할 수 있습니다.
        </Text>
        <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.accent }]} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>설정 안내 보기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!snapshots?.length) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>📷 스냅샷 없음</Text>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          각 탭의 📷 스냅샷 버튼을 눌러{'\n'}현재 지표를 저장해보세요.
        </Text>
        <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.accent }]} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.count, { color: colors.textMuted }]}>{snapshots.length}개의 스냅샷</Text>
        {snapshots.map(s => (
          <SnapshotRow
            key={s.id}
            snapshot={s}
            onDelete={id => deleteSnapshot.mutate(id)}
            onPress={setSelected}
          />
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={!!selected}
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={[styles.detailContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.detailHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailTitle, { color: colors.text }]}>
              {selected ? formatTimestamp(selected.created_at) : ''}
            </Text>
            {selected?.label && <Text style={[styles.detailLabel, { color: colors.accent }]}>{selected.label}</Text>}
            <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
              <Text style={[styles.closeBtnText, { color: colors.accent }]}>닫기</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.detailContent}>
            {selected && <SnapshotDetail snapshot={selected} colors={colors} />}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg },
  count: { fontSize: FontSize.xs, marginBottom: Spacing.md },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.sm, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  loginBtn: { borderRadius: Radius.sm, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  loginBtnText: { color: '#fff', fontWeight: '700' },

  detailContainer: { flex: 1 },
  detailHeader: { padding: Spacing.lg, borderBottomWidth: 1, flexDirection: 'column', gap: 4 },
  detailTitle: { fontSize: FontSize.lg, fontWeight: '700' },
  detailLabel: { fontSize: FontSize.sm },
  closeBtn: { position: 'absolute', top: Spacing.lg, right: Spacing.lg },
  closeBtnText: { fontSize: FontSize.md },
  detailContent: { padding: Spacing.lg },

  detailGroupTitle: { fontSize: FontSize.sm, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  detailName: { fontSize: FontSize.sm, flex: 1 },
  detailValue: { fontSize: FontSize.sm, fontWeight: '600' },
});
