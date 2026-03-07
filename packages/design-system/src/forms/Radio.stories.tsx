import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio.tsx';

const meta: Meta<typeof Radio> = {
  title: 'Forms/Radio',
  component: Radio,
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: 'Korean to English',
    name: 'direction',
  },
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Radio name="direction" label="Korean to English" defaultChecked />
      <Radio name="direction" label="English to Korean" />
      <Radio name="direction" label="Both directions" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Radio name="mode" label="Easy" defaultChecked disabled />
      <Radio name="mode" label="Hard" disabled />
    </div>
  ),
};
