import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

export interface Airport {
  ident: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
  elevationFt: number | null;
  municipality: string;
  country: string;
  region: string;
}

interface CsvRow {
  ident: string;
  type: string;
  name: string;
  latitude_deg: string;
  longitude_deg: string;
  elevation_ft: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
}

const ALLOWED_TYPES = new Set([
  "large_airport",
  "medium_airport",
  "small_airport",
]);

function loadAirports(): Airport[] {
  const file = readFileSync(
    new URL("../data/airports.csv", import.meta.url),
    "utf-8"
  );
  const rows = parse(file, { columns: true, skip_empty_lines: true }) as CsvRow[];

  return rows
    .filter((row) => ALLOWED_TYPES.has(row.type))
    .map((row) => ({
      ident: row.ident.toUpperCase(),
      name: row.name,
      type: row.type,
      lat: Number(row.latitude_deg),
      lon: Number(row.longitude_deg),
      elevationFt: row.elevation_ft ? Number(row.elevation_ft) : null,
      municipality: row.municipality,
      country: row.iso_country,
      region: row.iso_region,
    }));
}

const airports = loadAirports();
const byIdent = new Map(airports.map((a) => [a.ident, a]));

export function getAirport(ident: string): Airport | undefined {
  return byIdent.get(ident.toUpperCase());
}

export function searchAirports(query: string, limit = 10): Airport[] {
  const q = query.trim().toUpperCase();
  if (!q) return [];

  const exact = byIdent.get(q);
  const prefixMatches = airports.filter(
    (a) => a.ident.startsWith(q) && a.ident !== q
  );

  return [...(exact ? [exact] : []), ...prefixMatches].slice(0, limit);
}