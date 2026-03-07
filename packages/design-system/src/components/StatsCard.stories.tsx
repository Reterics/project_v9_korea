import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatsCard } from './StatsCard.tsx';

const FlameIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const meta: Meta<typeof StatsCard> = {
  title: 'Components/StatsCard',
  component: StatsCard,
};
export default meta;

type Story = StoryObj<typeof StatsCard>;

export const Default: Story = {
  args: {
    label: 'Words Learned',
    value: 342,
    change: '+12 this week',
    icon: <StarIcon />,
  },
};

export const Success: Story = {
  args: {
    label: 'Current Streak',
    value: '7 days',
    change: '+2 days',
    variant: 'success',
    icon: <FlameIcon />,
  },
};

export const Warning: Story = {
  args: {
    label: 'XP Today',
    value: 15,
    change: '↓ 5 vs yesterday',
    variant: 'warning',
    icon: <StarIcon />,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard label="Words Learned" value={342} change="+12 this week" icon={<StarIcon />} />
      <StatsCard label="Current Streak" value="7 days" change="+2 days" variant="success" icon={<FlameIcon />} />
      <StatsCard label="XP Today" value={15} change="↓ 5 vs yesterday" variant="warning" icon={<StarIcon />} />
      <StatsCard label="Weak Areas" value={3} variant="danger" icon={<FlameIcon />} />
    </div>
  ),
};
