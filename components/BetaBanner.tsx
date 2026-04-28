import { View, Text, StyleSheet } from 'react-native';
import { C, Spacing, FontSize } from '@/constants/theme';

export function BetaBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🔔 <Text style={styles.bold}>베타 버전</Text> — 무료 제공 중이며, 데이터는 약 15~20분 지연될 수 있습니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2D2006',
    borderBottomWidth: 1,
    borderBottomColor: '#5C4500',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  text: {
    color: '#F59E0B',
    fontSize: FontSize.xs,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
  },
});
