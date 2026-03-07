import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpen, Headphones, Layers, Target } from 'lucide-react';
import { ActivityCard } from './ActivityCard.tsx';

const meta: Meta<typeof ActivityCard> = {
  title: 'Components/ActivityCard',
  component: ActivityCard,
};
export default meta;

type Story = StoryObj<typeof ActivityCard>;

export const Available: Story = {
  args: {
    icon: <BookOpen className="h-5 w-5" />,
    title: 'Flashcards',
    description: 'Review words from your lessons with spaced repetition.',
    meta: '2-4 min',
    available: true,
  },
};

export const ComingSoon: Story = {
  args: {
    icon: <Headphones className="h-5 w-5" />,
    title: 'Listening',
    description: 'Hear a word, choose meaning, train sound recognition.',
    meta: '2-4 min',
    available: false,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <ActivityCard
        icon={<BookOpen className="h-5 w-5" />}
        title="Flashcards"
        description="Review words with spaced repetition."
        meta="2-4 min"
      />
      <ActivityCard
        icon={<Layers className="h-5 w-5" />}
        title="Sentence Builder"
        description="Put tokens in the right Korean sequence."
        meta="3-6 min"
      />
      <ActivityCard
        icon={<Target className="h-5 w-5" />}
        title="Particles"
        description="Fill markers in context."
        meta="2-5 min"
      />
      <ActivityCard
        icon={<Headphones className="h-5 w-5" />}
        title="Listening"
        description="Train sound recognition."
        meta="2-4 min"
        available={false}
      />
    </div>
  ),
};
