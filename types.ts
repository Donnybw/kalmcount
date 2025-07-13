

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
}

export interface ReflectionEntry {
  id: number;
  timestamp: string;
  text: string;
  chatHistory?: ChatMessage[];
}

export enum SessionTab {
  Meditation = 'Guided Meditation',
  Breathing = 'Guided Breath',
  Mantras = 'Mantras',
  Reflections = 'Reflections',
  Visualizer = 'Visualizer',
}

export interface MoodLog {
    date: string; // YYYY-MM-DD
    mood: number; // 1-5
    tags: string[];
    intention: string;
}

export type MantrasByCategory = {
    [category: string]: string[];
};

export interface ChatMessage {
    sender: 'guide' | 'user';
    text: string;
}

export interface DailyActivities {
    date: string; // YYYY-MM-DD
    meditation: boolean;
    breathing: boolean;
    mantras: boolean;
    reflections: boolean;
}
