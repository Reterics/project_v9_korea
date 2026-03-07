import type { Meta, StoryObj } from '@storybook/react-vite';
import { GraduationCap } from 'lucide-react';
import { LessonCard } from './LessonCard.tsx';

const meta: Meta<typeof LessonCard> = {
  title: 'Components/LessonCard',
  component: LessonCard,
  argTypes: {
    status: { control: 'select', options: ['done', 'in_progress', 'locked'] },
  },
};
export default meta;

type Story = StoryObj<typeof LessonCard>;

export const InProgress: Story = {
  args: {
    title: 'Topic & Subject Markers',
    summary: 'Learn when to use 은/는 and 이/가 in Korean sentences.',
    status: 'in_progress',
    icon: <GraduationCap className="h-4 w-4 text-namsaek-500" />,
    onClick: () => {},
    secondaryAction: { label: 'Practice', onClick: () => {} },
  },
};

export const Done: Story = {
  args: {
    title: 'Basic Greetings',
    summary: 'Common greetings and introductions.',
    status: 'done',
    onClick: () => {},
  },
};

export const Locked: Story = {
  args: {
    title: 'Object Markers',
    summary: 'Learn 을/를 for marking objects.',
    status: 'locked',
  },
};
