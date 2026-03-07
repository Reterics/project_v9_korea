import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from './SearchInput.tsx';

const meta: Meta<typeof SearchInput> = {
  title: 'Forms/SearchInput',
  component: SearchInput,
};
export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: 'Search vocabulary...',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: '안녕하세요',
  },
};
