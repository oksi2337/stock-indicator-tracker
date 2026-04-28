import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { C, Spacing, Radius, FontSize } from '@/constants/theme';
import { type Snapshot } from '@/hooks/useSnapshots';
import { formatTimestamp } from '@/lib/format';

interface Props {
  snapshot: Snapshot;
  onDelete: (id: string) => void;
  onPress: (snapshot: Snapshot) => void;
}

export function SnapshotRow({ snapshot, onDelete, onPress }: Props) {
  const handleDelete = () => {
    Alert.alert('삭제', '이 스냅샷을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => onDelete(snapshot.id) },
    ]);
  };

  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(snapshot)} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.time}>{formatTimestamp(snapshot.created_at)}</Text>
        {snapshot.label ? (
          <Text style={styles.label}>{snapshot.label}</Text>
        ) : (
          <Text style={styles.noLabel}>메모 없음</Text>
        )}
      </View>
      <TouchableOpacity onPress={handleDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  left: { flex: 1 },
  time: {
    color: C.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  label: {
    color: C.accent,
    fontSize: FontSize.sm,
  },
  noLabel: {
    color: C.textMuted,
    fontSize: FontSize.sm,
  },
  deleteIcon: { fontSize: 18, paddingLeft: Spacing.md },
});
