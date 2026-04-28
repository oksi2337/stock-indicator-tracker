import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize } from '@/constants/theme';

export function BetaBanner() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.warningBg, borderBottomColor: colors.warning + '44' }]}>
      <Text style={[styles.text, { color: colors.warning }]}>
        🔔 <Text style={styles.bold}>베타 버전</Text> — 무료 제공 중이며, 데이터는 약 15~20분 지연될 수 있습니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  text: { fontSize: FontSize.xs, lineHeight: 18 },
  bold: { fontWeight: '700' },
});
