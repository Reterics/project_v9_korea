import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MultiSelect } from './MultiSelect.tsx';
import { FormField } from './FormField.tsx';

const topics = [
  { label: 'Greetings', value: 'greetings' },
  { label: 'Numbers', value: 'numbers' },
  { label: 'Colors', value: 'colors' },
  { label: 'Food', value: 'food' },
  { label: 'Family', value: 'family' },
  { label: 'Weather', value: 'weather' },
  { label: 'Travel', value: 'travel' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Directions', value: 'directions' },
  { label: 'Time', value: 'time' },
];

const meta: Meta<typeof MultiSelect> = {
  title: 'Forms/MultiSelect',
  component: MultiSelect,
};
export default meta;

type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState<string[]>([]);
    return (
      <MultiSelect
        options={topics}
        value={val}
        onChange={setVal}
        placeholder="Select topics..."
      />
    );
  },
};

export const WithPreselected: Story = {
  render: () => {
    const [val, setVal] = useState(['greetings', 'numbers', 'food']);
    return <MultiSelect options={topics} value={val} onChange={setVal} />;
  },
};

export const WithFormField: Story = {
  render: () => {
    const [val, setVal] = useState<string[]>([]);
    return (
      <FormField label="Study Topics" required helperText="Choose topics to include in your study plan">
        <MultiSelect options={topics} value={val} onChange={setVal} placeholder="Pick topics..." />
      </FormField>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [val, setVal] = useState<string[]>([]);
    return (
      <FormField label="Topics" error="Select at least one topic">
        <MultiSelect options={topics} value={val} onChange={setVal} error />
      </FormField>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <MultiSelect
      options={topics}
      value={['greetings', 'food']}
      disabled
    />
  ),
};
