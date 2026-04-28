export type IndicatorSource = 'yahoo' | 'fred' | 'cnn' | 'krx' | 'kofia' | 'naver';
export type IndicatorTab = 'global' | 'korea';
export type IndicatorGroup =
  | 'stocks'
  | 'volatility'
  | 'bonds'
  | 'currency'
  | 'kr_index'
  | 'kr_advance'
  | 'kr_investor';

export interface Indicator {
  id: string;
  name: string;
  nameEn: string;
  symbol?: string;
  source: IndicatorSource;
  tab: IndicatorTab;
  group: IndicatorGroup;
  unit: string;
  description: string;
  decimals: number;
  isT1?: boolean;
}

export const GLOBAL_INDICATORS: Indicator[] = [
  // ── 주요 주가지수 ──
  {
    id: 'dji',
    name: '다우존스',
    nameEn: 'Dow Jones',
    symbol: '^DJI',
    source: 'yahoo',
    tab: 'global',
    group: 'stocks',
    unit: 'pt',
    description: '미국 대표 30개 우량주의 평균 주가지수. 가장 오래된 주요 지수.',
    decimals: 2,
  },
  {
    id: 'gspc',
    name: 'S&P 500',
    nameEn: 'S&P 500',
    symbol: '^GSPC',
    source: 'yahoo',
    tab: 'global',
    group: 'stocks',
    unit: 'pt',
    description: '미국 500대 기업의 시가총액 가중 지수. 미국 증시의 기준선으로 통함.',
    decimals: 2,
  },
  {
    id: 'ixic',
    name: '나스닥',
    nameEn: 'NASDAQ',
    symbol: '^IXIC',
    source: 'yahoo',
    tab: 'global',
    group: 'stocks',
    unit: 'pt',
    description: '애플·엔비디아 등 기술주 중심의 미국 주요 지수.',
    decimals: 2,
  },
  {
    id: 'rut',
    name: '러셀 2000',
    nameEn: 'Russell 2000',
    symbol: '^RUT',
    source: 'yahoo',
    tab: 'global',
    group: 'stocks',
    unit: 'pt',
    description: '미국 중소형주 2,000개로 구성. 내수 경기의 바로미터.',
    decimals: 2,
  },
  {
    id: 'sox',
    name: '필라델피아 반도체',
    nameEn: 'SOX',
    symbol: '^SOX',
    source: 'yahoo',
    tab: 'global',
    group: 'stocks',
    unit: 'pt',
    description: '엔비디아·TSMC 등 글로벌 반도체 주요 기업 지수.',
    decimals: 2,
  },
  // ── 변동성 / 공포 ──
  {
    id: 'vix',
    name: 'VIX (변동성지수)',
    nameEn: 'CBOE VIX',
    symbol: '^VIX',
    source: 'yahoo',
    tab: 'global',
    group: 'volatility',
    unit: '',
    description: 'S&P500 옵션이 예측하는 30일간 변동성. \'공포지수\'라 불리며 높을수록 불안.',
    decimals: 2,
  },
  {
    id: 'fear_greed',
    name: '공포탐욕지수',
    nameEn: 'Fear & Greed',
    source: 'cnn',
    tab: 'global',
    group: 'volatility',
    unit: '',
    description: 'CNN이 7개 지표로 산출. 0=극공포, 100=극탐욕. 투자 심리를 한눈에.',
    decimals: 0,
  },
  // ── 채권 금리 ──
  {
    id: 'us2y',
    name: '미 2년 국채금리',
    nameEn: 'US 2Y Treasury',
    symbol: '^IRX',
    source: 'yahoo',
    tab: 'global',
    group: 'bonds',
    unit: '%',
    description: '연준 금리 정책에 민감하게 반응하는 단기 금리. 금리 방향 선행 지표.',
    decimals: 3,
  },
  {
    id: 'us10y',
    name: '미 10년 국채금리',
    nameEn: 'US 10Y Treasury',
    symbol: '^TNX',
    source: 'yahoo',
    tab: 'global',
    group: 'bonds',
    unit: '%',
    description: '글로벌 장기 기준금리. 주식·부동산·채권 가격에 가장 큰 영향을 미침.',
    decimals: 3,
  },
  {
    id: 'tips10y',
    name: '10년 실질금리 (TIPS)',
    nameEn: '10Y Real Yield',
    symbol: 'DFII10',
    source: 'fred',
    tab: 'global',
    group: 'bonds',
    unit: '%',
    description: '10년물 금리에서 기대인플레를 뺀 진짜 금리. 달러·금 가격에 결정적.',
    decimals: 2,
  },
  {
    id: 'hy_spread',
    name: '하이일드 스프레드',
    nameEn: 'HY Spread',
    symbol: 'BAMLH0A0HYM2',
    source: 'fred',
    tab: 'global',
    group: 'bonds',
    unit: '%',
    description: '정크본드와 국채 간 금리 차. 높을수록 시장이 위험을 경계하는 신호.',
    decimals: 2,
  },
  // ── 통화 / 원자재 ──
  {
    id: 'dxy',
    name: '달러 인덱스',
    nameEn: 'DXY',
    symbol: 'DX-Y.NYB',
    source: 'yahoo',
    tab: 'global',
    group: 'currency',
    unit: '',
    description: '유로·엔·파운드 등 6개 주요 통화 대비 달러의 강도.',
    decimals: 2,
  },
  {
    id: 'usdkrw',
    name: '원/달러 환율',
    nameEn: 'USD/KRW',
    symbol: 'KRW=X',
    source: 'yahoo',
    tab: 'global',
    group: 'currency',
    unit: '원',
    description: '1달러를 사는 데 필요한 원화. 높을수록 원화 약세·수입물가 상승.',
    decimals: 2,
  },
  {
    id: 'wti',
    name: 'WTI 원유',
    nameEn: 'WTI Crude',
    symbol: 'CL=F',
    source: 'yahoo',
    tab: 'global',
    group: 'currency',
    unit: '$',
    description: '서부텍사스산 원유 1배럴(약 159L)의 달러 가격.',
    decimals: 2,
  },
  {
    id: 'gold',
    name: '금',
    nameEn: 'Gold',
    symbol: 'GC=F',
    source: 'yahoo',
    tab: 'global',
    group: 'currency',
    unit: '$',
    description: '금 1트로이온스(약 31.1g) 달러 가격. 대표적인 안전자산.',
    decimals: 2,
  },
];

