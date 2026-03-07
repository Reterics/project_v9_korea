import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from './SectionHeader.tsx';
import { Badge } from '../primitives/Badge.tsx';

const meta: Meta<typeof SectionHeader> = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
};
export default meta;

type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: {
    title: 'Activities',
    subtitle: 'Choose a game to practice',
  },
};

export const WithAction: Story = {
  args: {
    title: 'Weak Areas',
    subtitle: 'Based on recent mistakes',
    right: <Badge variant="danger">Particles</Badge>,
  },
};
