import { useState } from "react";
import {
  PageHeader,
  Tabs,
  Card,
  Button,
  Badge,
  StatChip,
  MagpieTip,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  LessonCard,
  ActivityCard,
  ProgressCard,
  SectionHeader,
  ProgressDots,
  FeedbackToast,
  ChoiceGrid,
  PromptCard,
} from "@reterics/birdie-ui";
import { ShowcaseCard } from "../components/ShowcaseCard.tsx";
import {
  Star,
  Flame,
  Coins,
  BookOpen,
  Headphones,
  PenTool,
} from "lucide-react";

const tabs = [
  { id: "primitives", label: "Primitives" },
  { id: "forms", label: "Forms" },
  { id: "product", label: "Product" },
  { id: "game", label: "Game UI" },
];

function PrimitivesSection() {
  return (
    <div className="space-y-6">
      <ShowcaseCard title="Button" description="Primary action trigger.">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Badge" description="Status and category labels.">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Card" description="Content container with optional hover effect.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <p className="text-sm text-hanji-600 dark:text-hanji-300">
              Standard card with padding, border, and shadow.
            </p>
          </Card>
          <Card hoverable>
            <p className="text-sm text-hanji-600 dark:text-hanji-300">
              Hoverable card — lifts on hover.
            </p>
          </Card>
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        title="StatChip"
        description="Compact stat display with icon."
      >
        <div className="flex flex-wrap gap-3">
          <StatChip
            icon={<Star className="h-4 w-4 text-geum-500" />}
            label="XP"
            value="1,250"
          />
          <StatChip
            icon={<Flame className="h-4 w-4 text-dancheong-500" />}
            label="Streak"
            value="7 days"
          />
          <StatChip
            icon={<Coins className="h-4 w-4 text-geum-400" />}
            label="Coins"
            value="340"
          />
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="SectionHeader" description="Section title with optional action.">
        <SectionHeader
          title="Today's Activities"
          subtitle="3 activities available"
          right={<Button variant="secondary">View all</Button>}
        />
      </ShowcaseCard>
    </div>
  );
}

function FormsSection() {
  const [switchVal, setSwitchVal] = useState(true);
  const [checkVal, setCheckVal] = useState(true);
  const [radioVal, setRadioVal] = useState("a");

  return (
    <div className="space-y-6">
      <ShowcaseCard title="Input" description="Text input with error state.">
        <div className="space-y-3 max-w-sm">
          <Input placeholder="Enter your name..." />
          <Input placeholder="Error state" error />
          <Input placeholder="Disabled" disabled />
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Textarea" description="Multi-line text input.">
        <Textarea placeholder="Write something..." className="max-w-sm" />
      </ShowcaseCard>

      <ShowcaseCard title="Select" description="Dropdown selection.">
        <Select className="max-w-sm">
          <option>Choose a topic...</option>
          <option>Greetings</option>
          <option>Numbers</option>
          <option>Food</option>
        </Select>
      </ShowcaseCard>

      <ShowcaseCard title="Toggle Controls" description="Checkbox, radio, and switch.">
        <div className="space-y-4">
          <Checkbox
            label="Enable notifications"
            checked={checkVal}
            onChange={(e) => setCheckVal(e.target.checked)}
          />
          <div className="flex gap-4">
            <Radio
              label="Option A"
              name="demo"
              checked={radioVal === "a"}
              onChange={() => setRadioVal("a")}
            />
            <Radio
              label="Option B"
              name="demo"
              checked={radioVal === "b"}
              onChange={() => setRadioVal("b")}
            />
          </div>
          <Switch
            label="Dark mode"
            checked={switchVal}
            onChange={setSwitchVal}
          />
        </div>
      </ShowcaseCard>
    </div>
  );
}

function ProductSection() {
  return (
    <div className="space-y-6">
      <ShowcaseCard
        title="LessonCard"
        description="Displays a lesson with status and action."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <LessonCard
            title="Basic Greetings"
            summary="Learn 안녕하세요 and common phrases"
            status="in_progress"
            onClick={() => {}}
          />
          <LessonCard
            title="Numbers 1-10"
            summary="Count from 하나 to 열"
            status="done"
          />
          <LessonCard
            title="Colors"
            summary="Learn Korean color words"
            status="locked"
          />
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        title="ActivityCard"
        description="Interactive activity with icon and description."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <ActivityCard
            icon={<Headphones className="h-5 w-5" />}
            title="Listening"
            description="Train your ear with native audio."
            meta="5 min"
            onClick={() => {}}
          />
          <ActivityCard
            icon={<PenTool className="h-5 w-5" />}
            title="Writing"
            description="Practice Hangul characters."
            meta="10 min"
            available={false}
          />
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        title="ProgressCard"
        description="Vocabulary mastery heatmap."
      >
        <ProgressCard
          title="Greetings"
          tiles={Array.from({ length: 30 }, (_, i) => ({
            id: String(i),
            score: Math.random(),
          }))}
          className="max-w-sm"
        />
      </ShowcaseCard>
    </div>
  );
}

function GameSection() {
  const [showToast, setShowToast] = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <ShowcaseCard
        title="PromptCard"
        description="Displays the question in a game round."
      >
        <PromptCard
          text="안녕하세요"
          subtitle="What does this mean?"
          rightSlot={
            <Badge variant="warning">
              <BookOpen className="mr-1 inline h-3 w-3" /> Hint
            </Badge>
          }
        />
      </ShowcaseCard>

      <ShowcaseCard
        title="ChoiceGrid"
        description="2x2 answer grid for multiple choice."
      >
        <ChoiceGrid
          choices={[
            { label: "Hello", value: "hello", variant: selected === "hello" ? "success" : "default" },
            { label: "Goodbye", value: "goodbye", variant: selected === "goodbye" ? "danger" : "default" },
            { label: "Thank you", value: "thanks", variant: selected === "thanks" ? "danger" : "default" },
            { label: "Sorry", value: "sorry", variant: selected === "sorry" ? "danger" : "default" },
          ]}
          onSelect={(val) => setSelected(val)}
          disabled={selected !== null}
        />
      </ShowcaseCard>

      <ShowcaseCard
        title="ProgressDots"
        description="Shows progress through a game session."
      >
        <ProgressDots total={8} current={5} />
      </ShowcaseCard>

      <ShowcaseCard
        title="FeedbackToast"
        description="Animated correct/wrong feedback."
      >
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => setShowToast("correct")}
          >
            Show correct
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowToast("wrong")}
          >
            Show wrong
          </Button>
        </div>
        <FeedbackToast type={showToast} durationMs={1500} />
      </ShowcaseCard>

      <MagpieTip>
        Game components use <span className="font-semibold">framer-motion</span>{" "}
        for smooth animations. The{" "}
        <span className="font-semibold">ChoiceGrid</span> highlights correct and
        wrong answers with <span className="font-semibold">cheongja</span> and{" "}
        <span className="font-semibold">dancheong</span> colors.
      </MagpieTip>
    </div>
  );
}

export function ComponentsPage() {
  const [activeTab, setActiveTab] = useState("primitives");

  const content: Record<string, React.ReactNode> = {
    primitives: <PrimitivesSection />,
    forms: <FormsSection />,
    product: <ProductSection />,
    game: <GameSection />,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Components"
        description="Reusable building blocks from @reterics/birdie-ui."
      />
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div>{content[activeTab]}</div>

      <MagpieTip title="Storybook">
        For full prop documentation and interactive playground, visit{" "}
        <span className="font-semibold">Storybook</span>. This page shows
        curated, real-world examples.
      </MagpieTip>
    </div>
  );
}
