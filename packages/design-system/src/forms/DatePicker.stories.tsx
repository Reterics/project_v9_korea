import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DatePicker } from './DatePicker.tsx';
import { FormField } from './FormField.tsx';

const meta: Meta<typeof DatePicker> = {
  title: 'Forms/DatePicker',
  component: DatePicker,
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return <DatePicker value={val} onChange={setVal} />;
  },
};

export const WithValue: Story = {
  render: () => {
    const [val, setVal] = useState('2026-03-07');
    return <DatePicker value={val} onChange={setVal} />;
  },
};

export const WithError: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return (
      <FormField label="Start date" required error="Please select a date">
        <DatePicker value={val} onChange={setVal} error />
      </FormField>
    );
  },
};

export const Disabled: Story = {
  args: {
    value: '2026-01-15',
    disabled: true,
  },
};
