import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { Topbar } from './Topbar.tsx';
import { Drawer } from './Drawer.tsx';
import { NavigationItem } from './NavigationItem.tsx';
import { PageHeader } from '../components/PageHeader.tsx';
import { StatsCard } from '../components/StatsCard.tsx';
import { Tabs } from '../components/Tabs.tsx';
import { DataTable } from '../components/DataTable.tsx';
import { BrandLogo } from '../icons/BrandLogo.tsx';
import { CardSkeleton } from '../components/CardSkeleton.tsx';

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

const Avatar = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-namsaek-500 text-xs font-bold text-white">
    MS
  </div>
);

const meta: Meta = {
  title: 'Navigation/Responsive Shell',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

type NavDef = { id: string; label: string; icon: React.ReactNode };

const navItems: NavDef[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
  { id: 'lessons', label: 'Lessons', icon: <BookIcon /> },
  { id: 'progress', label: 'Progress', icon: <ChartIcon /> },
  { id: 'settings', label: 'Settings', icon: <GearIcon /> },
];

type VocabRow = { id: number; korean: string; english: string; level: string; mastery: number };

const vocabData: VocabRow[] = [
  { id: 1, korean: '안녕하세요', english: 'Hello', level: 'A1', mastery: 95 },
  { id: 2, korean: '감사합니다', english: 'Thank you', level: 'A1', mastery: 88 },
  { id: 3, korean: '미안합니다', english: 'Sorry', level: 'A1', mastery: 72 },
  { id: 4, korean: '사랑해요', english: 'I love you', level: 'A2', mastery: 60 },
  { id: 5, korean: '괜찮아요', english: "It's okay", level: 'A2', mastery: 45 },
];

const vocabColumns = [
  { key: 'korean', header: 'Korean' },
  { key: 'english', header: 'English' },
  { key: 'level', header: 'Level', className: 'w-20' },
  {
    key: 'mastery',
    header: 'Mastery',
    className: 'w-28',
    render: (row: VocabRow) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-hanji-200 dark:bg-namsaek-800">
          <div
            className={
              "h-full rounded-full " +
              (row.mastery >= 80 ? "bg-cheongja-500" : row.mastery >= 50 ? "bg-geum-500" : "bg-dancheong-500")
            }
            style={{ width: `${row.mastery}%` }}
          />
        </div>
        <span className="text-xs tabular-nums">{row.mastery}%</span>
      </div>
    ),
  },
];

function AppShellDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState('dashboard');
  const [tab, setTab] = useState('overview');

  const navContent = navItems.map((item) => (
    <NavigationItem
      key={item.id}
      icon={item.icon}
      label={item.label}
      active={active === item.id}
      onClick={() => {
        setActive(item.id);
        setDrawerOpen(false);
      }}
    />
  ));

  return (
    <div className="flex h-screen flex-col bg-hanji-50 dark:bg-namsaek-950">
      {/* Topbar — logo shows only on mobile (lg:hidden inside Topbar) */}
      <Topbar
        logo={<BrandLogo size={26} />}
        onMenuClick={() => setDrawerOpen(true)}
        actions={<Avatar />}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar — no header, logo lives in Topbar */}
        <Sidebar
          footer={
            <NavigationItem
              icon={<GearIcon />}
              label="Settings"
              active={active === 'settings'}
              onClick={() => setActive('settings')}
            />
          }
        >
          {navItems.filter((i) => i.id !== 'settings').map((item) => (
            <NavigationItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </Sidebar>

        {/* Mobile drawer */}
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          header={<BrandLogo size={26} />}
        >
          {navContent}
        </Drawer>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <PageHeader
              title={navItems.find((i) => i.id === active)?.label ?? ''}
              description="Overview of your Korean learning progress"
              actions={
                <button className="rounded-xl bg-namsaek-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-namsaek-600 cursor-pointer">
                  Start Lesson
                </button>
              }
            />

            {/* Stats row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard label="Words Learned" value={342} change="+12 this week" icon={<StarIcon />} />
              <StatsCard label="Current Streak" value="7 days" change="+2 days" variant="success" icon={<FlameIcon />} />
              <StatsCard label="XP Today" value={45} change="+15 vs yesterday" variant="warning" icon={<StarIcon />} />
              <StatsCard label="Weak Areas" value={3} variant="danger" icon={<FlameIcon />} />
            </div>

            {/* Tabs */}
            <Tabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'vocabulary', label: 'Vocabulary' },
                { id: 'grammar', label: 'Grammar' },
              ]}
              active={tab}
              onChange={setTab}
            />

            {/* Tab content */}
            {tab === 'overview' && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <CardSkeleton key={i} lines={i % 2 === 0 ? 3 : 4} />
                ))}
              </div>
            )}
            {tab === 'vocabulary' && (
              <DataTable<VocabRow>
                columns={vocabColumns}
                data={vocabData}
                keyField="id"
              />
            )}
            {tab === 'grammar' && (
              <div className="rounded-2xl border border-hanji-300 bg-white p-8 text-center text-sm text-namsaek-400 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-400">
                Grammar content goes here
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export const FullShell: Story = {
  render: () => <AppShellDemo />,
};
