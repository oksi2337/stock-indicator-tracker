export function formatValue(value: number, unit: string, decimals: number): string {
  if (!isFinite(value)) return '—';

  const formatted = value.toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (unit === '$') return `$${formatted}`;
  if (unit === '원') return `₩${formatted}`;
  if (unit === '%') return `${formatted}%`;
  if (unit === '억원') return formatKRW(value);
  if (unit === 'pt' || unit === '') return formatted;
  return `${formatted} ${unit}`;
}

export function formatChange(change: number, decimals: number): string {
  if (!isFinite(change)) return '—';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatChangePercent(pct: number): string {
  if (!isFinite(pct)) return '—';
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

export function formatKRW(billions: number): string {
  const abs = Math.abs(billions);
  if (abs >= 10000) {
    const jo = Math.floor(abs / 10000);
    const ukRaw = abs % 10000;
    const uk = Math.round(ukRaw / 100) * 100;
    const prefix = billions < 0 ? '-' : '';
    if (uk > 0) return `${prefix}${jo.toLocaleString('ko-KR')}조 ${uk.toLocaleString('ko-KR')}억`;
    return `${prefix}${jo.toLocaleString('ko-KR')}조`;
  }
  return `${billions.toLocaleString('ko-KR')}억`;
}

export function formatKRWChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${formatKRW(change)}`;
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function fearGreedLabel(score: number): string {
  if (score <= 24) return '극도의 공포';
  if (score <= 44) return '공포';
  if (score <= 55) return '중립';
  if (score <= 74) return '탐욕';
  return '극도의 탐욕';
}

export function fearGreedColor(score: number): string {
  if (score <= 24) return '#EF4444';
  if (score <= 44) return '#F97316';
  if (score <= 55) return '#EAB308';
  if (score <= 74) return '#84CC16';
  return '#10B981';
}
