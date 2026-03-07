import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { InlineField } from './InlineField.tsx';
import { Switch } from './Switch.tsx';
import { Select } from './Select.tsx';

const meta: Meta<typeof InlineField> = {
  title: 'Forms/InlineField',
  component: InlineField,
};
export default meta;

type Story = StoryObj<typeof InlineField>;

export const WithSwitch: Story = {
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <InlineField label="Sound effects">
        <Switch checked={on} onChange={setOn} />
      </InlineField>
    );
  },
};

export const WithSelect: Story = {
  render: () => (
    <InlineField label="Quiz mode">
      <Select className="w-40">
        <option>Multiple choice</option>
        <option>Type answer</option>
      </Select>
    </InlineField>
  ),
};

export const Stacked: Story = {
  render: () => {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    return (
      <div className="flex flex-col gap-3">
        <InlineField label="Auto-play audio">
          <Switch checked={a} onChange={setA} />
        </InlineField>
        <InlineField label="Show romanization">
          <Switch checked={b} onChange={setB} />
        </InlineField>
      </div>
    );
  },
};
