import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input.tsx';
import { FormField } from './FormField.tsx';

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter Korean text...',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter Korean text...',
    error: true,
    defaultValue: 'abc',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    disabled: true,
  },
};

export const WithFormField: Story = {
  render: () => (
    <FormField label="Korean Name" htmlFor="name" required helperText="Write your name in Hangul">
      <Input id="name" placeholder="e.g. 김민수" />
    </FormField>
  ),
};

export const WithFormFieldError: Story = {
  render: () => (
    <FormField label="Korean Name" htmlFor="name-err" required error="This field is required">
      <Input id="name-err" error />
    </FormField>
  ),
};
