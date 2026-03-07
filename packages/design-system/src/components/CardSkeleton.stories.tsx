import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardSkeleton } from './CardSkeleton.tsx';
import { Skeleton } from '../primitives/Skeleton.tsx';

const meta: Meta<typeof CardSkeleton> = {
  title: 'Components/CardSkeleton',
  component: CardSkeleton,
};
export default meta;

type Story = StoryObj<typeof CardSkeleton>;

export const Default: Story = {
  args: {},
};

export const TwoLines: Story = {
  args: {
    lines: 2,
  },
};

export const FiveLines: Story = {
  args: {
    lines: 5,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CardSkeleton />
      <CardSkeleton lines={4} />
      <CardSkeleton lines={2} />
      <CardSkeleton />
      <CardSkeleton lines={5} />
      <CardSkeleton lines={3} />
    </div>
  ),
};

export const SkeletonPrimitive: Story = {
  name: 'Skeleton Primitive',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-40 w-full" rounded="lg" />
      <div className="space-y-2">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-4/5" />
        <Skeleton className="h-2 w-3/5" />
      </div>
    </div>
  ),
};
