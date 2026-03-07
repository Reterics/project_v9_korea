import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from './Tabs.tsx';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const sampleTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'progress', label: 'Progress' },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('overview');
    return (
      <div>
        <Tabs tabs={sampleTabs} active={active} onChange={setActive} />
        <div className="mt-4 rounded-xl border border-hanji-300 bg-white p-4 text-sm text-namsaek-600 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-300">
          Content for: <strong>{active}</strong>
        </div>
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const BookIcon = () => (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></svg>
    );
    const ChartIcon = () => (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m7 11 4-4 4 4 5-5" /></svg>
    );
    const tabs = [
      { id: 'lessons', label: 'Lessons', icon: <BookIcon /> },
      { id: 'stats', label: 'Statistics', icon: <ChartIcon /> },
    ];
    const [active, setActive] = useState('lessons');
    return <Tabs tabs={tabs} active={active} onChange={setActive} />;
  },
};
