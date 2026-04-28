import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize } from '@/constants/theme';

interface Props {
  label: string;
  children: React.ReactNode;
}

export function IndicatorGroup({ label, children }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={[styles.accent, { backgroundColor: colors.accent }]} />
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.xl },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  accent: { width: 3, height: 16, borderRadius: 2 },
  label: { fontSize: FontSize.md, fontWeight: '700', letterSpacing: 0.3 },
});
