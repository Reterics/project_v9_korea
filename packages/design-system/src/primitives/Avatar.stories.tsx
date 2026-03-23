import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar.tsx";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["primary", "success", "warning", "danger"] },
    initials: { control: "text" },
    src: { control: "text" },
    alt: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {},
};

export const WithInitials: Story = {
  args: { initials: "AR", variant: "primary" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" initials="XS" />
      <Avatar size="sm" initials="SM" />
      <Avatar size="md" initials="MD" />
      <Avatar size="lg" initials="LG" />
      <Avatar size="xl" initials="XL" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar variant="primary" initials="PR" />
      <Avatar variant="success" initials="SU" />
      <Avatar variant="warning" initials="WA" />
      <Avatar variant="danger" initials="DA" />
    </div>
  ),
};

export const FallbackIcon: Story = {
  name: "Fallback (No Initials)",
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm" />
      <Avatar size="md" />
      <Avatar size="lg" />
      <Avatar size="xl" variant="success" />
    </div>
  ),
};

export const BrokenImage: Story = {
  name: "Broken Image → Fallback",
  args: {
    src: "https://broken-url.example/avatar.jpg",
    initials: "AR",
    size: "lg",
  },
};

export const Leaderboard: Story = {
  name: "Leaderboard Use Case",
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { initials: "JK", name: "지훈", xp: 2450, variant: "warning" as const },
        { initials: "SM", name: "수민", xp: 2100, variant: "primary" as const },
        { initials: "AR", name: "Attila", xp: 1800, variant: "success" as const },
      ].map((user, i) => (
        <div key={user.name} className="flex items-center gap-3">
          <span className="w-5 text-right text-sm font-semibold text-namsaek-500 dark:text-hanji-400">
            {i + 1}
          </span>
          <Avatar size="sm" initials={user.initials} variant={user.variant} />
          <span className="flex-1 text-sm font-medium text-namsaek-800 dark:text-hanji-100">
            {user.name}
          </span>
          <span className="text-sm font-semibold text-geum-600 dark:text-geum-400">
            {user.xp} XP
          </span>
        </div>
      ))}
    </div>
  ),
};
