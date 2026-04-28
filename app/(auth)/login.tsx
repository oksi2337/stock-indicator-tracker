import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, Radius, FontSize } from '@/constants/theme';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notConfigured}>
          <Text style={[styles.notConfiguredTitle, { color: colors.text }]}>⚙️ Supabase 미설정</Text>
          <Text style={[styles.notConfiguredText, { color: colors.textSecondary }]}>
            .env 파일에 아래 값을 설정하면 로그인과 스냅샷 동기화를 사용할 수 있습니다.
          </Text>
          <View style={[styles.codeBlock, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.code, { color: colors.accent }]}>EXPO_PUBLIC_SUPABASE_URL=...</Text>
            <Text style={[styles.code, { color: colors.accent }]}>EXPO_PUBLIC_SUPABASE_ANON_KEY=...</Text>
          </View>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backBtnText, { color: colors.text }]}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력하세요.');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        Alert.alert('가입 완료', '이메일을 확인해 주세요.', [{ text: '확인', onPress: () => router.back() }]);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.back();
      }
    } catch (e: any) {
      Alert.alert('오류', e.message ?? '인증에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: Platform.OS === 'web' ? window.location.origin : 'stocktracker://auth' },
    });
    if (error) Alert.alert('오류', error.message);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={[styles.title, { color: colors.text }]}>스냅샷 저장을 위해{'\n'}로그인하세요</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>각자의 기록이 클라우드에 안전하게 저장됩니다.</Text>

        <TouchableOpacity
          style={[styles.googleBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleGoogleLogin}
        >
          <Text style={[styles.googleBtnText, { color: colors.text }]}>🔐 Google로 로그인</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>또는 이메일</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="이메일"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="비밀번호"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.accent }]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>{isSignUp ? '회원가입' : '로그인'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(v => !v)} style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.accent }]}>
            {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: Spacing.xl, paddingTop: Spacing.xxl },

  title: { fontSize: FontSize.xl, fontWeight: '800', marginBottom: Spacing.sm, lineHeight: 32 },
  subtitle: { fontSize: FontSize.sm, marginBottom: Spacing.xxl, lineHeight: 20 },

  googleBtn: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.lg },
  googleBtnText: { fontSize: FontSize.md, fontWeight: '600' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg, gap: Spacing.sm },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: FontSize.xs },

  input: { borderRadius: Radius.sm, borderWidth: 1, fontSize: FontSize.md, padding: Spacing.md, marginBottom: Spacing.sm },
  submitBtn: { borderRadius: Radius.sm, padding: Spacing.lg, alignItems: 'center', marginTop: Spacing.sm, marginBottom: Spacing.lg },
  submitText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  switchRow: { alignItems: 'center' },
  switchText: { fontSize: FontSize.sm },

  notConfigured: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  notConfiguredTitle: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.md },
  notConfiguredText: { fontSize: FontSize.sm, lineHeight: 22, marginBottom: Spacing.lg },
  codeBlock: { borderRadius: Radius.sm, padding: Spacing.md, marginBottom: Spacing.xl },
  code: { fontSize: FontSize.xs, fontFamily: 'monospace', lineHeight: 22 },
  backBtn: { borderRadius: Radius.sm, borderWidth: 1, padding: Spacing.md, alignItems: 'center' },
  backBtnText: { fontWeight: '600' },
});
