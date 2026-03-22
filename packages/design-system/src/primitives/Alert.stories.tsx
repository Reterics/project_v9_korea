import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert.tsx";

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    title: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    children: "Your session will expire in 5 minutes.",
  },
};

export const WithTitle: Story = {
  args: {
    variant: "warning",
    title: "Content not saved",
    children: "You have unsaved changes. Please save before leaving this page.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert variant="info">New lessons are available for your level.</Alert>
      <Alert variant="success">Lesson completed! You earned 50 XP.</Alert>
      <Alert variant="warning">Your streak will reset if you don't practice today.</Alert>
      <Alert variant="danger">Failed to save progress. Please try again.</Alert>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert size="sm">Small alert message.</Alert>
      <Alert size="md">Medium alert message.</Alert>
      <Alert size="lg">Large alert message.</Alert>
    </div>
  ),
};

export const AllVariantsWithTitle: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert variant="info" title="Tip">
        Use keyboard shortcuts 1-4 to select answers quickly.
      </Alert>
      <Alert variant="success" title="Level up!">
        You reached Level 3. New particles lessons are now unlocked.
      </Alert>
      <Alert variant="warning" title="Streak warning">
        Your 7-day streak will reset at midnight.
      </Alert>
      <Alert variant="danger" title="Connection lost">
        Unable to sync progress. Your data will be saved locally.
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  render: function DismissibleStory() {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert variant="info" title="Welcome back!" onDismiss={() => setVisible(false)}>
        You have 3 lessons to review today.
      </Alert>
    ) : (
      <button
        type="button"
        className="text-sm text-namsaek-500 underline"
        onClick={() => setVisible(true)}
      >
        Show alert again
      </button>
    );
  },
};
