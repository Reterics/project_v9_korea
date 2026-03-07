import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select.tsx';
import { FormField } from './FormField.tsx';

const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <option value="">Choose a level...</option>
      <option value="a1">A1 - Beginner</option>
      <option value="a2">A2 - Elementary</option>
    </Select>
  ),
};

export const WithError: Story = {
  render: () => (
    <Select error>
      <option value="">Choose a level...</option>
      <option value="a1">A1 - Beginner</option>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <option value="a1">A1 - Beginner</option>
    </Select>
  ),
};

export const WithFormField: Story = {
  render: () => (
    <FormField label="Proficiency Level" htmlFor="level" required>
      <Select id="level">
        <option value="">Choose a level...</option>
        <option value="a1">A1 - Beginner</option>
        <option value="a2">A2 - Elementary</option>
      </Select>
    </FormField>
  ),
};
