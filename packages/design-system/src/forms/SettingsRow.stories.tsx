import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SettingsRow } from './SettingsRow.tsx';
import { Switch } from './Switch.tsx';
import { Select } from './Select.tsx';
import { NumberInput } from './NumberInput.tsx';

const meta: Meta<typeof SettingsRow> = {
  title: 'Forms/SettingsRow',
  component: SettingsRow,
};
export default meta;

type Story = StoryObj<typeof SettingsRow>;

export const WithSwitch: Story = {
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <SettingsRow label="Dark mode" description="Use dark theme throughout the app">
        <Switch checked={on} onChange={setOn} />
      </SettingsRow>
    );
  },
};

export const WithSelect: Story = {
  render: () => (
    <SettingsRow label="Language" description="Interface language">
      <Select className="w-36">
        <option>English</option>
        <option>Korean</option>
      </Select>
    </SettingsRow>
  ),
};

export const SettingsPage: Story = {
  render: () => {
    const [dark, setDark] = useState(false);
    const [sound, setSound] = useState(true);
    const [cards, setCards] = useState(10);
    return (
      <div className="flex flex-col gap-3">
        <SettingsRow label="Dark mode" description="Use dark theme">
          <Switch checked={dark} onChange={setDark} />
        </SettingsRow>
        <SettingsRow label="Sound effects" description="Play audio on correct answers">
          <Switch checked={sound} onChange={setSound} />
        </SettingsRow>
        <SettingsRow label="Cards per session" description="Number of flashcards in each session">
          <NumberInput value={cards} onChange={setCards} min={5} max={30} step={5} />
        </SettingsRow>
        <SettingsRow label="Difficulty" description="Preferred quiz difficulty">
          <Select className="w-32">
            <option>Easy</option>
            <option>Normal</option>
            <option>Hard</option>
          </Select>
        </SettingsRow>
      </div>
    );
  },
};
