import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { ToggleGroup } from './ToggleGroup.tsx';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
};
export default meta;

type Story = StoryObj<typeof ToggleGroup>;

export const TextStyle: Story = {
  render: () => {
    const [styles, setStyles] = useState<string[]>(['bold']);
    return (
      <ToggleGroup
        type="multiple"
        label="Text style"
        value={styles}
        onChange={setStyles}
        items={[
          { id: 'bold', label: 'Bold', icon: <Bold className="h-4 w-4" />, ariaLabel: 'Bold' },
          { id: 'italic', label: 'Italic', icon: <Italic className="h-4 w-4" />, ariaLabel: 'Italic' },
          { id: 'underline', label: 'Underline', icon: <Underline className="h-4 w-4" />, ariaLabel: 'Underline' },
        ]}
      />
    );
  },
};

export const Alignment: Story = {
  render: () => {
    const [alignment, setAlignment] = useState('left');
    return (
      <ToggleGroup
        label="Text alignment"
        value={alignment}
        onChange={setAlignment}
        items={[
          { id: 'left', label: 'Left', icon: <AlignLeft className="h-4 w-4" />, ariaLabel: 'Align left' },
          { id: 'center', label: 'Center', icon: <AlignCenter className="h-4 w-4" />, ariaLabel: 'Align center' },
          { id: 'right', label: 'Right', icon: <AlignRight className="h-4 w-4" />, ariaLabel: 'Align right' },
        ]}
      />
    );
  },
};
