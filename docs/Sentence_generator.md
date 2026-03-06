# Korean Trainer – Sentence Generator System

## Purpose

The sentence generator allows the application to produce thousands of valid Korean example sentences from a small dataset.

Instead of manually writing large numbers of sentences, we define:

- vocabulary
- grammar patterns
- particle rules

The generator combines these elements to produce sentences dynamically.

This system supports:

- grammar lesson examples
- sentence builder exercises
- listening exercises
- translation exercises
- particle quizzes

The goal is to maximize learning variety while minimizing content maintenance.

---

# Core Idea

Instead of storing sentences like:

저는 밥을 먹어요  
저는 물을 마셔요  
저는 커피를 마셔요  

We store:

- words
- sentence patterns

Example pattern:

SUBJECT + OBJECT + VERB

Example generation:

subject: 저는  
object: 물을  
verb: 마셔요  

Result:

저는 물을 마셔요

English:

I drink water.

---

# Vocabulary Model

Words are stored with grammatical metadata.

Example TypeScript structure:

```ts
type WordType =
  | "subject"
  | "noun"
  | "verb"
  | "adjective"
  | "place"
  | "person";

type Word = {
  id: string;
  korean: string;
  english: string;
  type: WordType;
};
````

Example entries:

```ts
{
  id: "i",
  korean: "저",
  english: "I",
  type: "subject"
}

{
  id: "water",
  korean: "물",
  english: "water",
  type: "noun"
}

{
  id: "eat",
  korean: "먹어요",
  english: "eat",
  type: "verb"
}

{
  id: "drink",
  korean: "마셔요",
  english: "drink",
  type: "verb"
}
```

---

# Sentence Pattern Model

Sentence patterns define grammatical structure.

Example:

```ts
type SentencePattern = {
  id: string;
  name: string;
  englishOrder: string[];
  koreanOrder: string[];
};
```

Example pattern:

```ts
{
  id: "SOV",
  name: "Subject Object Verb",
  englishOrder: ["subject", "verb", "object"],
  koreanOrder: ["subject", "object", "verb"]
}
```

---

# Sentence Template

Some patterns require particles or additional markers.

Example template:

```ts
type SentenceTemplate = {
  patternId: string;
  koreanTemplate: string[];
  englishTemplate: string[];
};
```

Example:

```
subject + object + verb
```

Korean template:

```
{subject} {object+objectParticle} {verb}
```

English template:

```
{subject} {verb} {object}
```

---

# Particle System

Korean particles depend on whether the previous syllable has batchim (final consonant).

Examples:

Object marker:

을 / 를

Subject marker:

이 / 가

Topic marker:

은 / 는

---

# Batchim Detection

To determine which particle to use we detect whether the word ends with a final consonant.

Example function:

```ts
function hasBatchim(word: string): boolean {
  const lastChar = word.charCodeAt(word.length - 1);
  const base = lastChar - 44032;

  if (base < 0 || base > 11171) return false;

  return base % 28 !== 0;
}
```

---

# Particle Selection

Example object particle selection:

```ts
function objectParticle(noun: string) {
  return hasBatchim(noun) ? "을" : "를";
}
```

Example subject particle selection:

```ts
function subjectParticle(noun: string) {
  return hasBatchim(noun) ? "이" : "가";
}
```

Example topic particle selection:

```ts
function topicParticle(noun: string) {
  return hasBatchim(noun) ? "은" : "는";
}
```

---

# Sentence Generation

Basic generator example:

```ts
function generateSOVSentence(words: Word[]) {
  const subjects = words.filter(w => w.type === "subject");
  const nouns = words.filter(w => w.type === "noun");
  const verbs = words.filter(w => w.type === "verb");

  const subject = random(subjects);
  const noun = random(nouns);
  const verb = random(verbs);

  const particle = objectParticle(noun.korean);

  const korean =
    subject.korean + topicParticle(subject.korean) +
    " " +
    noun.korean + particle +
    " " +
    verb.korean;

  const english =
    subject.english +
    " " +
    verb.english +
    " " +
    noun.english;

  return {
    korean,
    english,
    pattern: "SOV"
  };
}
```

Example output:

Korean:

저는 물을 마셔요

English:

I drink water

---

# Sentence Example Structure

Generated examples should include structural metadata for learning.

Example output:

```ts
{
  korean: "저는 물을 마셔요",
  english: "I drink water",
  pattern: "SOV",
  koreanStructure: ["subject", "object", "verb"],
  englishStructure: ["subject", "verb", "object"]
}
```

This allows UI features like:

* colored syntax highlighting
* structure labels
* grammar explanations

---

# Integration With Lessons

Lessons should request examples from the generator.

Example:

Lesson:

Subject + Object + Verb

The lesson page should request:

* 3–5 generated examples

Example:

저는 밥을 먹어요
저는 물을 마셔요
저는 커피를 마셔요

---

# Integration With Games

Sentence Builder:

Generator produces:

```
저는 밥을 먹어요
```

Tokens:

```
저는
밥을
먹어요
```

Player arranges tokens.

---

Particles Game:

Generator produces:

```
저__ 밥을 먹어요
```

Choices:

```
은
는
이
가
```

Correct answer:

```
는
```

---

# Exercise Variety

If the dataset contains:

10 subjects
80 nouns
40 verbs

Possible combinations:

```
10 × 80 × 40 = 32,000 sentences
```

This allows the system to generate large exercise pools automatically.

---

# Future Extensions

The generator can later support more patterns.

Examples:

SUBJECT + LOCATION + GO

저는 학교에 가요

SUBJECT + ADJECTIVE

날씨가 좋아요

SUBJECT + NEGATIVE VERB

저는 커피를 안 마셔요

QUESTION PATTERNS

이거 뭐예요?

---

# Design Goals

The sentence generator must:

* produce grammatically valid beginner sentences
* support multiple grammar patterns
* provide structure metadata for UI
* integrate with lessons and games
* avoid repetitive sentences
* be deterministic when necessary for testing

---

# Summary

The sentence generator is a core system that enables:

* scalable lesson examples
* infinite practice sentences
* dynamic exercises
* consistent grammar patterns

By combining:

vocabulary + grammar patterns + particle rules

the app can generate thousands of educational sentences from a small dataset.

