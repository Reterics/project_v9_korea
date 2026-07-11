import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ColorPicker } from './ColorPicker.tsx';

const meta: Meta<typeof ColorPicker> = {
  title: 'Forms/ColorPicker',
  component: ColorPicker,
};
export default meta;

type Story = StoryObj<typeof ColorPicker>;

export const DesignColors: Story = {
  render: () => {
    const [textColor, setTextColor] = useState('#1B3050');
    const [backgroundColor, setBackgroundColor] = useState('#FDFBF8');
    const [strokeColor, setStrokeColor] = useState('#3D8F7D');
    const [shadowColor, setShadowColor] = useState('#000000');

    return (
      <div className="grid max-w-3xl gap-5 md:grid-cols-2">
        <ColorPicker label="Text color" value={textColor} onChange={setTextColor} />
        <ColorPicker label="Background color" value={backgroundColor} onChange={setBackgroundColor} />
        <ColorPicker label="Stroke color" value={strokeColor} onChange={setStrokeColor} />
        <ColorPicker label="Shadow color" value={shadowColor} onChange={setShadowColor} />
      </div>
    );
  },
};

export const InvalidValue: Story = {
  args: {
    label: 'Custom color',
    value: 'blue',
  },
};
