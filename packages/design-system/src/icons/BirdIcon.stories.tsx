import type { Meta, StoryObj } from '@storybook/react-vite';
import { BirdIcon } from './BirdIcon.tsx';

const meta: Meta<typeof BirdIcon> = {
  title: 'Icons/BirdIcon',
  component: BirdIcon,
  argTypes: {
    size: { control: { type: 'range', min: 16, max: 80, step: 4 } },
  },
};
export default meta;

type Story = StoryObj<typeof BirdIcon>;

export const Default: Story = { args: { size: 30 } };
export const Large: Story = { args: { size: 60 } };
