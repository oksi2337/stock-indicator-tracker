import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { C, Spacing, Radius, FontSize } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <View style={styles.container}>
        <View style={styles.notConfigured}>
          <Text style={styles.notConfiguredTitle}>⚙️ Supabase 미설정</Text>
          <Text style={styles.notConfiguredText}>
            .env 파일에 아래 값을 설정하면 로그인과 스냅샷 동기화를 사용할 수 있습니다.
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>EXPO_PUBLIC_SUPABASE_URL=...</Text>
            <Text style={styles.code}>EXPO_PUBLIC_SUPABASE_ANON_KEY=...</Text>
          </View>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>돌아가기</Text>
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>스냅샷 저장을 위해{'\n'}로그인하세요</Text>
        <Text style={styles.subtitle}>각자의 기록이 클라우드에 안전하게 저장됩니다.</Text>

        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
          <Text style={styles.googleBtnText}>🔐 Google로 로그인</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는 이메일</Text>
          <View style={styles.dividerLine} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor={C.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor={C.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleAuth} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>{isSignUp ? '회원가입' : '로그인'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(v => !v)} style={styles.switchRow}>
          <Text style={styles.switchText}>
            {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  inner: { padding: Spacing.xl, paddingTop: Spacing.xxl },

  title: { color: C.text, fontSize: FontSize.xl, fontWeight: '800', marginBottom: Spacing.sm, lineHeight: 32 },
  subtitle: { color: C.textMuted, fontSize: FontSize.sm, marginBottom: Spacing.xxl, lineHeight: 20 },

  googleBtn: {
    backgroundColor: C.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  googleBtnText: { color: C.text, fontSize: FontSize.md, fontWeight: '600' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg, gap: Spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { color: C.textMuted, fontSize: FontSize.xs },

  input: {
    backgroundColor: C.surface,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: C.border,
    color: C.text,
    fontSize: FontSize.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  submitBtn: {
    backgroundColor: C.accent,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  switchRow: { alignItems: 'center' },
  switchText: { color: C.accent, fontSize: FontSize.sm },

  notConfigured: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  notConfiguredTitle: { color: C.text, fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.md },
  notConfiguredText: { color: C.textSecondary, fontSize: FontSize.sm, lineHeight: 22, marginBottom: Spacing.lg },
  codeBlock: { backgroundColor: C.surfaceAlt, borderRadius: Radius.sm, padding: Spacing.md, marginBottom: Spacing.xl },
  code: { color: C.accent, fontSize: FontSize.xs, fontFamily: 'monospace', lineHeight: 22 },
  backBtn: { backgroundColor: C.surface, borderRadius: Radius.sm, borderWidth: 1, borderColor: C.border, padding: Spacing.md, alignItems: 'center' },
  backBtnText: { color: C.text, fontWeight: '600' },
});
