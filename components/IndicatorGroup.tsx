import { View, Text, StyleSheet } from 'react-native';
import { C, Spacing, FontSize } from '@/constants/theme';

interface Props {
  label: string;
  children: React.ReactNode;
}

export function IndicatorGroup({ label, children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.accent} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  accent: {
    width: 3,
    height: 16,
    backgroundColor: C.accent,
    borderRadius: 2,
  },
  label: {
    color: C.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
