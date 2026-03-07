import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormSection } from './FormSection.tsx';
import { FormField } from './FormField.tsx';
import { Input } from './Input.tsx';
import { Textarea } from './Textarea.tsx';

const meta: Meta<typeof FormSection> = {
  title: 'Forms/FormSection',
  component: FormSection,
};
export default meta;

type Story = StoryObj<typeof FormSection>;

export const Default: Story = {
  render: () => (
    <FormSection title="Profile" description="Your learner profile information">
      <FormField label="Display name" htmlFor="dname" required>
        <Input id="dname" placeholder="e.g. MinSu" />
      </FormField>
      <FormField label="Bio" htmlFor="bio">
        <Textarea id="bio" placeholder="Tell us about your learning goals..." />
      </FormField>
    </FormSection>
  ),
};

export const MultipleSections: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <FormSection title="Profile" description="Basic information">
        <FormField label="Display name" htmlFor="s-name">
          <Input id="s-name" placeholder="e.g. MinSu" />
        </FormField>
      </FormSection>
      <FormSection title="Notifications" description="How we reach you">
        <FormField label="Email" htmlFor="s-email">
          <Input id="s-email" type="email" placeholder="you@example.com" />
        </FormField>
      </FormSection>
    </div>
  ),
};
