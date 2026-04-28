import { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize, cardShadow } from '@/constants/theme';
import { useSaveSnapshot } from '@/hooks/useSnapshots';
import { isSupabaseConfigured } from '@/lib/supabase';

interface Props {
  getSnapshotData: () => Record<string, unknown>;
}

export function SnapshotButton({ getSnapshotData }: Props) {
  const { colors, isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const save = useSaveSnapshot();

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
      Alert.alert('설정 필요', 'Supabase를 설정해야 스냅샷을 저장할 수 있습니다.\n.env 파일에 SUPABASE_URL과 ANON_KEY를 입력하세요.');
      return;
    }
    try {
      await save.mutateAsync({ label: label.trim() || null, data: getSnapshotData() });
      setVisible(false);
      setLabel('');
      Alert.alert('저장 완료', '스냅샷이 저장되었습니다.');
    } catch (e: any) {
      Alert.alert('오류', e.message ?? '저장에 실패했습니다.');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }, cardShadow(isDark)]}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>📷</Text>
        <Text style={styles.fabLabel}>스냅샷</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>스냅샷 저장</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>현재 시점의 모든 지표 수치를 저장합니다.</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
              placeholder="메모 (선택사항)"
              placeholderTextColor={colors.textMuted}
              value={label}
              onChangeText={setLabel}
              maxLength={50}
            />
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setVisible(false)}>
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleSave} disabled={save.isPending}>
                {save.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveText}>저장</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', bottom: 90, right: Spacing.lg, borderRadius: 30, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 4, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, zIndex: 100 },
  fabIcon: { fontSize: 18 },
  fabLabel: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  dialog: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.xl, width: '100%', maxWidth: 380 },
  title: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, marginBottom: Spacing.lg, lineHeight: 20 },
  input: { borderRadius: Radius.sm, borderWidth: 1, fontSize: FontSize.md, padding: Spacing.md, marginBottom: Spacing.lg },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  cancelBtn: { flex: 1, padding: Spacing.md, borderRadius: Radius.sm, borderWidth: 1, alignItems: 'center' },
  cancelText: { fontWeight: '600' },
  saveBtn: { flex: 1, padding: Spacing.md, borderRadius: Radius.sm, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
});
