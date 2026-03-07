import type { Meta, StoryObj } from '@storybook/react-vite';
import { Topbar } from './Topbar.tsx';
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
};
export default meta;

type Story = StoryObj<typeof Topbar>;

export const Default: Story = {
  args: {
    logo: <BrandLogo size={26} />,
    onMenuClick: () => alert('Menu clicked'),
    actions: <Avatar />,
  },
};

export const NoMenu: Story = {
  args: {
    logo: <BrandLogo size={26} />,
    actions: <Avatar />,
  },
};
