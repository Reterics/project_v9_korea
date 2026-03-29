import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, KeyRound, Trash2, Brain } from 'lucide-react';
import { CardHeader } from './CardHeader.tsx';

const meta: Meta<typeof CardHeader> = {
  title: 'Primitives/CardHeader',
  component: CardHeader,
  argTypes: {
    title: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof CardHeader>;

export const WithIcon: Story = {
  args: {
    icon: <Settings className="h-5 w-5" />,
    title: 'Settings',
  },
};

export const NoIcon: Story = {
  args: {
    title: 'Section Title',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <CardHeader icon={<Settings className="h-5 w-5" />} title="Display Name" />
      <CardHeader icon={<KeyRound className="h-5 w-5" />} title="Change Password" />
      <CardHeader icon={<Trash2 className="h-5 w-5" />} title="Clear Local Data" />
      <CardHeader icon={<Brain className="h-5 w-5" />} title="How It Works" />
      <CardHeader title="No Icon Example" />
    </div>
  ),
};
