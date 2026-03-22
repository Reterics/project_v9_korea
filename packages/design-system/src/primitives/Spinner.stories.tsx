import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner.tsx";
import { Button } from "./Button.tsx";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: { control: "select", options: ["primary", "secondary", "current"] },
    label: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {},
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner variant="primary" />
      <Spinner variant="secondary" />
      <span className="text-dancheong-500">
        <Spinner variant="current" />
      </span>
      <span className="text-cheongja-500">
        <Spinner variant="current" />
      </span>
    </div>
  ),
};

export const InButton: Story = {
  name: "Inside a Button",
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>
        <span className="flex items-center gap-2">
          <Spinner size="sm" variant="current" />
          Saving...
        </span>
      </Button>
      <Button variant="outline" disabled>
        <span className="flex items-center gap-2">
          <Spinner size="sm" variant="current" />
          Loading...
        </span>
      </Button>
    </div>
  ),
};

export const FullPage: Story = {
  name: "Full Page Loading",
  render: () => (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-namsaek-500 dark:text-hanji-400">Loading lessons...</p>
    </div>
  ),
};
