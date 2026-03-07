export type WordLevel = "A1" | "A1+" | "A2";

export type WordCategory =
  | "greetings"
  | "numbers"
  | "food"
  | "verbs"
  | "family"
  | "places"
  | "adjectives"
  | "time"
  | "travel"
  | "daily"
  | "nature"
  | "body"
  | "emotions"
  | "shopping"
  | "weather"
  | "clothing"
  | "work";

export type Word = {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  category: WordCategory;
  level: WordLevel;
  example?: string;
};
