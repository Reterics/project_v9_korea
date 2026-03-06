Absolutely — below is a **Codex-ready markdown brief/prompt** you can save as something like:

`docs/grammar-first-learning-plan.md`

It is focused on your **current app state** and explains **what to change**, **where to incorporate the new idea**, and **how to evolve the existing games** into a more study-first system.

---

# Korean Trainer – Grammar-First Learning Upgrade Plan

````md
# Korean Trainer – Grammar-First Learning Upgrade Plan

## Context

We already have these features/pages in the app:

- Hangeul Practice
- Flashcards
- Sentence Builder
- Particles

The Sentence Builder and Particles games are already implemented and visually close to production quality.

Current issue:
- The app is becoming game-heavy and slightly repetitive.
- I want to introduce a more study-first learning model.
- Before each new sentence type or grammar concept, the learner should first see a learning page with examples and structure explanation.

Example of the intended learning approach:

English:
I drink water.
[subject] [verb] [object]

Korean:
저는 물을 마셔요.
[subject] [object] [verb]

Goal:
- Teach Korean grammar through patterns and examples first
- Then let the games reinforce that pattern
- Reduce repetitive “random game” feeling
- Keep the existing games, but reposition them as practice tools after explanation

---

## Product Direction

We want to shift the app from:

Game -> Game -> Game

to:

Learn pattern -> See examples -> Understand structure -> Practice with game -> Review mistakes

Core philosophy:

Example -> Pattern -> Practice -> Review

This means the app should become more like a structured learning trainer, not just a mini-game collection.

---

## Main Change

Introduce a new content type and page type:

- Grammar Pattern Lesson Page

This page should appear before or alongside practice games.

Each lesson page explains one sentence pattern clearly with:
- English sentence
- Korean sentence
- structural labels
- short explanation
- more examples
- linked practice actions

---

## What to Add

### 1. New top-level section or navigation item

Add one of these:

Option A:
- Grammar

Option B:
- Lessons

Recommended:
- Grammar

Updated navigation example:
- Hub
- Hangeul
- Grammar
- Dictionary
- Notes

Games do not need to disappear, but they should become part of a lesson/practice flow instead of feeling like isolated tools.

---

## 2. New "Grammar Pattern Lesson" page type

Create a reusable lesson page component/template.

### Page purpose

Teach one Korean sentence structure or grammar concept before practice begins.

### Example lesson content

Pattern title:
- Subject + Object + Verb

Intro example:

English:
I drink water.
[subject] [verb] [object]

Korean:
저는 물을 마셔요.
[subject] [object] [verb]

Short explanation:
- In Korean, the verb usually comes at the end.
- The object comes before the verb.
- 저는 marks the topic/subject in this example.

More examples:
- 저는 밥을 먹어요. (I eat rice.)
- 저는 커피를 마셔요. (I drink coffee.)
- 저는 영화를 봐요. (I watch a movie.)

Practice CTA buttons:
- Practice with Sentence Builder
- Practice with Particles
- Review vocabulary used in this lesson

---

## 3. Convert current games into lesson-linked practice modules

### Sentence Builder
Current role:
- standalone game

New role:
- practice for word order patterns learned in the lesson

Changes:
- each sentence builder session should know which grammar pattern it belongs to
- the lesson page should deep link into a filtered sentence builder session
- show the grammar pattern name at the top of the game
- optionally show a compact reminder:
  - Pattern: Subject + Object + Verb

### Particles
Current role:
- standalone particle fill game

New role:
- targeted reinforcement after a lesson introduces particles or sentence roles

Changes:
- connect particle questions to lesson context
- show which structure the sentence belongs to
- optionally show role labels:
  - subject / object / verb
- keep the game short and focused

### Flashcards
Current role:
- vocab drill

New role:
- vocab support for lesson words

Changes:
- allow lesson-scoped flashcards
- example:
  - "Words from this lesson"
  - water, rice, eat, drink, topic marker examples

### Hangeul Practice
No major structural change needed.
This remains foundational and separate.

---

## 4. Add a lesson-first flow to the Hub

Current Hub is game-oriented.
Update it so the user can continue either:
- a lesson
- or a practice session

### Suggested Hub changes

Replace or complement the main CTA:

Current:
- Start session

New:
- Continue lesson
- Resume practice

Add a "Current lesson" block:
- Pattern name
- short summary
- progress through lesson
- buttons:
  - Open lesson
  - Practice now

Example:
- Current lesson: Subject + Object + Verb
- You learned: basic Korean word order
- Next: particle reinforcement

The existing game cards can remain, but should be framed as:
- Flashcards – review words
- Sentence Builder – practice word order
- Particles – practice markers

This keeps the app coherent.

---

## 5. Add a lesson-to-practice relationship in the data model

We need lessons as a real content entity.

### New entity: GrammarLesson

Example shape:

