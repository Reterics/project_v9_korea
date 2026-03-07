import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldGroup } from './FieldGroup.tsx';
import { FormField } from './FormField.tsx';
import { Input } from './Input.tsx';
import { Select } from './Select.tsx';

const meta: Meta<typeof FieldGroup> = {
  title: 'Forms/FieldGroup',
  component: FieldGroup,
};
export default meta;

type Story = StoryObj<typeof FieldGroup>;

export const Default: Story = {
  render: () => (
    <FieldGroup legend="Study Preferences">
      <FormField label="Daily goal" htmlFor="goal">
        <Input id="goal" placeholder="e.g. 20 cards" />
      </FormField>
      <FormField label="Preferred level" htmlFor="lvl">
        <Select id="lvl">
          <option value="a1">A1</option>
          <option value="a2">A2</option>
        </Select>
      </FormField>
    </FieldGroup>
  ),
};
