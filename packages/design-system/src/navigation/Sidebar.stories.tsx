import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './Sidebar.tsx';
import { NavigationItem } from './NavigationItem.tsx';
import { BrandLogo } from '../icons/BrandLogo.tsx';

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


const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <div className="flex h-[600px]">
      <Sidebar header={<BrandLogo size={26} />}>
        <NavigationItem label="Dashboard" icon={<HomeIcon />} active />
        <NavigationItem label="Lessons" icon={<BookIcon />} />
        <NavigationItem label="Progress" icon={<ChartIcon />} />
        <NavigationItem label="Settings" icon={<GearIcon />} />
      </Sidebar>
      <div className="flex-1 p-6 text-sm text-namsaek-400">
        Sidebar visible on lg+ breakpoint. Resize your browser to hide it.
      </div>
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div className="flex h-[600px]">
      <Sidebar header={<BrandLogo variant="icon" size={26} />} collapsed>
        <NavigationItem label="Dashboard" icon={<HomeIcon />} active collapsed />
        <NavigationItem label="Lessons" icon={<BookIcon />} collapsed />
        <NavigationItem label="Progress" icon={<ChartIcon />} collapsed />
        <NavigationItem label="Settings" icon={<GearIcon />} collapsed />
      </Sidebar>
      <div className="flex-1 p-6 text-sm text-namsaek-400">Collapsed sidebar.</div>
    </div>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <div className="flex h-[600px]">
      <Sidebar
        header={<BrandLogo size={26} />}
        footer={<NavigationItem label="Settings" icon={<GearIcon />} />}
      >
        <NavigationItem label="Dashboard" icon={<HomeIcon />} active />
        <NavigationItem label="Lessons" icon={<BookIcon />} />
        <NavigationItem label="Progress" icon={<ChartIcon />} />
      </Sidebar>
      <div className="flex-1 p-6 text-sm text-namsaek-400">Sidebar with footer.</div>
    </div>
  ),
};
