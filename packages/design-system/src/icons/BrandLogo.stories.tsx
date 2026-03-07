import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandLogo } from './BrandLogo.tsx';

const meta: Meta<typeof BrandLogo> = {
  title: 'Icons/BrandLogo',
  component: BrandLogo,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'icon'] },
    size: { control: { type: 'range', min: 16, max: 80, step: 4 } },
  },
};
export default meta;

type Story = StoryObj<typeof BrandLogo>;

export const Primary: Story = { args: { variant: 'primary', size: 30 } };
export const IconOnly: Story = { args: { variant: 'icon', size: 40 } };
