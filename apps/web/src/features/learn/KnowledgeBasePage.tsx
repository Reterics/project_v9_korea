import { useState } from "react";
import { ChevronDown, BookText, Puzzle, LayoutList, PenLine } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data types                                                         */
/* ------------------------------------------------------------------ */

type TableRow = string[];

type Section = {
  title: string;
  content: React.ReactNode;
};

type NoteSheet = {
  id: string;
  title: string;
  icon: React.ReactNode;
  sections: Section[];
};

/* ------------------------------------------------------------------ */
/*  Shared UI                                                          */
/* ------------------------------------------------------------------ */

function NoteCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-hanji-300 bg-white p-4 dark:border-namsaek-700 dark:bg-namsaek-900">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-sm font-semibold text-namsaek-800 dark:text-hanji-100">
      {children}
    </h3>
  );
}

function KTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: TableRow[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="mt-1 w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="border border-hanji-200 bg-hanji-50 px-3 py-2 text-left text-xs font-semibold dark:border-namsaek-700 dark:bg-namsaek-800"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="border border-hanji-200 px-3 py-2 dark:border-namsaek-700"
                  dangerouslySetInnerHTML={{ __html: cell }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="mr-1 mb-1 inline-block rounded-full border border-hanji-200 bg-hanji-50 px-2 py-0.5 text-xs dark:border-namsaek-700 dark:bg-namsaek-800">
      {children}
    </span>
  );
}

function Keyline({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 border-t border-dashed border-hanji-300 pt-2 text-xs font-semibold dark:border-namsaek-700">
      {children}
    </p>
  );
}

