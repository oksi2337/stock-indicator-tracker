import { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { C, Spacing, Radius, FontSize } from '@/constants/theme';
import { useSaveSnapshot } from '@/hooks/useSnapshots';
import { isSupabaseConfigured } from '@/lib/supabase';

interface Props {
  getSnapshotData: () => Record<string, unknown>;
}

export function SnapshotButton({ getSnapshotData }: Props) {
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
      <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>📷</Text>
        <Text style={styles.fabLabel}>스냅샷</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.title}>스냅샷 저장</Text>
            <Text style={styles.subtitle}>현재 시점의 모든 지표 수치를 저장합니다.</Text>

            <TextInput
              style={styles.input}
              placeholder="메모 (선택사항)"
              placeholderTextColor={C.textMuted}
              value={label}
              onChangeText={setLabel}
              maxLength={50}
            />

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setVisible(false)}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={save.isPending}>
                {save.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveText}>저장</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.lg,
    backgroundColor: C.accent,
    borderRadius: 30,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  fabIcon: { fontSize: 18 },
  fabLabel: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  dialog: {
    backgroundColor: C.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: C.border,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 380,
  },
  title: {
    color: C.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: C.textMuted,
    fontSize: FontSize.sm,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  input: {
    backgroundColor: C.surfaceAlt,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: C.border,
    color: C.text,
    fontSize: FontSize.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  cancelText: { color: C.textSecondary, fontWeight: '600' },
  saveBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: C.accent,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700' },
});
