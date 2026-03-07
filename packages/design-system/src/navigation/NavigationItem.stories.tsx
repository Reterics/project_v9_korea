import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationItem } from './NavigationItem.tsx';

const BookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
  </svg>
);

const meta: Meta<typeof NavigationItem> = {
  title: 'Navigation/NavigationItem',
  component: NavigationItem,
};
export default meta;

type Story = StoryObj<typeof NavigationItem>;

export const Default: Story = {
  args: {
    label: 'Lessons',
    icon: <BookIcon />,
  },
};

export const Active: Story = {
  args: {
    label: 'Lessons',
    icon: <BookIcon />,
    active: true,
  },
};

export const Collapsed: Story = {
  args: {
    label: 'Lessons',
    icon: <BookIcon />,
    collapsed: true,
  },
};

export const NoIcon: Story = {
  args: {
    label: 'Lessons',
  },
};

export const List: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-1">
      <NavigationItem label="Dashboard" active icon={<BookIcon />} />
      <NavigationItem label="Lessons" icon={<BookIcon />} />
      <NavigationItem label="Vocabulary" icon={<BookIcon />} />
      <NavigationItem label="Progress" icon={<BookIcon />} />
      <NavigationItem label="Settings" icon={<BookIcon />} />
    </div>
  ),
};
