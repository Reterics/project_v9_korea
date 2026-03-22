import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip.tsx";
import { Button } from "./Button.tsx";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    content: { control: "text" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[200px] items-center justify-center p-16">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: { content: "Edit lesson", placement: "top" },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  args: { content: "Save progress", placement: "bottom" },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Bottom tooltip</Button>
    </Tooltip>
  ),
};

export const Left: Story = {
  args: { content: "Go back", placement: "left" },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Left tooltip</Button>
    </Tooltip>
  ),
};

export const Right: Story = {
  args: { content: "Next lesson", placement: "right" },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Right tooltip</Button>
    </Tooltip>
  ),
};

export const AllPlacements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-12">
      <Tooltip content="Top tooltip" placement="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <Button variant="outline">Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <Button variant="outline">Right</Button>
      </Tooltip>
    </div>
  ),
};

export const OnIconButton: Story = {
  render: () => (
    <Tooltip content="Delete item" placement="top">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-dancheong-500 hover:bg-dancheong-50 dark:hover:bg-dancheong-900/30"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>
    </Tooltip>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <Tooltip content="Small tooltip" size="sm">
        <Button variant="outline">Small</Button>
      </Tooltip>
      <Tooltip content="Medium tooltip" size="md">
        <Button variant="outline">Medium</Button>
      </Tooltip>
      <Tooltip content="Large tooltip" size="lg">
        <Button variant="outline">Large</Button>
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip content="This is a longer tooltip message that explains something in detail" placement="top">
      <Button variant="outline">Long tooltip</Button>
    </Tooltip>
  ),
};
