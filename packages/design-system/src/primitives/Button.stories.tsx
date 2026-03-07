import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button.tsx';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'nav-active', 'nav-inactive'],
    },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Start Lesson' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Practice' },
};

export const NavActive: Story = {
  args: { variant: 'nav-active', children: 'Hub' },
};

export const NavInactive: Story = {
  args: { variant: 'nav-inactive', children: 'Grammar' },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Locked', disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="nav-active">Nav Active</Button>
      <Button variant="nav-inactive">Nav Inactive</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
  ),
};
