import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./Accordion.tsx";

const meta: Meta<typeof Accordion> = {
  title: "Primitives/Accordion",
  component: Accordion,
  argTypes: {
    multiple: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

const faqItems = [
  {
    id: "what",
    title: "What is this app?",
    content: "A Korean language learning app designed for A1–A2 learners, featuring flashcards, particle games, and sentence building exercises.",
  },
  {
    id: "how",
    title: "How does spaced repetition work?",
    content: "The app tracks which words you struggle with and shows them more frequently. Words you know well appear less often, optimizing your study time.",
  },
  {
    id: "streak",
    title: "What happens if I lose my streak?",
    content: "Your streak counter resets to zero, but your XP and level progress are never lost. Streaks are just a motivational tool.",
  },
  {
    id: "offline",
    title: "Can I use the app offline?",
    content: "In demo mode, all content is bundled locally. In live mode, you need an internet connection to sync progress.",
  },
];

export const Default: Story = {
  args: {
    items: faqItems,
  },
};

export const DefaultOpen: Story = {
  args: {
    items: faqItems,
    defaultOpen: ["what"],
  },
};

export const Multiple: Story = {
  args: {
    items: faqItems,
    multiple: true,
    defaultOpen: ["what", "how"],
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-namsaek-500">Small</p>
        <Accordion items={faqItems.slice(0, 2)} size="sm" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-namsaek-500">Medium</p>
        <Accordion items={faqItems.slice(0, 2)} size="md" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-namsaek-500">Large</p>
        <Accordion items={faqItems.slice(0, 2)} size="lg" />
      </div>
    </div>
  ),
};

export const LessonEditor: Story = {
  name: "Lesson Editor Use Case",
  args: {
    multiple: true,
    defaultOpen: ["basics"],
    items: [
      {
        id: "basics",
        title: "Basic Info",
        content: "Lesson title, level, category, and description fields would go here.",
      },
      {
        id: "vocabulary",
        title: "Vocabulary (12 words)",
        content: "A list of vocabulary words with Korean, English, and romanization.",
      },
      {
        id: "examples",
        title: "Example Sentences (5)",
        content: "Example sentences with breakdowns and translations.",
      },
      {
        id: "grammar",
        title: "Grammar Notes (3)",
        content: "Explanation blocks for grammar patterns covered in this lesson.",
      },
      {
        id: "exercises",
        title: "Exercises Configuration",
        content: "Game type selection, difficulty, and time limit settings.",
      },
    ],
  },
};
