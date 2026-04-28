import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface Snapshot {
  id: string;
  created_at: string;
  label: string | null;
  data: Record<string, unknown>;
}

export function useSnapshots() {
  return useQuery<Snapshot[]>({
    queryKey: ['snapshots'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase
        .from('snapshots')
        .select('id, created_at, label, data')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
    enabled: isSupabaseConfigured,
  });
}

export function useSaveSnapshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { label: string | null; data: Record<string, unknown> }) => {
      if (!isSupabaseConfigured) throw new Error('Supabase 미설정');
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('로그인이 필요합니다');
      const { error } = await supabase.from('snapshots').insert({
        user_id: user.user.id,
        label: payload.label,
        data: payload.data,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['snapshots'] }),
  });
}

export function useDeleteSnapshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('snapshots').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['snapshots'] }),
  });
}
