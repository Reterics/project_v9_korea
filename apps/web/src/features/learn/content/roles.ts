/** Canonical color classes for each grammar role token. */
export const ROLE_COLORS: Record<string, string> = {
  subject:  "bg-namsaek-50 text-namsaek-700 border-namsaek-200 dark:bg-namsaek-800/50 dark:text-namsaek-200 dark:border-namsaek-700",
  object:   "bg-cheongja-50 text-cheongja-700 border-cheongja-200 dark:bg-cheongja-800/50 dark:text-cheongja-200 dark:border-cheongja-700",
  verb:     "bg-dancheong-50 text-dancheong-700 border-dancheong-200 dark:bg-dancheong-800/50 dark:text-dancheong-200 dark:border-dancheong-700",
  location: "bg-geum-50 text-geum-700 border-geum-200 dark:bg-geum-800/50 dark:text-geum-200 dark:border-geum-700",
  topic:    "bg-namsaek-50 text-namsaek-700 border-namsaek-200 dark:bg-namsaek-800/50 dark:text-namsaek-200 dark:border-namsaek-700",
};

/** Human-readable label for each grammar role. */
export const ROLE_LABELS: Record<string, string> = {
  subject:  "Subject",
  object:   "Object",
  verb:     "Verb",
  location: "Location",
  topic:    "Topic",
};

/** Display metadata for each game type. */
export const GAME_LABELS: Record<string, string> = {
  sentence_builder: "Sentence Builder",
  particles:        "Particles",
  flashcards:       "Flashcards",
};

export const GAME_DESC: Record<string, string> = {
  sentence_builder: "Build word order",
  particles:        "Fill particles",
  flashcards:       "Review words",
};
