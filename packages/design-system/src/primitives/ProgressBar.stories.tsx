import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./ProgressBar.tsx";

const meta: Meta<typeof ProgressBar> = {
  title: "Primitives/ProgressBar",
  component: ProgressBar,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: "number" },
    variant: {
      control: "select",
      options: ["primary", "success", "danger", "warning"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    showLabel: { control: "boolean" },
    animated: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: { value: 60 },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ProgressBar value={70} variant="primary" />
      <ProgressBar value={85} variant="success" />
      <ProgressBar value={30} variant="danger" />
      <ProgressBar value={50} variant="warning" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ProgressBar value={60} size="sm" />
      <ProgressBar value={60} size="md" />
      <ProgressBar value={60} size="lg" />
    </div>
  ),
};

export const WithLabel: Story = {
  args: { value: 73, size: "lg", showLabel: true },
};

export const XPBar: Story = {
  name: "XP Bar (Game Use Case)",
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-namsaek-600 dark:text-hanji-400">
        <span className="font-medium">Level 5</span>
        <span>320 / 500 XP</span>
      </div>
      <ProgressBar value={320} max={500} variant="warning" size="lg" showLabel />
    </div>
  ),
};

export const LessonProgress: Story = {
  name: "Lesson Progress",
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-namsaek-700 dark:text-hanji-300">Greetings</span>
        <ProgressBar value={100} variant="success" size="sm" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-namsaek-700 dark:text-hanji-300">Numbers</span>
        <ProgressBar value={60} variant="primary" size="sm" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-namsaek-700 dark:text-hanji-300">Particles</span>
        <ProgressBar value={15} variant="danger" size="sm" />
      </div>
    </div>
  ),
};

export const Empty: Story = {
  args: { value: 0, size: "md" },
};

export const Full: Story = {
  args: { value: 100, variant: "success", size: "lg", showLabel: true },
};
