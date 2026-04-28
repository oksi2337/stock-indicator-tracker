import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { C, Spacing, Radius, FontSize } from '@/constants/theme';
import { useGlobalMarket } from '@/hooks/useGlobalMarket';
import { BetaBanner } from '@/components/BetaBanner';
import { formatValue, formatChangePercent, fearGreedLabel, fearGreedColor } from '@/lib/format';

const PREVIEW_INDICATORS = [
  { id: 'gspc',   name: 'S&P 500',  unit: 'pt',  decimals: 2 },
  { id: 'vix',    name: 'VIX',       unit: '',     decimals: 2 },
  { id: 'usdkrw', name: '원/달러',  unit: '원',   decimals: 2 },
];

const FEATURES = [
  { icon: '🌐', title: '글로벌 15개 지표', desc: '다우·나스닥·금리·환율 등 핵심 지표' },
  { icon: '📷', title: '스냅샷 기록',      desc: '지금 이 순간의 수치를 저장' },
  { icon: '🇰🇷', title: '한국 시장',      desc: '코스피·코스닥·투자자 동향' },
  { icon: '📈', title: '시장 감각 키우기', desc: '숫자를 쌓으면 패턴이 보여요' },
];

export default function HomeScreen() {
  const { data, isLoading } = useGlobalMarket();

  return (
    <View style={styles.container}>
      <BetaBanner />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>📊</Text>
          <Text style={styles.heroTitle}>MarketLens</Text>
          <Text style={styles.heroSubtitle}>주식 초보자를 위한{'\n'}글로벌·한국 지표 트래커</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroQuote}>
            "숫자에 익숙해지면{'\n'}시장이 보이기 시작합니다"
          </Text>
        </View>

        {/* ── 실시간 미리보기 ── */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>지금 이 순간의 시장</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveDot}>●</Text>
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {PREVIEW_INDICATORS.map(ind => {
            const q = data?.quotes[ind.id];
            const pct = q?.changePercent ?? 0;
            const isPos = pct >= 0;
            const changeColor = pct === 0 ? C.textSecondary : isPos ? C.positive : C.negative;
            return (
              <View key={ind.id} style={styles.miniCard}>
                <Text style={styles.miniName}>{ind.name}</Text>
                {isLoading ? (
                  <View style={styles.miniSkeleton} />
                ) : q ? (
                  <>
                    <Text style={styles.miniValue} numberOfLines={1}>
                      {formatValue(q.value, ind.unit, ind.decimals)}
                    </Text>
                    <Text style={[styles.miniChange, { color: changeColor }]}>
                      {pct !== 0 ? (isPos ? '▲ ' : '▼ ') : ''}{formatChangePercent(pct)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.miniNoData}>—</Text>
                )}
              </View>
            );
          })}

          {/* 공포탐욕 특별 카드 */}
          <View style={styles.miniCard}>
            <Text style={styles.miniName}>공포탐욕지수</Text>
            {isLoading ? (
              <View style={styles.miniSkeleton} />
            ) : data?.fearGreed ? (
              <>
                <Text style={[styles.miniValue, { color: fearGreedColor(data.fearGreed.score) }]}>
                  {data.fearGreed.score}
                </Text>
                <Text style={[styles.miniChange, { color: fearGreedColor(data.fearGreed.score) }]}>
                  {fearGreedLabel(data.fearGreed.score)}
                </Text>
              </>
            ) : (
              <Text style={styles.miniNoData}>—</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.moreLink} onPress={() => router.push('/(tabs)/global')} activeOpacity={0.7}>
          <Text style={styles.moreLinkText}>+ 15개 지표 전체 보기 →</Text>
        </TouchableOpacity>

        {/* ── 기능 소개 ── */}
        <View style={[styles.sectionRow, { marginTop: Spacing.xl }]}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>이 앱으로 할 수 있는 것</Text>
        </View>

        <View style={styles.featureGrid}>
          {FEATURES.map(f => (
            <View key={f.title} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* ── CTA 버튼 ── */}
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(tabs)/global')} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>🌐  글로벌 지표 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(tabs)/korea')} activeOpacity={0.85}>
          <Text style={styles.secondaryBtnText}>🇰🇷  한국 지표 보기</Text>
        </TouchableOpacity>

        {/* ── 스냅샷 / 로그인 소프트 CTA ── */}
        <View style={styles.snapshotCard}>
          <Text style={styles.snapshotTitle}>📷  스냅샷으로 나만의 기록을 쌓으세요</Text>
          <Text style={styles.snapshotDesc}>
            지표 화면에서 스냅샷 버튼을 누르면 그 순간의 모든 수치가 저장됩니다.{'\n'}
            오르내림을 쌓아 보면, 어느 순간 시장의 흐름이 보이기 시작합니다.
          </Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')} activeOpacity={0.8}>
            <Text style={styles.loginBtnText}>로그인 · 회원가입 →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scroll:    { flex: 1 },
  content:   { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.xl,
    backgroundColor: C.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: C.border,
  },
  heroIcon:     { fontSize: 44, marginBottom: Spacing.sm },
  heroTitle:    { color: C.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  heroSubtitle: { color: C.textSecondary, fontSize: FontSize.md, textAlign: 'center', marginTop: Spacing.xs, lineHeight: 22 },
  heroDivider:  { width: 40, height: 2, backgroundColor: C.accent, borderRadius: 1, marginVertical: Spacing.lg },
  heroQuote:    { color: C.textMuted, fontSize: FontSize.md, fontStyle: 'italic', textAlign: 'center', lineHeight: 24 },

  // Section header
  sectionRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  sectionAccent:{ width: 3, height: 16, backgroundColor: C.accent, borderRadius: 2 },
  sectionTitle: { color: C.text, fontSize: FontSize.md, fontWeight: '700' },

  // Live badge
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  liveDot:   { color: C.positive, fontSize: 9 },
  liveText:  { color: C.positive, fontSize: FontSize.xs, fontWeight: '700' },

  // Mini preview grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  miniCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: C.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: Spacing.md,
  },
  miniName:    { color: C.textMuted, fontSize: FontSize.xs, fontWeight: '600', marginBottom: Spacing.xs },
  miniValue:   { color: C.text, fontSize: FontSize.xl, fontWeight: '700', letterSpacing: -0.5 },
  miniChange:  { fontSize: FontSize.sm, fontWeight: '600', marginTop: 2 },
  miniSkeleton:{ backgroundColor: C.surfaceAlt, borderRadius: 4, height: 40, marginTop: 4 },
  miniNoData:  { color: C.textMuted, fontSize: FontSize.xl },

  moreLink: { alignSelf: 'flex-end', marginBottom: Spacing.xs },
  moreLinkText: { color: C.accent, fontSize: FontSize.xs, fontWeight: '600' },

  // Feature grid
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  featureCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: C.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  featureIcon:  { fontSize: 22, marginBottom: Spacing.xs },
  featureTitle: { color: C.text, fontSize: FontSize.sm, fontWeight: '700', marginBottom: 2 },
  featureDesc:  { color: C.textMuted, fontSize: FontSize.xs, lineHeight: 16 },

  // CTA buttons
  primaryBtn: {
    backgroundColor: C.accent,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },

  secondaryBtn: {
    backgroundColor: C.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  secondaryBtnText: { color: C.text, fontWeight: '600', fontSize: FontSize.md },

  // Snapshot / Login card
  snapshotCard: {
    backgroundColor: C.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: C.accent + '55',
    padding: Spacing.lg,
  },
  snapshotTitle: { color: C.text, fontSize: FontSize.md, fontWeight: '700', marginBottom: Spacing.sm },
  snapshotDesc:  { color: C.textSecondary, fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.lg },
  loginBtn:      { alignSelf: 'flex-start', backgroundColor: C.surfaceAlt, borderRadius: Radius.sm, borderWidth: 1, borderColor: C.border, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  loginBtnText:  { color: C.accent, fontWeight: '700', fontSize: FontSize.sm },
});
