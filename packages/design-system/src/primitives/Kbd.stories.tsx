import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./Kbd.tsx";

const meta: Meta<typeof Kbd> = {
  title: "Primitives/Kbd",
  component: Kbd,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  args: { children: "Enter" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Kbd size="sm">Esc</Kbd>
      <Kbd size="md">Esc</Kbd>
      <Kbd size="lg">Esc</Kbd>
    </div>
  ),
};

export const SingleKeys: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>1</Kbd>
      <Kbd>2</Kbd>
      <Kbd>3</Kbd>
      <Kbd>4</Kbd>
      <Kbd>H</Kbd>
      <Kbd>S</Kbd>
      <Kbd>R</Kbd>
      <Kbd>Space</Kbd>
    </div>
  ),
};

export const Combinations: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5 text-sm text-namsaek-600 dark:text-hanji-400">
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>S</Kbd>
        <span className="ml-2">Save</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-namsaek-600 dark:text-hanji-400">
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>Z</Kbd>
        <span className="ml-2">Undo</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-namsaek-600 dark:text-hanji-400">
        <Kbd>Shift</Kbd>
        <span>+</span>
        <Kbd>Enter</Kbd>
        <span className="ml-2">Submit</span>
      </div>
    </div>
  ),
};

export const GameControls: Story = {
  name: "Game Controls Use Case",
  render: () => (
    <div className="rounded-2xl border border-hanji-300 bg-white p-4 dark:border-namsaek-700 dark:bg-namsaek-900">
      <p className="mb-3 text-sm font-semibold text-namsaek-800 dark:text-hanji-100">
        Keyboard shortcuts
      </p>
      <div className="flex flex-col gap-2">
        {[
          { keys: ["1", "2", "3", "4"], label: "Select answer" },
          { keys: ["Space"], label: "Continue" },
          { keys: ["H"], label: "Show hint" },
          { keys: ["S"], label: "Skip question" },
          { keys: ["R"], label: "Replay audio" },
        ].map(({ keys, label }) => (
          <div
            key={label}
            className="flex items-center justify-between text-sm text-namsaek-600 dark:text-hanji-400"
          >
            <span>{label}</span>
            <span className="flex items-center gap-1">
              {keys.map((k) => (
                <Kbd key={k} size="sm">{k}</Kbd>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const InlineText: Story = {
  name: "Inline with Text",
  render: () => (
    <p className="text-sm text-namsaek-600 dark:text-hanji-400">
      Press <Kbd size="sm">Space</Kbd> to continue or <Kbd size="sm">H</Kbd> for a hint.
    </p>
  ),
};
