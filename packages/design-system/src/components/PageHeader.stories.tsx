import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader.tsx';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Dashboard',
    description: 'Overview of your Korean learning progress',
  },
};

export const WithActions: Story = {
  args: {
    title: 'Vocabulary',
    description: 'Manage your word lists',
    actions: (
      <button className="rounded-xl bg-namsaek-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-namsaek-600 transition">
        Add Words
      </button>
    ),
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Settings',
  },
};
