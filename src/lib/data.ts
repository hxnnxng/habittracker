import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { HabitData } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_PATH = path.join(DATA_DIR, "habits.json");

const DEFAULT_DATA: HabitData = {
  config: { goals: [], levels: 0 },
  entries: [],
  configHistory: [],
};

export async function readData(): Promise<HabitData> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw) as HabitData;
    if (!data.configHistory) data.configHistory = [];
    return data;
  } catch {
    return DEFAULT_DATA;
  }
}

export async function writeData(data: HabitData): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}
