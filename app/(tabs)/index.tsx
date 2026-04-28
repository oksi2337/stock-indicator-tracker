import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize, cardShadow } from '@/constants/theme';
import { useGlobalMarket } from '@/hooks/useGlobalMarket';
import { BetaBanner } from '@/components/BetaBanner';
import { formatValue, formatChangePercent, fearGreedLabel, fearGreedColor } from '@/lib/format';

const PREVIEW = [
  { id: 'gspc',    name: 'S&P 500',  unit: 'pt',  decimals: 2, icon: '📈' },
  { id: 'vix',     name: 'VIX',       unit: '',     decimals: 2, icon: '⚡' },
  { id: 'usdkrw',  name: '원/달러',  unit: '원',   decimals: 0, icon: '💱' },
  { id: 'gold',    name: '금',        unit: '$',    decimals: 1, icon: '🥇' },
];

const FEATURES = [
  { icon: '🌐', title: '글로벌 15개 지표', desc: '다우·나스닥·금리·환율 등', color: '#EFF6FF', accent: '#2563EB' },
  { icon: '📷', title: '스냅샷 기록',      desc: '지금 이 순간을 저장',      color: '#F0FDF4', accent: '#059669' },
  { icon: '🇰🇷', title: '한국 시장',      desc: '코스피·코스닥·투자자 동향', color: '#FFF7ED', accent: '#EA580C' },
  { icon: '📈', title: '시장 감각 키우기', desc: '숫자를 쌓으면 패턴이 보여요', color: '#FDF4FF', accent: '#9333EA' },
];

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { data, isLoading } = useGlobalMarket();

  // In dark mode, feature card backgrounds should be muted
  const featureCards = FEATURES.map(f => ({
    ...f,
    color: isDark ? colors.surfaceAlt : f.color,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BetaBanner />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero (그라디언트) ── */}
        <LinearGradient
          colors={isDark ? ['#1E293B', '#0F2744', '#1E293B'] : ['#1D4ED8', '#2563EB', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroIcon}>📊</Text>
          <Text style={styles.heroTitle}>MarketLens</Text>
          <Text style={styles.heroSub}>주식 초보자를 위한 글로벌·한국 지표 트래커</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroQuote}>"숫자에 익숙해지면{'\n'}시장이 보이기 시작합니다"</Text>
        </LinearGradient>

        {/* ── 기능 소개 ── */}
        <View style={styles.sectionRow}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.accent }]} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>이 앱으로 할 수 있는 것</Text>
        </View>

        <View style={[styles.featureGrid, { marginBottom: Spacing.xl }]}>
          {featureCards.map(f => (
            <View key={f.title} style={[styles.featureCard, { backgroundColor: f.color, borderColor: f.accent + '33' }]}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={[styles.featureTitle, { color: f.accent }]}>{f.title}</Text>
              <Text style={[styles.featureDesc, { color: isDark ? colors.textSecondary : '#475569' }]}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* ── 실시간 미리보기 ── */}
        <View style={styles.sectionRow}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.accent }]} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>지금 이 순간의 시장</Text>
          <View style={styles.liveBadge}>
            <Text style={[styles.liveDot, { color: colors.positive }]}>●</Text>
            <Text style={[styles.liveText, { color: colors.positive }]}>Live</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {PREVIEW.map(ind => {
            const q = data?.quotes[ind.id];
            const pct = q?.changePercent ?? 0;
            const isPos = pct >= 0;
            const changeColor = pct === 0 ? colors.textSecondary : isPos ? colors.positive : colors.negative;
            return (
              <View key={ind.id} style={[styles.miniCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(isDark)]}>
                <Text style={styles.miniCardIcon}>{ind.icon}</Text>
                <Text style={[styles.miniName, { color: colors.textMuted }]}>{ind.name}</Text>
                {isLoading ? (
                  <View style={[styles.miniSkeleton, { backgroundColor: colors.surfaceAlt }]} />
                ) : q ? (
                  <>
                    <Text style={[styles.miniValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
                      {formatValue(q.value, ind.unit, ind.decimals)}
                    </Text>
                    <Text style={[styles.miniChange, { color: changeColor }]}>
                      {pct !== 0 ? (isPos ? '▲ ' : '▼ ') : ''}{formatChangePercent(pct)}
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.miniNoData, { color: colors.textMuted }]}>—</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* 공포탐욕 풀 카드 */}
        {(isLoading || data?.fearGreed) && (
          <View style={[styles.fgCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(isDark)]}>
            <Text style={[styles.fgLabel, { color: colors.textSecondary }]}>😱 공포탐욕지수</Text>
            {isLoading ? (
              <View style={[styles.miniSkeleton, { backgroundColor: colors.surfaceAlt }]} />
            ) : data?.fearGreed ? (
              <View style={styles.fgRow}>
                <Text style={[styles.fgScore, { color: fearGreedColor(data.fearGreed.score) }]}>
                  {data.fearGreed.score}
                </Text>
                <View>
                  <Text style={[styles.fgRating, { color: fearGreedColor(data.fearGreed.score) }]}>
                    {fearGreedLabel(data.fearGreed.score)}
                  </Text>
                  <Text style={[styles.fgPrev, { color: colors.textMuted }]}>전일 {data.fearGreed.previousClose}</Text>
                </View>
                {/* Mini gauge */}
                <View style={styles.fgGaugeWrap}>
                  <View style={[styles.fgGaugeTrack, { backgroundColor: colors.surfaceAlt }]}>
                    <View style={[styles.fgGaugeFill, { width: `${data.fearGreed.score}%` as any, backgroundColor: fearGreedColor(data.fearGreed.score) }]} />
                  </View>
                  <View style={styles.fgScaleRow}>
                    <Text style={[styles.fgScaleText, { color: '#EF4444' }]}>극공포</Text>
                    <Text style={[styles.fgScaleText, { color: colors.textMuted }]}>중립</Text>
                    <Text style={[styles.fgScaleText, { color: '#10B981' }]}>극탐욕</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        )}

        <TouchableOpacity style={styles.moreLink} onPress={() => router.push('/(tabs)/global')} activeOpacity={0.7}>
          <Text style={[styles.moreLinkText, { color: colors.accent }]}>+ 15개 지표 전체 보기 →</Text>
        </TouchableOpacity>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/(tabs)/global')} activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>🌐  글로벌 지표 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/korea')} activeOpacity={0.85}
        >
          <Text style={[styles.secondaryBtnText, { color: colors.text }]}>🇰🇷  한국 지표 보기</Text>
        </TouchableOpacity>

        {/* ── 스냅샷 안내 ── */}
        <LinearGradient
          colors={isDark ? ['#1E293B', '#0C1E30'] : ['#EFF6FF', '#DBEAFE']}
          style={[styles.snapshotCard, { borderColor: colors.accent + '44' }]}
        >
          <Text style={[styles.snapshotTitle, { color: colors.text }]}>📷  스냅샷으로 나만의 기록을 쌓으세요</Text>
          <Text style={[styles.snapshotDesc, { color: colors.textSecondary }]}>
            지표 화면에서 스냅샷 버튼을 누르면 그 순간의 모든 수치가 저장됩니다.{'\n'}
            오르내림을 쌓아 보면, 어느 순간 시장의 흐름이 보이기 시작합니다.
          </Text>
          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/(auth)/login')} activeOpacity={0.8}
          >
            <Text style={styles.loginBtnText}>로그인 · 회원가입 →</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },

  // Hero
  hero: { borderRadius: Radius.lg, padding: Spacing.xxl, alignItems: 'center', marginBottom: Spacing.xl },
  heroIcon:  { fontSize: 48, marginBottom: Spacing.sm },
  heroTitle: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  heroSub:   { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm, textAlign: 'center', marginTop: Spacing.xs, lineHeight: 20 },
  heroDivider: { width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 1, marginVertical: Spacing.lg },
  heroQuote: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.md, fontStyle: 'italic', textAlign: 'center', lineHeight: 24 },

  // Section header
  sectionRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  sectionAccent:{ width: 3, height: 16, borderRadius: 2 },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700' },
  liveBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  liveDot:      { fontSize: 9 },
  liveText:     { fontSize: FontSize.xs, fontWeight: '700' },

  // Mini preview grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  miniCard: { flex: 1, minWidth: '47%', borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md },
  miniCardIcon: { fontSize: 20, marginBottom: 4 },
  miniName:  { fontSize: FontSize.xs, fontWeight: '600', marginBottom: Spacing.xs },
  miniValue: { fontSize: FontSize.lg, fontWeight: '700', letterSpacing: -0.3 },
  miniChange:{ fontSize: FontSize.sm, fontWeight: '600', marginTop: 2 },
  miniSkeleton: { borderRadius: 4, height: 36, marginTop: 4 },
  miniNoData:{ fontSize: FontSize.xl },

  // Fear & Greed card
  fgCard:  { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  fgLabel: { fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.sm },
  fgRow:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  fgScore: { fontSize: 40, fontWeight: '800', letterSpacing: -2, width: 64 },
  fgRating:{ fontSize: FontSize.md, fontWeight: '700' },
  fgPrev:  { fontSize: FontSize.xs, marginTop: 2 },
  fgGaugeWrap: { flex: 1 },
  fgGaugeTrack:{ height: 8, borderRadius: 4, overflow: 'hidden' },
  fgGaugeFill: { height: 8, borderRadius: 4, position: 'absolute' },
  fgScaleRow:  { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  fgScaleText: { fontSize: 9 },

  moreLink:     { alignSelf: 'flex-end', marginBottom: Spacing.xs },
  moreLinkText: { fontSize: FontSize.xs, fontWeight: '600' },

  // Feature grid
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  featureCard: { flex: 1, minWidth: '47%', borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md },
  featureIcon: { fontSize: 24, marginBottom: Spacing.sm },
  featureTitle:{ fontSize: FontSize.sm, fontWeight: '700', marginBottom: 2 },
  featureDesc: { fontSize: FontSize.xs, lineHeight: 16 },

  // CTA
  primaryBtn:  { borderRadius: Radius.md, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.sm },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  secondaryBtn:{ borderRadius: Radius.md, borderWidth: 1, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.xl },
  secondaryBtnText: { fontWeight: '600', fontSize: FontSize.md },

  // Snapshot card
  snapshotCard:  { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg },
  snapshotTitle: { fontSize: FontSize.md, fontWeight: '700', marginBottom: Spacing.sm },
  snapshotDesc:  { fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.lg },
  loginBtn:      { alignSelf: 'flex-start', borderRadius: Radius.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  loginBtnText:  { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },
});
