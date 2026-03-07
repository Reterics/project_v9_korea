import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BottomNav } from './BottomNav.tsx';
import { BottomNavItem } from './BottomNavItem.tsx';

const HomeIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);
const BookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
  </svg>
);
const SearchIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);
const ChartIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m7 11 4-4 4 4 5-5" />
  </svg>
);
const GearIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const meta: Meta<typeof BottomNav> = {
  title: 'Navigation/BottomNav',
  component: BottomNav,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('hub');
    return (
      <div className="flex h-[667px] w-[375px] flex-col overflow-hidden rounded-2xl border border-hanji-300 bg-hanji-100 dark:border-namsaek-700 dark:bg-namsaek-950">
        <div className="flex-1 p-4">
          <p className="text-sm text-namsaek-600 dark:text-hanji-300">
            Active: <strong>{active}</strong>
          </p>
          <p className="mt-2 text-xs text-namsaek-400 dark:text-hanji-400">
            Simulated 375x667 mobile viewport. Tap the nav items below.
          </p>
        </div>

        <BottomNav>
          <BottomNavItem icon={<HomeIcon />} label="Hub" active={active === 'hub'} onClick={() => setActive('hub')} />
          <BottomNavItem icon={<BookIcon />} label="Hangeul" active={active === 'hangeul'} onClick={() => setActive('hangeul')} />
          <BottomNavItem icon={<ChartIcon />} label="Grammar" active={active === 'grammar'} onClick={() => setActive('grammar')} />
          <BottomNavItem icon={<SearchIcon />} label="Dictionary" active={active === 'dictionary'} onClick={() => setActive('dictionary')} />
          <BottomNavItem icon={<GearIcon />} label="Settings" active={active === 'settings'} onClick={() => setActive('settings')} />
        </BottomNav>
      </div>
    );
  },
};

export const ThreeItems: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return (
      <div className="flex h-[667px] w-[375px] flex-col overflow-hidden rounded-2xl border border-hanji-300 bg-hanji-100 dark:border-namsaek-700 dark:bg-namsaek-950">
        <div className="flex-1 p-4 text-sm text-namsaek-600 dark:text-hanji-300">
          Three-item layout
        </div>
        <BottomNav>
          <BottomNavItem icon={<HomeIcon />} label="Home" active={active === 'home'} onClick={() => setActive('home')} />
          <BottomNavItem icon={<SearchIcon />} label="Search" active={active === 'search'} onClick={() => setActive('search')} />
          <BottomNavItem icon={<GearIcon />} label="Settings" active={active === 'settings'} onClick={() => setActive('settings')} />
        </BottomNav>
      </div>
    );
  },
};
