import type { Meta, StoryObj } from '@storybook/react-vite';
import { Keyboard } from 'lucide-react';
import { WeakAreaCard } from './WeakAreaCard.tsx';

const meta: Meta<typeof WeakAreaCard> = {
  title: 'Components/WeakAreaCard',
  component: WeakAreaCard,
};
export default meta;

type Story = StoryObj<typeof WeakAreaCard>;

export const Default: Story = {
  args: {
    weakArea: 'Particles',
    rows: [
      { label: 'Vocabulary', action: 'Review', hint: 'Core A1 words' },
      { label: 'Particles', action: 'Practice', hint: 'Topic & subject markers' },
      { label: 'Sentences', action: 'Build', hint: 'Word order drills' },
    ],
    tip: (
      <>
        <Keyboard className="h-4 w-4 shrink-0" />
        Tip: use <span className="font-semibold">1-4</span> to answer,{' '}
        <span className="font-semibold">Space</span> next.
      </>
    ),
  },
};

export const WithoutTip: Story = {
  args: {
    weakArea: 'Vocabulary',
    rows: [
      { label: 'Nouns', action: 'Review', hint: '12 words due' },
      { label: 'Verbs', action: 'Practice', hint: '5 words due' },
    ],
  },
};
