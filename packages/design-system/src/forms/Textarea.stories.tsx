import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea.tsx';
import { FormField } from './FormField.tsx';

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Write a sentence in Korean...',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Write a sentence...',
    error: true,
    defaultValue: 'Invalid input',
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
    <FormField label="Notes" htmlFor="notes" helperText="Optional study notes">
      <Textarea id="notes" placeholder="e.g. This grammar pattern is used with..." />
    </FormField>
  ),
};
