import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressCard } from './ProgressCard.tsx';

const meta: Meta<typeof ProgressCard> = {
  title: 'Components/ProgressCard',
  component: ProgressCard,
};
export default meta;

type Story = StoryObj<typeof ProgressCard>;

const sampleTiles = Array.from({ length: 30 }, (_, i) => ({
  id: `word-${i}`,
  score: i < 8 ? 0.9 : i < 15 ? 0.6 : i < 22 ? 0.2 : 0,
}));

export const Default: Story = {
  args: {
    tiles: sampleTiles,
  },
};

export const AllNew: Story = {
  args: {
    tiles: sampleTiles.map((t) => ({ ...t, score: 0 })),
  },
};

export const AllMastered: Story = {
  args: {
    tiles: sampleTiles.map((t) => ({ ...t, score: 1 })),
  },
};
