export interface HabitConfig {
  goals: string[];
  levels: number;
}

export interface Entry {
  date: string;
  scores: number[];
}

export interface ConfigChange {
  date: string;
  config: HabitConfig;
}

export interface HabitData {
  config: HabitConfig;
  entries: Entry[];
  configHistory: ConfigChange[];
}
