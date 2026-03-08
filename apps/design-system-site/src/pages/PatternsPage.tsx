import {
  PageHeader,
  Card,
  Badge,
  StatChip,
  SectionHeader,
  LessonCard,
  ActivityCard,
  ProgressCard,
  MagpieTip,
} from "@reterics/birdie-ui";
import { ShowcaseCard } from "../components/ShowcaseCard.tsx";
import {
  Star,
  Flame,
  Coins,
  BookOpen,
  Headphones,
  MessageCircle,
  Home,
  BarChart3,
  User,
} from "lucide-react";

function DashboardPattern() {
  return (
    <ShowcaseCard
      title="Dashboard Layout"
      description="The main hub learners see after opening the app."
    >
      <div className="space-y-5 rounded-2xl border border-hanji-200 bg-hanji-50 p-4 dark:border-namsaek-800 dark:bg-namsaek-900/50">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <StatChip
            icon={<Star className="h-4 w-4 text-geum-500" />}
            label="XP"
            value="1,250"
          />
          <StatChip
            icon={<Flame className="h-4 w-4 text-dancheong-500" />}
            label="Streak"
            value="7"
          />
          <StatChip
            icon={<Coins className="h-4 w-4 text-geum-400" />}
            label="Coins"
            value="340"
          />
        </div>

        {/* Lesson section */}
        <div>
          <SectionHeader
            title="Continue Learning"
            subtitle="Pick up where you left off"
          />
          <div className="mt-3">
            <LessonCard
              title="Basic Greetings"
              summary="Learn 안녕하세요 and common phrases"
              status="in_progress"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Progress */}
        <ProgressCard
          title="Vocabulary"
          tiles={Array.from({ length: 20 }, (_, i) => ({
            id: String(i),
            score: i < 12 ? 0.5 + Math.random() * 0.5 : Math.random() * 0.3,
          }))}
        />
      </div>
    </ShowcaseCard>
  );
}

function LessonGridPattern() {
  return (
    <ShowcaseCard
      title="Lesson Grid"
      description="Browse available lessons organized by level."
    >
      <div className="space-y-3">
        <SectionHeader
          title="A1 — Beginner"
          subtitle="Foundation lessons"
          right={<Badge variant="success">4 / 6 completed</Badge>}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <LessonCard
            title="Basic Greetings"
            summary="안녕하세요, 감사합니다"
            status="done"
          />
          <LessonCard
            title="Numbers 1-10"
            summary="하나, 둘, 셋..."
            status="done"
          />
          <LessonCard
            title="Self Introduction"
            summary="이름, 나이, 직업"
            status="in_progress"
            onClick={() => {}}
          />
          <LessonCard
            title="Daily Routines"
            summary="아침, 점심, 저녁"
            status="locked"
          />
        </div>
      </div>
    </ShowcaseCard>
  );
}

function ActivityPattern() {
  return (
    <ShowcaseCard
      title="Activity Selection"
      description="Choose a practice activity for the current lesson."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <ActivityCard
          icon={<BookOpen className="h-5 w-5" />}
          title="Flashcards"
          description="Review vocabulary with spaced repetition."
          meta="5 min"
          onClick={() => {}}
        />
        <ActivityCard
          icon={<Headphones className="h-5 w-5" />}
          title="Listening"
          description="Hear native pronunciation and match meanings."
          meta="5 min"
          onClick={() => {}}
        />
        <ActivityCard
          icon={<MessageCircle className="h-5 w-5" />}
          title="Conversation"
          description="Practice dialogues with common phrases."
          meta="8 min"
          available={false}
        />
      </div>
    </ShowcaseCard>
  );
}

function MobileNavPattern() {
  return (
    <ShowcaseCard
      title="Mobile Navigation"
      description="Bottom navigation bar for mobile users."
    >
      <div className="mx-auto max-w-sm">
        <div className="flex items-center justify-around rounded-2xl border border-hanji-200 bg-white px-2 py-3 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: BookOpen, label: "Learn", active: false },
            { icon: BarChart3, label: "Stats", active: false },
            { icon: User, label: "Profile", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={
                "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition " +
                (active
                  ? "text-namsaek-600 dark:text-hanji-100"
                  : "text-hanji-400 dark:text-hanji-500")
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </ShowcaseCard>
  );
}

function FeedbackPattern() {
  return (
    <ShowcaseCard
      title="Feedback Patterns"
      description="How the system communicates success, progress, and errors."
    >
      <div className="space-y-3">
        <Card className="border-cheongja-200 bg-cheongja-50/50 dark:border-cheongja-800 dark:bg-cheongja-900/20">
          <div className="flex items-center gap-2">
            <Badge variant="success">Correct!</Badge>
            <span className="text-sm text-cheongja-700 dark:text-cheongja-300">
              안녕하세요 means &quot;Hello&quot;
            </span>
          </div>
        </Card>
        <Card className="border-dancheong-200 bg-dancheong-50/50 dark:border-dancheong-800 dark:bg-dancheong-900/20">
          <div className="flex items-center gap-2">
            <Badge variant="danger">Try again</Badge>
            <span className="text-sm text-dancheong-700 dark:text-dancheong-300">
              The correct answer was &quot;Thank you&quot;
            </span>
          </div>
        </Card>
        <Card className="border-geum-200 bg-geum-50/50 dark:border-geum-800 dark:bg-geum-900/20">
          <div className="flex items-center gap-2">
            <Badge variant="warning">+25 XP</Badge>
            <span className="text-sm text-geum-700 dark:text-geum-300">
              Lesson completed! Keep your streak going.
            </span>
          </div>
        </Card>
      </div>
    </ShowcaseCard>
  );
}

export function PatternsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Patterns"
        description="Real product screen compositions built from Birdie components."
      />

      <DashboardPattern />
      <LessonGridPattern />
      <ActivityPattern />
      <FeedbackPattern />
      <MobileNavPattern />

      <MagpieTip>
        Patterns combine primitives and product components to create full
        screens. They demonstrate how components work together in real context.
      </MagpieTip>
    </div>
  );
}
