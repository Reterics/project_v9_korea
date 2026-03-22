import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState.tsx";
import { Button } from "./Button.tsx";

const meta: Meta<typeof EmptyState> = {
  title: "Primitives/EmptyState",
  component: EmptyState,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    title: { control: "text" },
    description: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No items found",
    description: "Try adjusting your search or filters.",
  },
};

export const WithAction: Story = {
  args: {
    title: "No lessons yet",
    description: "Create your first lesson to get started.",
    action: <Button>Create Lesson</Button>,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 divide-y divide-hanji-200 dark:divide-namsaek-700">
      <EmptyState size="sm" title="Small empty state" description="Compact variant for inline use." />
      <EmptyState size="md" title="Medium empty state" description="Default size for most contexts." />
      <EmptyState size="lg" title="Large empty state" description="Use for full-page empty states." />
    </div>
  ),
};

export const CustomIcon: Story = {
  name: "Custom Icon",
  args: {
    icon: (
      <svg
        className="h-10 w-10 text-geum-400 dark:text-geum-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "No achievements yet",
    description: "Complete lessons and games to earn your first achievement.",
    action: <Button>Browse Lessons</Button>,
  },
};

export const NoProgress: Story = {
  name: "No Progress Data",
  args: {
    icon: (
      <svg
        className="h-10 w-10 text-cheongja-400 dark:text-cheongja-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "No practice sessions",
    description: "Start a game to begin tracking your progress.",
    action: <Button variant="outline">Start Practicing</Button>,
  },
};

export const SearchNoResults: Story = {
  name: "Search — No Results",
  args: {
    icon: (
      <svg
        className="h-10 w-10 text-hanji-400 dark:text-namsaek-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: "No matching words",
    description: "No results for your search. Try a different term.",
    size: "sm",
  },
};
