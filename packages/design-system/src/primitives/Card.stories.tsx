import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card.tsx';
import { CardHeader } from './CardHeader.tsx';
import { Settings, Trash2 } from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'section'],
    },
    hoverable: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <div className="text-sm font-semibold">Card Title</div>
        <div className="mt-1 text-xs text-hanji-500">Card description text</div>
      </div>
    ),
  },
};

export const Section: Story = {
  args: {
    variant: 'section',
    children: (
      <div>
        <div className="text-sm font-semibold">Section Card</div>
        <div className="mt-1 text-xs text-hanji-500">Rounded-2xl, no shadow — used for settings/help page sections</div>
      </div>
    ),
  },
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: (
      <div>
        <div className="text-sm font-semibold">Hoverable Card</div>
        <div className="mt-1 text-xs text-hanji-500">Hover me for lift effect</div>
      </div>
    ),
  },
};

export const WithCardHeader: Story = {
  render: () => (
    <Card variant="section">
      <CardHeader icon={<Settings className="h-5 w-5" />} title="Display Name" />
      <div className="text-sm text-hanji-600">Section content goes here.</div>
    </Card>
  ),
};

export const BothVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Card>
        <CardHeader icon={<Settings className="h-5 w-5" />} title="Default (rounded-3xl + shadow)" />
        <div className="text-sm text-hanji-600">Used for hub page cards, lesson cards, grammar sections.</div>
      </Card>
      <Card variant="section">
        <CardHeader icon={<Trash2 className="h-5 w-5" />} title="Section (rounded-2xl, no shadow)" />
        <div className="text-sm text-hanji-600">Used for settings and help page inner sections.</div>
      </Card>
    </div>
  ),
};
