import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashboardLayout } from './DashboardLayout.tsx';
import { Card } from '../primitives/Card.tsx';

const meta: Meta<typeof DashboardLayout> = {
  title: 'Patterns/DashboardLayout',
  component: DashboardLayout,
};
export default meta;

type Story = StoryObj<typeof DashboardLayout>;

export const Default: Story = {
  args: {
    main: (
      <>
        <Card>
          <div className="text-sm font-semibold">Main content area</div>
          <div className="mt-1 text-xs text-hanji-500">1.2fr column</div>
        </Card>
        <Card>
          <div className="text-sm font-semibold">Second card</div>
        </Card>
      </>
    ),
    sidebar: (
      <>
        <Card>
          <div className="text-sm font-semibold">Sidebar</div>
          <div className="mt-1 text-xs text-hanji-500">0.8fr column</div>
        </Card>
      </>
    ),
  },
};
