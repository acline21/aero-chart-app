export interface CloudLayer {
  cover: string;
  base: number | null;
}

export interface Metar {
  icaoId: string;
  rawOb: string;
  reportTime: string;
  temp: number | null;
  dewp: number | null;
  wdir: number | string | null;
  wspd: number | null;
  wgst: number | null;
  visib: number | string | null;
  altim: number | null;
  fltCat: string | null;
  clouds: CloudLayer[];
}

const BASE_URL = "https://aviationweather.gov/api/data/metar";
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  fetchedAt: number;
  data: Metar | null;
}

const cache = new Map<string, CacheEntry>();

export async function getMetar(ident: string): Promise<Metar | null> {
  const key = ident.toUpperCase();

  const cached = cache.get(key);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `${BASE_URL}?ids=${encodeURIComponent(key)}&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather service responded with ${response.status}`);
  }

  const text = await response.text();
  const parsed: Metar[] = text.trim() ? JSON.parse(text) : [];
  const data = parsed[0] ?? null;

  cache.set(key, { fetchedAt: Date.now(), data });
  return data;
}