import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Autocomplete } from './Autocomplete.tsx';
import { FormField } from './FormField.tsx';

const koreanWords = [
  { label: '안녕하세요 (Hello)', value: 'hello' },
  { label: '감사합니다 (Thank you)', value: 'thanks' },
  { label: '사랑해요 (I love you)', value: 'love' },
  { label: '미안합니다 (Sorry)', value: 'sorry' },
  { label: '주세요 (Please give)', value: 'please' },
  { label: '네 (Yes)', value: 'yes' },
  { label: '아니요 (No)', value: 'no' },
  { label: '좋아요 (Good/Like)', value: 'good' },
  { label: '괜찮아요 (It\'s okay)', value: 'okay' },
  { label: '잠시만요 (Wait a moment)', value: 'wait' },
];

const meta: Meta<typeof Autocomplete> = {
  title: 'Forms/Autocomplete',
  component: Autocomplete,
};
export default meta;

type Story = StoryObj<typeof Autocomplete>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return (
      <Autocomplete
        options={koreanWords}
        value={val}
        onChange={setVal}
        placeholder="Search Korean phrases..."
      />
    );
  },
};

export const WithFormField: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return (
      <FormField label="Look up a phrase" helperText="Type to filter Korean expressions">
        <Autocomplete
          options={koreanWords}
          value={val}
          onChange={setVal}
          placeholder="Type to search..."
        />
      </FormField>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [val, setVal] = useState('xyz');
    return (
      <FormField label="Phrase" error="Please select a valid phrase">
        <Autocomplete options={koreanWords} value={val} onChange={setVal} error />
      </FormField>
    );
  },
};

export const Disabled: Story = {
  args: {
    options: koreanWords,
    value: '안녕하세요 (Hello)',
    disabled: true,
  },
};