export const KOREA_INDICATORS: Indicator[] = [
  // ── 주요 지수 ──
  {
    id: 'kospi',
    name: '코스피',
    nameEn: 'KOSPI',
    symbol: '^KS11',
    source: 'yahoo',
    tab: 'korea',
    group: 'kr_index',
    unit: 'pt',
    description: '한국 증권거래소 전 종목 시가총액 가중 지수.',
    decimals: 2,
  },
  {
    id: 'kosdaq',
    name: '코스닥',
    nameEn: 'KOSDAQ',
    symbol: '^KQ11',
    source: 'yahoo',
    tab: 'korea',
    group: 'kr_index',
    unit: 'pt',
    description: '중소·벤처·IT 기업 중심의 한국 제2 주식시장 지수.',
    decimals: 2,
  },
  // ── 시장 등락 ──
  {
    id: 'kospi_adv',
    name: '코스피 등락',
    nameEn: 'KOSPI Adv/Dec',
    source: 'naver',
    tab: 'korea',
    group: 'kr_advance',
    unit: '',
    description: '당일 상승·하락·보합한 코스피 종목 수.',
    decimals: 0,
  },
  {
    id: 'kosdaq_adv',
    name: '코스닥 등락',
    nameEn: 'KOSDAQ Adv/Dec',
    source: 'naver',
    tab: 'korea',
    group: 'kr_advance',
    unit: '',
    description: '당일 상승·하락·보합한 코스닥 종목 수.',
    decimals: 0,
  },
  // ── 투자자 동향 (T+1) ──
  {
    id: 'deposit',
    name: '고객 예탁금',
    nameEn: 'Investor Deposit',
    source: 'kofia',
    tab: 'korea',
    group: 'kr_investor',
    unit: '억원',
    description: '투자자가 증권사에 맡긴 현금. 많을수록 시장 매수 여력이 높음.',
    decimals: 0,
    isT1: true,
  },
  {
    id: 'margin',
    name: '미수금',
    nameEn: 'Margin Receivable',
    source: 'kofia',
    tab: 'korea',
    group: 'kr_investor',
    unit: '억원',
    description: '결제일까지 납입 안 된 금액. 높으면 강제 매도(반대매매) 위험.',
    decimals: 0,
    isT1: true,
  },
  {
    id: 'credit',
    name: '신용잔고',
    nameEn: 'Credit Balance',
    source: 'kofia',
    tab: 'korea',
    group: 'kr_investor',
    unit: '억원',
    description: '증권사에서 빌려 매수한 금액. 높으면 하락 시 연쇄 매도 위험.',
    decimals: 0,
    isT1: true,
  },
];

export const GROUP_LABELS: Record<IndicatorGroup, string> = {
  stocks: '주요 주가지수',
  volatility: '변동성 · 심리',
  bonds: '채권 금리',
  currency: '통화 · 원자재',
  kr_index: '주요 지수',
  kr_advance: '시장 등락',
  kr_investor: '투자자 동향 (전일 기준)',
};
