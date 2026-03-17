export type ContentLevel = "A1" | "A1+" | "A2" | "A2+" | "B1";

export type WordLevel = ContentLevel;

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
