export type HangeulCategory =
  | "plain_consonant"
  | "aspirated_consonant"
  | "tense_consonant"
  | "vowel"
  | "double_vowel";

export type HangeulEntry = {
  char: string;
  romanization: string;
  category: HangeulCategory;
};

export const hangeulEntries: HangeulEntry[] = [
  { char: "ㄱ", romanization: "g/k", category: "plain_consonant" },
  { char: "ㄴ", romanization: "n", category: "plain_consonant" },
  { char: "ㄷ", romanization: "d/t", category: "plain_consonant" },
  { char: "ㄹ", romanization: "r/l", category: "plain_consonant" },
  { char: "ㅁ", romanization: "m", category: "plain_consonant" },
  { char: "ㅂ", romanization: "b/p", category: "plain_consonant" },
  { char: "ㅅ", romanization: "s", category: "plain_consonant" },
  { char: "ㅇ", romanization: "silent/ng", category: "plain_consonant" },
  { char: "ㅈ", romanization: "j", category: "plain_consonant" },
  { char: "ㅊ", romanization: "ch", category: "aspirated_consonant" },
  { char: "ㅋ", romanization: "k", category: "aspirated_consonant" },
  { char: "ㅌ", romanization: "t", category: "aspirated_consonant" },
  { char: "ㅍ", romanization: "p", category: "aspirated_consonant" },
  { char: "ㅎ", romanization: "h", category: "aspirated_consonant" },
  { char: "ㄲ", romanization: "kk", category: "tense_consonant" },
  { char: "ㄸ", romanization: "tt", category: "tense_consonant" },
  { char: "ㅃ", romanization: "pp", category: "tense_consonant" },
  { char: "ㅆ", romanization: "ss", category: "tense_consonant" },
  { char: "ㅉ", romanization: "jj", category: "tense_consonant" },
  { char: "ㅏ", romanization: "a", category: "vowel" },
  { char: "ㅓ", romanization: "eo", category: "vowel" },
  { char: "ㅗ", romanization: "o", category: "vowel" },
  { char: "ㅜ", romanization: "u", category: "vowel" },
  { char: "ㅡ", romanization: "eu", category: "vowel" },
  { char: "ㅣ", romanization: "i", category: "vowel" },
  { char: "ㅐ", romanization: "ae", category: "vowel" },
  { char: "ㅔ", romanization: "e", category: "vowel" },
  { char: "ㅑ", romanization: "ya", category: "double_vowel" },
  { char: "ㅕ", romanization: "yeo", category: "double_vowel" },
  { char: "ㅛ", romanization: "yo", category: "double_vowel" },
  { char: "ㅠ", romanization: "yu", category: "double_vowel" },
  { char: "ㅒ", romanization: "yae", category: "double_vowel" },
  { char: "ㅖ", romanization: "ye", category: "double_vowel" },
  { char: "ㅘ", romanization: "wa", category: "double_vowel" },
  { char: "ㅙ", romanization: "wae", category: "double_vowel" },
  { char: "ㅚ", romanization: "oe", category: "double_vowel" },
  { char: "ㅝ", romanization: "wo", category: "double_vowel" },
  { char: "ㅞ", romanization: "we", category: "double_vowel" },
  { char: "ㅟ", romanization: "wi", category: "double_vowel" },
  { char: "ㅢ", romanization: "ui", category: "double_vowel" },
];

export const CATEGORY_LABELS: Record<HangeulCategory, string> = {
  plain_consonant: "Plain Consonants",
  aspirated_consonant: "Aspirated Consonants",
  tense_consonant: "Tense Consonants",
  vowel: "Vowels",
  double_vowel: "Double Vowels",
};

export const CATEGORY_ORDER: HangeulCategory[] = [
  "plain_consonant",
  "aspirated_consonant",
  "tense_consonant",
  "vowel",
  "double_vowel",
];

export function speakKorean(text: string) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.8;
  speechSynthesis.speak(utterance);
}
