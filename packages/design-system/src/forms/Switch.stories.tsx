import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './Switch.tsx';

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Off: Story = {
  args: {
    label: 'Dark mode',
    checked: false,
  },
};

export const On: Story = {
  args: {
    label: 'Dark mode',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Dark mode',
    disabled: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return <Switch label="Sound effects" checked={on} onChange={setOn} />;
  },
};
