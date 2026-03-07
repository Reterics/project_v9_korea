import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from './NumberInput.tsx';
import { FormField } from './FormField.tsx';

const meta: Meta<typeof NumberInput> = {
  title: 'Forms/NumberInput',
  component: NumberInput,
};
export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState(10);
    return <NumberInput value={val} onChange={setVal} min={1} max={50} />;
  },
};

export const WithFormField: Story = {
  render: () => {
    const [val, setVal] = useState(5);
    return (
      <FormField label="Cards per session" helperText="Between 5 and 30">
        <NumberInput value={val} onChange={setVal} min={5} max={30} step={5} />
      </FormField>
    );
  },
};

export const Disabled: Story = {
  args: {
    value: 10,
    disabled: true,
  },
};
