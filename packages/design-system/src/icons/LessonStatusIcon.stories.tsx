import type { Meta, StoryObj } from '@storybook/react-vite';
import { LessonStatusIcon } from './LessonStatusIcon.tsx';

const meta: Meta<typeof LessonStatusIcon> = {
  title: 'Icons/LessonStatusIcon',
  component: LessonStatusIcon,
  argTypes: {
    status: { control: 'select', options: ['done', 'in_progress', 'locked'] },
  },
};
export default meta;

type Story = StoryObj<typeof LessonStatusIcon>;

export const Done: Story = { args: { status: 'done' } };
export const InProgress: Story = { args: { status: 'in_progress' } };
export const Locked: Story = { args: { status: 'locked' } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <LessonStatusIcon status="done" /> Done
      </div>
      <div className="flex items-center gap-1.5">
        <LessonStatusIcon status="in_progress" /> In Progress
      </div>
      <div className="flex items-center gap-1.5">
        <LessonStatusIcon status="locked" /> Locked
      </div>
    </div>
  ),
};
