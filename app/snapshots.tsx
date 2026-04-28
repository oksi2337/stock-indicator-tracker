import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSnapshots, useDeleteSnapshot, type Snapshot } from '@/hooks/useSnapshots';
import { SnapshotRow } from '@/components/SnapshotRow';
import { C, Spacing, Radius, FontSize } from '@/constants/theme';
import { isSupabaseConfigured } from '@/lib/supabase';
import { formatTimestamp, formatValue } from '@/lib/format';
import { GLOBAL_INDICATORS, KOREA_INDICATORS } from '@/constants/indicators';

const ALL_INDICATORS = [...GLOBAL_INDICATORS, ...KOREA_INDICATORS];

export default function SnapshotsScreen() {
  const { data: snapshots, isLoading } = useSnapshots();
  const deleteSnapshot = useDeleteSnapshot();
  const [selected, setSelected] = useState<Snapshot | null>(null);

  if (!isSupabaseConfigured) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>Supabase 미설정</Text>
        <Text style={styles.emptyText}>
          .env 파일에 Supabase URL과 Key를 설정하면{'\n'}스냅샷 기능을 사용할 수 있습니다.
        </Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>설정 안내 보기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={C.accent} />
      </View>
    );
  }

  if (!snapshots?.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>📷 스냅샷 없음</Text>
        <Text style={styles.emptyText}>
          각 탭의 📷 스냅샷 버튼을 눌러{'\n'}현재 지표를 저장해보세요.
        </Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.count}>{snapshots.length}개의 스냅샷</Text>
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

      {/* Detail modal */}
      <Modal
        visible={!!selected}
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>
              {selected ? formatTimestamp(selected.created_at) : ''}
            </Text>
            {selected?.label && <Text style={styles.detailLabel}>{selected.label}</Text>}
            <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>닫기</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.detailContent}>
            {selected && renderSnapshotDetail(selected)}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function renderSnapshotDetail(snapshot: Snapshot) {
  const data = snapshot.data as any;
  const quotes: Record<string, any> = { ...(data?.quotes ?? {}), ...(data?.fredData ?? {}) };
  const fearGreed = data?.fearGreed;
  const advDec: Record<string, any> = data?.advanceDecline ?? {};
  const investor: Record<string, any> = data?.investorData ?? {};

  return (
    <>
      {Object.keys(quotes).length > 0 && (
        <>
          <Text style={styles.detailGroupTitle}>지수 / 가격</Text>
          {Object.entries(quotes).map(([id, q]) => {
            const ind = ALL_INDICATORS.find(i => i.id === id);
            if (!ind || !q) return null;
            return (
              <View key={id} style={styles.detailRow}>
                <Text style={styles.detailName}>{ind.name}</Text>
                <Text style={styles.detailValue}>
                  {formatValue(q.value, ind.unit, ind.decimals)}
                </Text>
              </View>
            );
          })}
        </>
      )}

      {fearGreed && (
        <>
          <Text style={styles.detailGroupTitle}>공포탐욕</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailName}>공포탐욕지수</Text>
            <Text style={styles.detailValue}>{fearGreed.score} ({fearGreed.rating})</Text>
          </View>
        </>
      )}

      {Object.keys(advDec).length > 0 && (
        <>
          <Text style={styles.detailGroupTitle}>시장 등락</Text>
          {Object.entries(advDec).map(([id, v]: any) => (
            <View key={id} style={styles.detailRow}>
              <Text style={styles.detailName}>{id === 'kospi_adv' ? '코스피' : '코스닥'} 등락</Text>
              <Text style={styles.detailValue}>↑{v.advance} ↓{v.decline} →{v.unchanged}</Text>
            </View>
          ))}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg },
  count: { color: C.textMuted, fontSize: FontSize.xs, marginBottom: Spacing.md },

  centered: { flex: 1, backgroundColor: C.background, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { color: C.text, fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.sm },
  emptyText: { color: C.textMuted, fontSize: FontSize.sm, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  loginBtn: { backgroundColor: C.accent, borderRadius: Radius.sm, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  loginBtnText: { color: '#fff', fontWeight: '700' },

  detailContainer: { flex: 1, backgroundColor: C.background },
  detailHeader: { padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'column', gap: 4 },
  detailTitle: { color: C.text, fontSize: FontSize.lg, fontWeight: '700' },
  detailLabel: { color: C.accent, fontSize: FontSize.sm },
  closeBtn: { position: 'absolute', top: Spacing.lg, right: Spacing.lg },
  closeBtnText: { color: C.accent, fontSize: FontSize.md },
  detailContent: { padding: Spacing.lg },

  detailGroupTitle: { color: C.textSecondary, fontSize: FontSize.sm, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: C.border },
  detailName: { color: C.textSecondary, fontSize: FontSize.sm, flex: 1 },
  detailValue: { color: C.text, fontSize: FontSize.sm, fontWeight: '600' },
});
