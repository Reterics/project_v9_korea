import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from './Slider.tsx';

const meta: Meta<typeof Slider> = {
  title: 'Forms/Slider',
  component: Slider,
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const VisualControls: Story = {
  render: () => {
    const [opacity, setOpacity] = useState(85);
    const [fontSize, setFontSize] = useState(18);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [shadow, setShadow] = useState(24);

    return (
      <div className="flex max-w-md flex-col gap-5">
        <Slider label="Opacity" value={opacity} onChange={setOpacity} min={0} max={100} unit="%" />
        <Slider label="Font size" value={fontSize} onChange={setFontSize} min={10} max={72} unit=" px" />
        <Slider label="Stroke width" value={strokeWidth} onChange={setStrokeWidth} min={0} max={12} step={0.5} unit=" px" />
        <Slider label="Shadow" value={shadow} onChange={setShadow} min={0} max={64} unit=" px" />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    label: 'Opacity',
    value: 40,
    unit: '%',
    disabled: true,
  },
};
