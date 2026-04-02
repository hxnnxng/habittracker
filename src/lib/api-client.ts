import type { HabitConfig, Entry, HabitData, ConfigChange } from "./types";

interface ConfigResponse {
  config: HabitConfig;
  configHistory: ConfigChange[];
}

export async function getConfig(): Promise<HabitConfig | null> {
  const res = await fetch("/api/config");
  if (!res.ok) return null;
  const data: ConfigResponse = await res.json();
  return data.config;
}

export async function getConfigFull(): Promise<ConfigResponse | null> {
  const res = await fetch("/api/config");
  if (!res.ok) return null;
  return res.json();
}

export async function saveConfig(config: HabitConfig): Promise<void> {
  await fetch("/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
}

export async function getEntries(last?: number): Promise<Entry[]> {
  const url = last ? `/api/entries?last=${last}` : "/api/entries";
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

export async function saveEntry(entry: Entry): Promise<void> {
  await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
}

export async function getAllData(): Promise<HabitData | null> {
  const configRes = await getConfigFull();
  if (!configRes) return null;
  const entries = await getEntries();
  return { config: configRes.config, entries, configHistory: configRes.configHistory };
}