```ts
type GrammarLesson = {
  id: string;
  slug: string;
  title: string;
  category: "sentence-pattern" | "particles" | "question-form" | "negative-form";
  level: "A1";
  summary: string;

  pattern?: {
    englishOrder: string[];
    koreanOrder: string[];
  };

  examples: LessonExample[];
  explanationBlocks: LessonExplanationBlock[];
  relatedWordIds: string[];
  practiceModes: Array<"sentence_builder" | "particles" | "flashcards" | "listening">;

  nextLessonId?: string;
};
````

```ts
type LessonExample = {
  id: string;
  english: string;
  korean: string;
  englishBreakdown: string[]; // ["subject", "verb", "object"]
  koreanBreakdown: string[];  // ["subject", "object", "verb"]
  notes?: string[];
};
```

```ts
type LessonExplanationBlock = {
  id: string;
  type: "text" | "tip" | "warning";
  title?: string;
  content: string;
};
```

---

## 6. Suggested first lesson set

Create the first lessons around high-value beginner structures.

### Lesson 1

Subject + Object + Verb
Example:

* 저는 물을 마셔요.

### Lesson 2

Subject + Noun + 이에요/예요
Example:

* 저는 학생이에요.

### Lesson 3

Subject + Location + 가요
Example:

* 저는 학교에 가요.

### Lesson 4

Basic particles

* 은/는
* 이/가
* 을/를

### Lesson 5

Basic questions

* 이거 뭐예요?
* 어디에 가요?

### Lesson 6

Basic negatives

* 안 먹어요
* 안 가요

This is enough to start making the app feel structured and educational.

---

## 7. UI/UX requirements for the new lesson page

Create a lesson page that matches the current visual style of the app:

* calm
* minimal
* card-based
* high readability
* large Hangul
* compact but elegant

### Recommended lesson page structure

1. Lesson header

* lesson title
* small category label
* progress info
* next practice CTA

2. Intro example card

* English sentence
* English structure labels
* Korean sentence
* Korean structure labels

3. Key explanation card

* 2–4 short explanation bullets
* no long grammar essay
* keep beginner-friendly

4. More examples card

* 3–5 examples
* optionally expandable

5. Practice actions

* Sentence Builder
* Particles
* Flashcards

6. Notes / reminder block

* one-line summary:

    * Korean verbs usually come at the end.

### Important

Do not overwhelm the learner with grammar terminology.
Focus on pattern recognition through examples.

---

## 8. How to incorporate this without breaking the current app

Do not remove existing games.
Instead:

* keep the existing routes/components
* add lesson pages above them in the learning hierarchy
* allow games to receive optional `lessonId`
* when `lessonId` is present:

    * filter content to that lesson
    * show pattern context
    * update progress under that lesson

This avoids rewriting everything.

### Example flow

* User opens Grammar > Lesson 1
* Reads example and explanation
* clicks "Practice with Sentence Builder"
* Sentence Builder opens with only lesson-relevant sentences
* after completion, Results page suggests:

    * Continue lesson
    * Practice particles
    * Review words

---

## 9. Update the concept of progress

Currently progress may be mostly game-based.
We now want both:

* Lesson progress
* Practice progress

### Track lesson progress

```ts
type LessonProgress = {
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  viewedAt?: number;
  completedAt?: number;
  practiceCount: number;
};
```

### Track practice performance per lesson

* accuracy by lesson
* mistakes by lesson
* words seen in lesson
* pattern mastery

This allows the Hub to say:

* You learned the structure
* Now practice particles
* You still struggle with object markers

---

## 10. Recommended implementation plan

### Phase 1 – Minimal viable lesson system

Implement:

* Grammar nav item
* lesson list page
* lesson detail page
* one real lesson: Subject + Object + Verb
* link Sentence Builder and Particles to lesson context

### Phase 2 – Context-aware practice

* add `lessonId` support to Sentence Builder
* add `lessonId` support to Particles
* show pattern summary inside games

### Phase 3 – Progress and recommendations

* lesson progress tracking
* recommended next lesson
* lesson-based weak area suggestions

### Phase 4 – Expand content

* add 5–10 beginner lessons
* add more examples generated from lesson vocabulary
* connect flashcards to lesson vocabulary sets

---

## 11. Specific deliverables to implement

Please help implement the following in order:

1. A `GrammarLesson` data model
2. A `GrammarLessonPage` React page/component
3. A lesson list page
4. A route structure for grammar pages
5. Update Sentence Builder to accept `lessonId`
6. Update Particles to accept `lessonId`
7. Update Hub to show current lesson and practice CTA
8. Add lesson progress tracking
9. Make the first lesson: Subject + Object + Verb

---

## 12. Constraints

* Keep the current app’s visual style
* Do not redesign everything from scratch
* Reuse existing game components where possible
* Prefer composable React + TypeScript architecture
* Keep content/data separate from UI
* Keep explanations beginner-friendly and compact
* Avoid overly academic grammar explanations

---

## 13. Expected outcome

After this change, the app should feel like:

* a structured Korean learning trainer
* grammar taught through examples
* games used as reinforcement
* less repetitive
* more educational
* more suitable for real study

The app should guide the learner like this:

Learn the pattern -> Understand it through examples -> Practice it in a focused game -> Review mistakes -> Move to the next pattern

---

## 14. What I want from Codex or Claude

Use this document as the implementation brief.

When proposing code or architecture:

* prioritize practical incremental changes
* build on top of the current game-based app
* do not replace working features unnecessarily
* prefer reusable lesson components and lesson-linked practice
* assume the existing app already has Sentence Builder, Particles, Flashcards, and Hangeul Practice

