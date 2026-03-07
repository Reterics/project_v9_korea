import type { Meta, StoryObj } from '@storybook/react-vite';
import { Topbar } from './Topbar.tsx';
import { TopbarMenu } from './TopbarMenu.tsx';
import { BrandLogo } from '../icons/BrandLogo.tsx';

const Avatar = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-namsaek-500 text-xs font-bold text-white">
    MS
  </div>
);

const meta: Meta<typeof Topbar> = {
  title: 'Navigation/Topbar',
  component: Topbar,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    navPosition: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Topbar>;

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', active: true },
  { id: 'lessons', label: 'Lessons' },
  {
    id: 'practice',
    label: 'Practice',
    children: [
      { id: 'listening', label: 'Listening' },
      { id: 'speaking', label: 'Speaking' },
      { id: 'writing', label: 'Writing' },
    ],
  },
  { id: 'progress', label: 'Progress' },
];

export const Default: Story = {
  args: {
    logo: <BrandLogo size={32} />,
    nav: <TopbarMenu items={menuItems} />,
    navPosition: 'center',
    onMenuClick: () => alert('Menu clicked'),
    actions: <Avatar />,
  },
};

export const NoMenu: Story = {
  args: {
    logo: <BrandLogo size={32} />,
    nav: <TopbarMenu items={menuItems} />,
    navPosition: 'center',
    actions: <Avatar />,
  },
};

export const CenterNav: Story = {
  args: {
    logo: <BrandLogo size={32} />,
    nav: <TopbarMenu items={menuItems} />,
    navPosition: 'center',
    onMenuClick: () => alert('Menu clicked'),
    actions: <Avatar />,
  },
};

export const RightNav: Story = {
  args: {
    logo: <BrandLogo size={32} />,
    nav: <TopbarMenu items={menuItems} />,
    navPosition: 'right',
    onMenuClick: () => alert('Menu clicked'),
    actions: <Avatar />,
  },
};

export const LeftNavIconLogo: Story = {
  args: {
    logo: <BrandLogo variant="icon" size={32} />,
    nav: <TopbarMenu items={menuItems} />,
    navPosition: 'left',
    onMenuClick: () => alert('Menu clicked'),
    actions: <Avatar />,
  },
};
