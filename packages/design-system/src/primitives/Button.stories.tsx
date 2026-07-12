import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from './Button.tsx';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger', 'nav-active', 'nav-inactive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
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

export const Outline: Story = {
  args: { variant: 'outline', children: 'Cancel' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Clear All Local Data' },
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

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium (default)</Button>
      <Button variant="outline" size="sm">Small Outline</Button>
      <Button variant="outline" size="md">Medium Outline</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    variant: "outline",
    size: "sm"
  },

  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="primary"
        leftIcon={<Plus aria-hidden="true" className="-mr-1" size={16} />}
      >
        Create
      </Button>
      <Button
        variant="outline"
        rightIcon={<ChevronRight aria-hidden="true" size={16} />}
      >
        Continue
      </Button>
      <Button
        variant="secondary"
        leftIcon={<ChevronLeft aria-hidden="true" size={16} />}
        rightIcon={<ChevronRight aria-hidden="true" size={16} />}
      >
        Navigate
      </Button>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus aria-hidden="true" className="-mr-1" size={14} />}
      >
        Small
      </Button>
      <Button
        variant="outline"
        size="sm"
        rightIcon={<ChevronRight aria-hidden="true" size={14} />}
      >
        Small
      </Button>
    </div>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="nav-active">Nav Active</Button>
      <Button variant="nav-inactive">Nav Inactive</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
  ),
};
