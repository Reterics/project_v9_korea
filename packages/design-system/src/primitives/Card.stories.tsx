import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card.tsx';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  argTypes: {
    hoverable: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <div className="text-sm font-semibold">Card Title</div>
        <div className="mt-1 text-xs text-hanji-500">Card description text</div>
      </div>
    ),
  },
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: (
      <div>
        <div className="text-sm font-semibold">Hoverable Card</div>
        <div className="mt-1 text-xs text-hanji-500">Hover me for lift effect</div>
      </div>
    ),
  },
};
