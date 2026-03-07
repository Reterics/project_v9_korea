import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge.tsx';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'danger', 'warning'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'A1 Level' } };
export const Success: Story = { args: { variant: 'success', children: 'Mastered' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Weak Area' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Review' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
};
