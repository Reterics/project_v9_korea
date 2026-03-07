import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox.tsx';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Include audio hints',
  },
};

export const Checked: Story = {
  args: {
    label: 'Include audio hints',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Include audio hints',
    disabled: true,
  },
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox label="Vocabulary" defaultChecked />
      <Checkbox label="Grammar" defaultChecked />
      <Checkbox label="Listening" />
      <Checkbox label="Writing" />
    </div>
  ),
};
