export interface Metrics {
  peRatio: number | null;
  marketCap: string;
  volume: number;
}

export interface Instrument {
  id: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  currency: string;
  marketStatus: 'Open' | 'Closed';
  tags: string[];
  metrics: Metrics;
  history: number[];
}

export type SortField = 'price' | 'change' | 'volume';
export type SortOrder = 'asc' | 'desc';