function DrillList({ items }: { items: { q: string; a: string }[] }) {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-2">
      <button
        onClick={() => setShow((v) => !v)}
        className="text-xs font-semibold text-namsaek-500 hover:underline dark:text-cheongja-400"
      >
        {show ? "Hide answers" : "Show answers"}
      </button>
      <ol className="mt-1 list-inside list-decimal space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i}>
            {item.q}{" "}
            {show && (
              <span className="font-semibold text-cheongja-600 dark:text-cheongja-400">
                {item.a}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sheet 1: Batchim & Spelling                                        */
/* ------------------------------------------------------------------ */

const batchimSheet: NoteSheet = {
  id: "batchim",
  title: "Batchim & Spelling",
  icon: <BookText className="h-5 w-5" />,
  sections: [
    {
      title: "1) Core Principle",
      content: (
        <NoteCard>
          <SectionTitle>1) Core Principle</SectionTitle>
          <p className="text-sm">
            Korean spelling is <strong>morphological (root-based)</strong>, not
            purely phonetic.
          </p>
          <p className="mt-1 text-sm">
            What you hear &#8800; always what you write. Spelling preserves the{" "}
            <strong>dictionary root</strong>.
          </p>
          <Keyline>
            Mental shift: Word &rarr; remember spelling (not sound &rarr; build
            letters).
          </Keyline>
        </NoteCard>
      ),
    },
    {
      title: "2) Batchim Simplification",
      content: (
        <NoteCard>
          <SectionTitle>2) Batchim Simplification</SectionTitle>
          <p className="text-sm">
            At syllable end, Korean reduces to 7 final sounds:
          </p>
          <p className="mt-1 text-sm font-semibold">ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ</p>
          <p className="mt-1 text-xs text-hanji-500 dark:text-hanji-400">
            Double batchim (겹받침): usually only one consonant is pronounced
            (the rest "hides" unless a vowel follows).
          </p>
        </NoteCard>
      ),
    },
    {
      title: "3) Why Spelling Can Feel Unfair",
      content: (
        <NoteCard>
          <SectionTitle>3) Why Spelling Can Feel Unfair</SectionTitle>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Audio tests without explaining rules.</li>
            <li>
              Many different spellings share the same sound (like English
              right/write).
            </li>
            <li>
              Solution: learn the <strong>word</strong> + its dictionary
              spelling.
            </li>
          </ul>
        </NoteCard>
      ),
    },
    {
      title: "4) Essential Double Batchim Patterns (A1)",
      content: (
        <NoteCard>
          <SectionTitle>4) Essential Double Batchim Patterns (A1)</SectionTitle>
          <KTable
            headers={["Written", "Final sound", "Example (meaning)", "Sounds like"]}
            rows={[
              ["<strong>ㄹㄱ</strong>", "<strong>ㄱ</strong>", "<strong>읽다</strong> (to read)", "익따"],
              ["<strong>ㄴㅈ</strong>", "<strong>ㄴ</strong>", "<strong>앉다</strong> (to sit)", "안따"],
              ["<strong>ㄴㅎ</strong>", "<strong>ㄴ</strong>", "<strong>많다</strong> (to be many)", "만타"],
              ["<strong>ㅂㅅ</strong>", "<strong>ㅂ</strong>", "<strong>없다</strong> (to not have)", "업따"],
              ["<strong>ㄹㅁ</strong>", "<strong>ㅁ</strong>", "<strong>삶</strong> (life)", "삼"],
              ["<strong>ㄹㅂ</strong>", "<strong>ㄹ</strong>", "<strong>짧다</strong> (to be short)", "짤따"],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            Note: Some minimal sound differences exist, but for beginners, treat
            these as "same audio, different spelling" cases.
          </p>
        </NoteCard>
      ),
    },
    {
      title: "5) Common Confusions",
      content: (
        <NoteCard>
          <SectionTitle>5) Common Confusions</SectionTitle>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>
              <strong>읽다</strong> (read) vs <strong>익다</strong> (ripen)
              &rarr; often sound similar.
            </li>
            <li>
              <strong>앉다</strong> (sit) vs <strong>안</strong> (not) &rarr;
              context decides.
            </li>
            <li>
              <strong>많이</strong> &rarr; 마니 (ㅎ disappears).
            </li>
            <li>
              <strong>없다</strong> &rarr; 업따 (ㅂㅅ &rarr; ㅂ sound).
            </li>
          </ul>
        </NoteCard>
      ),
    },
    {
      title: "6) Practical Strategy",
      content: (
        <NoteCard>
          <SectionTitle>6) Practical Strategy</SectionTitle>
          <ol className="list-inside list-decimal space-y-1 text-sm">
            <li>
              Identify the <strong>word</strong> (meaning + context).
            </li>
            <li>
              Recall the <strong>dictionary form</strong> spelling.
            </li>
            <li>
              Spell from the <strong>root</strong> (not from sound).
            </li>
          </ol>
          <Keyline>
            Key reminder: Spelling protects structure. Pronunciation simplifies
            sound.
          </Keyline>
        </NoteCard>
      ),
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Sheet 2: Particles                                                 */
/* ------------------------------------------------------------------ */

const particlesSheet: NoteSheet = {
  id: "particles",
  title: "Particles",
  icon: <Puzzle className="h-5 w-5" />,
  sections: [
    {
      title: "0) One rule to choose the correct form",
      content: (
        <NoteCard>
          <SectionTitle>0) One rule to choose the correct form</SectionTitle>
          <p className="text-sm">
            If the noun ends with a consonant (batchim) &rarr; use the{" "}
            <strong>left</strong>. If it ends with a vowel &rarr; use the{" "}
            <strong>right</strong>.
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Pill>consonant &rarr; 은 / 이 / 을 / 과</Pill>
            <Pill>vowel &rarr; 는 / 가 / 를 / 와</Pill>
          </div>
          <Keyline>
            Particles are not "extra words" — they show the role of the noun.
          </Keyline>
        </NoteCard>
      ),
    },
    {
      title: "1) 은/는 vs 이/가",
      content: (
        <NoteCard>
          <SectionTitle>1) 은/는 vs 이/가</SectionTitle>
          <p className="text-sm">
            <strong>은/는</strong> = topic ("as for…", contrast, general
            statement)
          </p>
          <p className="text-sm">
            <strong>이/가</strong> = subject ("the one that does/is…", new info,
            focus)
          </p>
          <KTable
            headers={["Use 은/는", "Use 이/가"]}
            rows={[
              [
                "Introduce a topic:<br><strong>저는</strong> 학생이에요.",
                "New / important subject:<br><strong>비가</strong> 와요.",
              ],
              [
                "Contrast:<br>저는 커피는 좋아해요. <strong>차는</strong> 싫어요.",
                'Answer "who/what?":<br>누가 왔어요? &rarr; <strong>민수가</strong> 왔어요.',
              ],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            <strong>Beginner shortcut:</strong> When in doubt in simple "I…"
            sentences, use <strong>저는</strong>.
          </p>
        </NoteCard>
      ),
    },
    {
      title: "2) 을/를 (Object)",
      content: (
        <NoteCard>
          <SectionTitle>2) 을/를 (Object)</SectionTitle>
          <p className="text-sm">
            <strong>을/를</strong> marks the thing you do the verb to.
          </p>
          <KTable
            headers={["Pattern", "Examples"]}
            rows={[
              [
                "[Noun] + 을/를 + Verb",
                "<strong>한국어를</strong> 배워요. (I learn Korean.)<br><strong>밥을</strong> 먹어요. (I eat rice/meal.)",
              ],
              [
                "When omitted",
                "In casual speech, sometimes dropped:<br>밥(을) 먹었어?",
              ],
            ]}
          />
        </NoteCard>
      ),
    },
    {
      title: "3) 에 vs 에서",
      content: (
        <NoteCard>
          <SectionTitle>3) 에 vs 에서</SectionTitle>
          <p className="text-sm">
            <strong>에</strong> = destination / time / location of existence
          </p>
          <p className="text-sm">
            <strong>에서</strong> = place where an action happens (do/meet/work)
          </p>
          <KTable
            headers={["에", "에서"]}
            rows={[
              [
                "Go/come/to:<br>학교<strong>에</strong> 가요.",
                "Do action at:<br>학교<strong>에서</strong> 공부해요.",
              ],
              [
                "Exist at:<br>집<strong>에</strong> 있어요.",
                "Meet at:<br>카페<strong>에서</strong> 만나요.",
              ],
              [
                "Time:<br>3시<strong>에</strong> 와요.",
                'Start "from" a place:<br>여기<strong>에서</strong> 시작해요.',
              ],
            ]}
          />
        </NoteCard>
      ),
    },
    {
      title: "4) 와/과 + 하고 (And/With)",
      content: (
        <NoteCard>
          <SectionTitle>4) 와/과 + 하고 (And/With)</SectionTitle>
          <p className="text-sm">
            <strong>와/과</strong> = "and/with" (more formal / common in
            writing)
          </p>
          <p className="text-sm">
            <strong>하고</strong> = "and/with" (very common in speech)
          </p>
          <KTable
            headers={["Meaning", "Examples"]}
            rows={[
              [
                "and",
                "김치<strong>하고</strong> 밥 / 김치<strong>와</strong> 밥",
              ],
              [
                "with (together)",
                "친구<strong>하고</strong> 영화 봐요. (I watch a movie with a friend.)",
              ],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            Also common: <strong>랑/이랑</strong> (very casual "with/and").
          </p>
        </NoteCard>
      ),
    },
    {
      title: "5) Micro drills",
      content: (
        <NoteCard>
          <SectionTitle>5) Micro drills (30 seconds)</SectionTitle>
          <DrillList
            items={[
              { q: "저___ 학생이에요. (은/는)", a: "→ 저는" },
              { q: "민수___ 와요. (이/가)", a: "→ 민수가" },
              { q: "커피___ 마셔요. (을/를)", a: "→ 커피를" },
              { q: "집___ 있어요. (에/에서)", a: "→ 집에" },
              { q: "학교___ 공부해요. (에/에서)", a: "→ 학교에서" },
            ]}
          />
          <Keyline>
            Goal: choose the particle fast, then build sentences confidently.
          </Keyline>
        </NoteCard>
      ),
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Sheet 3: Sentence Patterns                                         */
/* ------------------------------------------------------------------ */

const sentencePatternsSheet: NoteSheet = {
  id: "sentence-patterns",
  title: "Sentence Patterns",
  icon: <LayoutList className="h-5 w-5" />,
  sections: [
    {
      title: "0) Korean sentence order",
      content: (
        <NoteCard>
          <SectionTitle>0) Korean sentence order (default)</SectionTitle>
          <p className="text-sm">
            <code>Subject + (Object) + Verb</code> &rarr; Verb comes at the end.
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Pill>저는 밥을 먹어요.</Pill>
            <Pill>저는 집에 있어요.</Pill>
            <Pill>저는 한국어를 공부해요.</Pill>
          </div>
          <Keyline>
            Use particles to show roles (은/는, 이/가, 을/를, 에/에서).
          </Keyline>
        </NoteCard>
      ),
    },
    {
      title: '1) "I am …" (noun)',
      content: (
        <NoteCard>
          <SectionTitle>1) "I am …" (noun)</SectionTitle>
          <p className="text-sm">
            Use <strong>이에요/예요</strong> (present polite).
          </p>
          <KTable
            headers={["Pattern", "Examples"]}
            rows={[
              [
                "N(받침 O)+이에요",
                "학생<strong>이에요</strong>. / 한국 사람<strong>이에요</strong>.",
              ],
              [
                "N(받침 X)+예요",
                "의사<strong>예요</strong>.",
              ],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            Common: <strong>저는</strong> 학생이에요. / <strong>이거</strong>{" "}
            뭐예요?
          </p>
        </NoteCard>
      ),
    },
    {
      title: '2) "It is …" / "This is …"',
      content: (
        <NoteCard>
          <SectionTitle>2) "It is …" / "This is …"</SectionTitle>
          <KTable
            headers={["Pattern", "Examples"]}
            rows={[
              [
                "이거/그거/저거 + N",
                "<strong>이거</strong> 커피예요. / <strong>저거</strong> 책이에요.",
              ],
              [
                "N + 이에요/예요",
                "이거는 <strong>물</strong>이에요. / 그거는 <strong>차</strong>예요.",
              ],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            <strong>이거</strong> = this, <strong>그거</strong> = that (near
            you), <strong>저거</strong> = that (far)
          </p>
        </NoteCard>
      ),
    },
    {
      title: '3) "I have / don\'t have"',
      content: (
        <NoteCard>
          <SectionTitle>3) "I have / don't have"</SectionTitle>
          <p className="text-sm">
            Use <strong>있다/없다</strong>.
          </p>
          <KTable
            headers={["Pattern", "Examples"]}
            rows={[
              [
                "N이/가 있어요",
                "시간<strong>이</strong> 있어요. / 돈<strong>이</strong> 있어요.",
              ],
              [
                "N이/가 없어요",
                "시간<strong>이</strong> 없어요. / 차<strong>가</strong> 없어요.",
              ],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            Also "exist at": 집에 있어요 (I'm at home).
          </p>
        </NoteCard>
      ),
    },
    {
      title: '4) "I want to …"',
      content: (
        <NoteCard>
          <SectionTitle>4) "I want to …"</SectionTitle>
          <p className="text-sm">
            Use <strong>-고 싶어요</strong> after the verb stem.
          </p>
          <KTable
            headers={["Pattern", "Examples"]}
            rows={[
              [
                "V-고 싶어요",
                "먹<strong>고 싶어요</strong>. / 자<strong>고 싶어요</strong>. / 가<strong>고 싶어요</strong>.",
              ],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            Want a thing: <strong>N을/를</strong> 먹고 싶어요 (I want to eat N).
          </p>
        </NoteCard>
      ),
    },
    {
      title: '5) "Please do …"',
      content: (
        <NoteCard>
          <SectionTitle>5) "Please do …"</SectionTitle>
          <p className="text-sm">
            Use <strong>-아/어 주세요</strong> (polite request).
          </p>
          <KTable
            headers={["Pattern", "Examples"]}
            rows={[
              [
                "V-아/어 주세요",
                "기다려<strong> 주세요</strong>. / 말해<strong> 주세요</strong>. / 도와<strong> 주세요</strong>.",
              ],
              [
                "Common fixed",
                "<strong>주세요</strong> = please give (also \"please\").",
              ],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            In caf&eacute;s: 아메리카노 하나 주세요 (One Americano, please).
          </p>
        </NoteCard>
      ),
    },
    {
      title: '6) "Can you …?" / "Can I …?"',
      content: (
        <NoteCard>
          <SectionTitle>6) "Can you …?" / "Can I …?"</SectionTitle>
          <p className="text-sm">
            Very common A1 polite pattern: <strong>-아/어도 돼요?</strong> (Is it
            okay if…?)
          </p>
          <KTable
            headers={["Pattern", "Examples"]}
            rows={[
              [
                "V-아/어도 돼요?",
                "들어가<strong>도 돼요?</strong> (May I enter?)<br>여기 앉아<strong>도 돼요?</strong> (May I sit here?)",
              ],
              [
                "Answer",
                "<strong>네, 돼요.</strong> / <strong>네, 괜찮아요.</strong> / <strong>안 돼요.</strong>",
              ],
            ]}
          />
        </NoteCard>
      ),
    },
    {
      title: "7) Negation (not / don't)",
      content: (
        <NoteCard>
          <SectionTitle>7) Negation (not / don't)</SectionTitle>
          <KTable
            headers={["Pattern", "Examples"]}
            rows={[
              [
                "안 + V",
                "<strong>안</strong> 가요. / <strong>안</strong> 먹어요. / <strong>안</strong> 자요.",
              ],
              [
                "못 + V (cannot)",
                "<strong>못</strong> 가요. (can't go) / <strong>못</strong> 해요. (can't do)",
              ],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            안 = choose not to. 못 = cannot (ability/situation).
          </p>
        </NoteCard>
      ),
    },
    {
      title: "8) Micro drills",
      content: (
        <NoteCard>
          <SectionTitle>8) Micro drills (fill the blanks)</SectionTitle>
          <DrillList
            items={[
              { q: "저는 학생_____.", a: "→ 이에요" },
              { q: "시간이 _____.", a: "→ 없어요" },
              { q: "커피를 먹_____.", a: "→ 고 싶어요" },
              { q: "여기 앉아____?", a: "→ 도 돼요" },
              { q: "오늘 ____ 가요.", a: "→ 안" },
            ]}
          />
          <Keyline>
            If you can use these 8 patterns, you can survive most A1
            conversations.
          </Keyline>
        </NoteCard>
      ),
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Sheet 4: Verb Endings                                              */
/* ------------------------------------------------------------------ */

const verbEndingsSheet: NoteSheet = {
  id: "verb-endings",
  title: "Verb Endings",
  icon: <PenLine className="h-5 w-5" />,
  sections: [
    {
      title: "0) The idea",
      content: (
        <NoteCard>
          <SectionTitle>0) The idea</SectionTitle>
          <p className="text-sm">
            Most beginner sentences are: <code>[Verb stem] + ending</code>.
          </p>
          <p className="mt-1 text-sm">
            Dictionary form ends with <strong>-다</strong> (가다, 먹다, 하다). In
            speech, you usually use polite endings like{" "}
            <strong>-아요/-어요</strong>.
          </p>
          <Keyline>
            Goal: pick the right polite ending fast (present / past / "I'm
            doing").
          </Keyline>
        </NoteCard>
      ),
    },
    {
      title: "1) Make the stem",
      content: (
        <NoteCard>
          <SectionTitle>1) Make the stem</SectionTitle>
          <p className="text-sm">
            Remove <strong>-다</strong> &rarr; that's the stem.
          </p>
          <KTable
            headers={["Dictionary", "Stem"]}
            rows={[
              ["<strong>가다</strong> (to go)", "<strong>가-</strong>"],
              ["<strong>먹다</strong> (to eat)", "<strong>먹-</strong>"],
              ["<strong>하다</strong> (to do)", "<strong>하-</strong>"],
              ["<strong>보다</strong> (to see/watch)", "<strong>보-</strong>"],
            ]}
          />
        </NoteCard>
      ),
    },
    {
      title: "2) Present polite: -아요 / -어요",
      content: (
        <NoteCard>
          <SectionTitle>2) Present polite: -아요 / -어요</SectionTitle>
          <p className="text-sm">Look at the last vowel of the stem.</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Pill>
              <strong>ㅏ or ㅗ</strong> &rarr; <strong>-아요</strong>
            </Pill>
            <Pill>
              <strong>others</strong> &rarr; <strong>-어요</strong>
            </Pill>
          </div>
          <KTable
            headers={["Stem", "Present"]}
            rows={[
              ["<strong>가-</strong>", "<strong>가요</strong>"],
              ["<strong>보-</strong>", "<strong>봐요</strong> (보+아요)"],
              ["<strong>먹-</strong>", "<strong>먹어요</strong>"],
              ["<strong>마시-</strong> (drink)", "<strong>마셔요</strong>"],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            <strong>Beginner shortcut:</strong> If unsure,{" "}
            <strong>-어요</strong> is usually safe.
          </p>
        </NoteCard>
      ),
    },
    {
      title: '3) The "do" verb: 하다 → 해요',
      content: (
        <NoteCard>
          <SectionTitle>3) The "do" verb: 하다 &rarr; 해요</SectionTitle>
          <div className="mb-2">
            <Pill>
              <strong>하다</strong> &rarr; <strong>해요</strong> (special
              contraction)
            </Pill>
          </div>
          <KTable
            headers={["Dictionary", "Present", "Meaning"]}
            rows={[
              ["<strong>하다</strong>", "<strong>해요</strong>", "do"],
              ["<strong>공부하다</strong>", "<strong>공부해요</strong>", "study"],
              ["<strong>일하다</strong>", "<strong>일해요</strong>", "work"],
            ]}
          />
        </NoteCard>
      ),
    },
    {
      title: "4) Past polite: -았어요 / -었어요 / -했어요",
      content: (
        <NoteCard>
          <SectionTitle>4) Past polite: -았어요 / -었어요 / -했어요</SectionTitle>
          <p className="text-sm">
            Same vowel rule as present (ㅏ/ㅗ &rarr; 았어요, others &rarr; 었어요).
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Pill>
              <strong>ㅏ or ㅗ</strong> &rarr; <strong>-았어요</strong>
            </Pill>
            <Pill>
              <strong>others</strong> &rarr; <strong>-었어요</strong>
            </Pill>
            <Pill>
              <strong>하다</strong> &rarr; <strong>했어요</strong>
            </Pill>
          </div>
          <KTable
            headers={["Dictionary", "Past"]}
            rows={[
              ["<strong>가다</strong>", "<strong>갔어요</strong>"],
              ["<strong>보다</strong>", "<strong>봤어요</strong>"],
              ["<strong>먹다</strong>", "<strong>먹었어요</strong>"],
              ["<strong>마시다</strong>", "<strong>마셨어요</strong>"],
              ["<strong>공부하다</strong>", "<strong>공부했어요</strong>"],
            ]}
          />
        </NoteCard>
      ),
    },
    {
      title: '5) "I\'m doing": -고 있어요',
      content: (
        <NoteCard>
          <SectionTitle>5) "I'm doing": -고 있어요</SectionTitle>
          <p className="text-sm">Use for actions happening now / ongoing.</p>
          <KTable
            headers={["Meaning", "Example"]}
            rows={[
              ["I'm studying", "<strong>공부하고 있어요.</strong>"],
              ["I'm eating", "<strong>먹고 있어요.</strong>"],
              ["I'm going", "<strong>가고 있어요.</strong>"],
            ]}
          />
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            Pattern: stem + 고 있어요
          </p>
        </NoteCard>
      ),
    },
    {
      title: "6) Mini drills",
      content: (
        <NoteCard>
          <SectionTitle>6) Mini drills (30 seconds)</SectionTitle>
          <DrillList
            items={[
              { q: "먹다 → (present) ______", a: "→ 먹어요" },
              { q: "가다 → (past) ______", a: "→ 갔어요" },
              { q: "하다 → (present) ______", a: "→ 해요" },
              { q: "보다 → (present) ______", a: "→ 봐요" },
              { q: "공부하다 → (ongoing) ______", a: "→ 공부하고 있어요" },
            ]}
          />
          <Keyline>
            You now can build: present / past / ongoing sentences.
          </Keyline>
        </NoteCard>
      ),
    },
    {
      title: "7) Common A1 contractions",
      content: (
        <NoteCard>
          <SectionTitle>7) Common A1 contractions (recognize fast)</SectionTitle>
          <div className="flex flex-wrap gap-1">
            <Pill>
              보 + 아요 &rarr; <strong>봐요</strong>
            </Pill>
            <Pill>
              오 + 아요 &rarr; <strong>와요</strong>
            </Pill>
            <Pill>
              주 + 어요 &rarr; <strong>줘요</strong>
            </Pill>
            <Pill>
              마시 + 어요 &rarr; <strong>마셔요</strong>
            </Pill>
            <Pill>
              하 + 여요 &rarr; <strong>해요</strong>
            </Pill>
          </div>
          <p className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            Don't memorize every rule now — just recognize these patterns when
            you see/hear them.
          </p>
        </NoteCard>
      ),
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  All sheets                                                         */
/* ------------------------------------------------------------------ */

const allSheets: NoteSheet[] = [
  batchimSheet,
  particlesSheet,
  sentencePatternsSheet,
  verbEndingsSheet,
];

/* ------------------------------------------------------------------ */
/*  Accordion wrapper                                                  */
/* ------------------------------------------------------------------ */

function SheetAccordion({ sheet }: { sheet: NoteSheet }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-hanji-300 bg-white shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200">
          {sheet.icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{sheet.title}</div>
          <div className="text-xs text-hanji-500 dark:text-hanji-400">
            {sheet.sections.length} sections
          </div>
        </div>
        <ChevronDown
          className={
            "h-4 w-4 text-hanji-400 transition dark:text-hanji-500 " +
            (open ? "rotate-180" : "")
          }
        />
      </button>

      {open && (
        <div className="space-y-3 px-5 pb-5">
          {sheet.sections.map((s, i) => (
            <div key={i}>{s.content}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function KnowledgeBasePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Knowledge Base</h1>
        <p className="mt-1 text-sm text-hanji-500 dark:text-hanji-400">
          A1 grammar notes and cheat sheets — tap a topic to expand.
        </p>
      </div>

      {allSheets.map((sheet) => (
        <SheetAccordion key={sheet.id} sheet={sheet} />
      ))}
    </div>
  );
}
