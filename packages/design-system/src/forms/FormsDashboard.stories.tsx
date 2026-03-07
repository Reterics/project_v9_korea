import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input } from './Input.tsx';
import { Textarea } from './Textarea.tsx';
import { Select } from './Select.tsx';
import { Checkbox } from './Checkbox.tsx';
import { Radio } from './Radio.tsx';
import { Switch } from './Switch.tsx';
import { FormField } from './FormField.tsx';
import { FieldGroup } from './FieldGroup.tsx';
import { FormSection } from './FormSection.tsx';
import { SearchInput } from './SearchInput.tsx';
import { NumberInput } from './NumberInput.tsx';
import { InlineField } from './InlineField.tsx';
import { SettingsRow } from './SettingsRow.tsx';
import { DatePicker } from './DatePicker.tsx';
import { Autocomplete } from './Autocomplete.tsx';
import { MultiSelect } from './MultiSelect.tsx';

const meta: Meta = {
  title: 'Forms/Dashboard',
};
export default meta;

type Story = StoryObj;

const koreanPhrases = [
  { label: '안녕하세요 (Hello)', value: 'hello' },
  { label: '감사합니다 (Thank you)', value: 'thanks' },
  { label: '사랑해요 (I love you)', value: 'love' },
  { label: '미안합니다 (Sorry)', value: 'sorry' },
  { label: '주세요 (Please give)', value: 'please' },
  { label: '네 (Yes)', value: 'yes' },
  { label: '아니요 (No)', value: 'no' },
  { label: '좋아요 (Good/Like)', value: 'good' },
  { label: '괜찮아요 (It\'s okay)', value: 'okay' },
  { label: '잠시만요 (Wait a moment)', value: 'wait' },
];

const studyTopics = [
  { label: 'Greetings', value: 'greetings' },
  { label: 'Numbers', value: 'numbers' },
  { label: 'Colors', value: 'colors' },
  { label: 'Food & Drink', value: 'food' },
  { label: 'Family', value: 'family' },
  { label: 'Weather', value: 'weather' },
  { label: 'Travel', value: 'travel' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Directions', value: 'directions' },
  { label: 'Time & Date', value: 'time' },
];

function AllFormInputs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');
  const [cardsPerSession, setCardsPerSession] = useState(10);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('2026-03-07');
  const [phrase, setPhrase] = useState('');
  const [topics, setTopics] = useState<string[]>(['greetings', 'numbers']);
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(true);
  const [romanization, setRomanization] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState('kr-en');

  return (
    <div className="mx-auto max-w-2xl space-y-10 p-6">
      <div>
        <h1 className="text-2xl font-bold text-namsaek-700 dark:text-hanji-100">
          Forms Component Dashboard
        </h1>
        <p className="mt-1 text-sm text-namsaek-400 dark:text-hanji-400">
          Every form component in the design system
        </p>
      </div>

      {/* Search */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-namsaek-600 dark:text-hanji-200">
          Search
        </h2>
        <SearchInput
          placeholder="Search vocabulary, lessons, grammar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Profile Section */}
      <FormSection title="Profile" description="Your learner profile information">
        <FormField label="Display Name" htmlFor="d-name" required>
          <Input
            id="d-name"
            placeholder="e.g. MinSu"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormField>

        <FormField label="Email" htmlFor="d-email" required error={email && !email.includes('@') ? 'Enter a valid email' : undefined}>
          <Input
            id="d-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!email && !email.includes('@')}
          />
        </FormField>

        <FormField label="Bio" htmlFor="d-bio" helperText="Tell us about your Korean learning goals">
          <Textarea
            id="d-bio"
            placeholder="I started learning Korean because..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </FormField>

        <FormField label="Proficiency Level" htmlFor="d-level" required>
          <Select id="d-level" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Choose a level...</option>
            <option value="a1">A1 - Beginner</option>
            <option value="a2">A2 - Elementary</option>
          </Select>
        </FormField>
      </FormSection>

      {/* Date Pickers */}
      <FormSection title="Study Schedule" description="Set your learning timeline">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" required>
            <DatePicker value={startDate} onChange={setStartDate} placeholder="Pick start..." />
          </FormField>
          <FormField label="End Date">
            <DatePicker value={endDate} onChange={setEndDate} />
          </FormField>
        </div>
      </FormSection>

      {/* Autocomplete & MultiSelect */}
      <FormSection title="Content Selection" description="Choose what to study">
        <FormField label="Look up a phrase" helperText="Type to search Korean expressions">
          <Autocomplete
            options={koreanPhrases}
            value={phrase}
            onChange={setPhrase}
            placeholder="Type to search..."
          />
        </FormField>

        <FormField label="Study Topics" required helperText="Select the topics you want to focus on">
          <MultiSelect
            options={studyTopics}
            value={topics}
            onChange={setTopics}
            placeholder="Add topics..."
          />
        </FormField>
      </FormSection>

      {/* Number Inputs */}
      <FormSection title="Session Configuration" description="Customize your practice sessions">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Cards per Session" helperText="5 - 50 cards">
            <NumberInput value={cardsPerSession} onChange={setCardsPerSession} min={5} max={50} step={5} />
          </FormField>
          <FormField label="Daily Goal (XP)" helperText="10 - 100 XP">
            <NumberInput value={dailyGoal} onChange={setDailyGoal} min={10} max={100} step={10} />
          </FormField>
        </div>
      </FormSection>

      {/* Radio Group */}
      <FormSection title="Quiz Direction" description="How questions are presented">
        <FieldGroup legend="Translation Direction">
          <div className="flex flex-col gap-2">
            <Radio
              name="d-direction"
              label="Korean to English"
              value="kr-en"
              checked={direction === 'kr-en'}
              onChange={() => setDirection('kr-en')}
            />
            <Radio
              name="d-direction"
              label="English to Korean"
              value="en-kr"
              checked={direction === 'en-kr'}
              onChange={() => setDirection('en-kr')}
            />
            <Radio
              name="d-direction"
              label="Both directions (mixed)"
              value="both"
              checked={direction === 'both'}
              onChange={() => setDirection('both')}
            />
          </div>
        </FieldGroup>
      </FormSection>

      {/* Checkboxes */}
      <FormSection title="Content Types" description="Select what to include in your sessions">
        <FieldGroup legend="Include in Study">
          <div className="grid grid-cols-2 gap-2">
            <Checkbox label="Vocabulary" defaultChecked />
            <Checkbox label="Grammar" defaultChecked />
            <Checkbox label="Listening" />
            <Checkbox label="Writing" />
            <Checkbox label="Reading" defaultChecked />
            <Checkbox label="Speaking" />
          </div>
        </FieldGroup>
      </FormSection>

      {/* Inline Fields */}
      <FormSection title="Quick Toggles" description="Inline label + control layout">
        <div className="flex flex-col gap-3">
          <InlineField label="Auto-play audio">
            <Switch checked={autoPlay} onChange={setAutoPlay} />
          </InlineField>
          <InlineField label="Show romanization">
            <Switch checked={romanization} onChange={setRomanization} />
          </InlineField>
          <InlineField label="Quiz mode">
            <Select className="w-40">
              <option>Multiple choice</option>
              <option>Type answer</option>
              <option>Matching</option>
            </Select>
          </InlineField>
        </div>
      </FormSection>

      {/* Settings Rows */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-namsaek-600 dark:text-hanji-200">
          Settings Rows
        </h2>
        <div className="flex flex-col gap-3">
          <SettingsRow label="Dark Mode" description="Use dark theme throughout the app">
            <Switch checked={darkMode} onChange={setDarkMode} />
          </SettingsRow>
          <SettingsRow label="Sound Effects" description="Play audio feedback on answers">
            <Switch checked={sound} onChange={setSound} />
          </SettingsRow>
          <SettingsRow label="Cards per Session" description="Number of flashcards each time">
            <NumberInput value={cardsPerSession} onChange={setCardsPerSession} min={5} max={50} step={5} />
          </SettingsRow>
          <SettingsRow label="Interface Language" description="Language for menus and UI">
            <Select className="w-36">
              <option>English</option>
              <option>Korean</option>
            </Select>
          </SettingsRow>
        </div>
      </div>

      {/* Disabled States */}
      <FormSection title="Disabled States" description="All inputs in their disabled state">
        <div className="flex flex-col gap-4">
          <FormField label="Disabled Input">
            <Input disabled placeholder="Cannot edit" />
          </FormField>
          <FormField label="Disabled Textarea">
            <Textarea disabled placeholder="Cannot edit" />
          </FormField>
          <FormField label="Disabled Select">
            <Select disabled>
              <option>A1 - Beginner</option>
            </Select>
          </FormField>
          <FormField label="Disabled Date">
            <DatePicker disabled value="2026-01-15" />
          </FormField>
          <FormField label="Disabled Autocomplete">
            <Autocomplete disabled options={koreanPhrases} value="안녕하세요 (Hello)" />
          </FormField>
          <FormField label="Disabled Multi-Select">
            <MultiSelect disabled options={studyTopics} value={['greetings', 'food']} />
          </FormField>
          <FormField label="Disabled Number">
            <NumberInput disabled value={10} />
          </FormField>
          <div className="flex flex-col gap-2">
            <Checkbox label="Disabled checkbox" disabled />
            <Radio label="Disabled radio" disabled name="dis-radio" />
            <Switch label="Disabled switch" disabled />
          </div>
        </div>
      </FormSection>

      {/* Error States */}
      <FormSection title="Error States" description="All inputs showing validation errors">
        <FormField label="Name" error="This field is required" required>
          <Input error />
        </FormField>
        <FormField label="Notes" error="Must be at least 10 characters">
          <Textarea error defaultValue="Too short" />
        </FormField>
        <FormField label="Level" error="Please select a level" required>
          <Select error>
            <option value="">Choose...</option>
          </Select>
        </FormField>
        <FormField label="Date" error="Please select a date" required>
          <DatePicker error value="" onChange={() => {}} />
        </FormField>
        <FormField label="Phrase" error="Please select a valid phrase">
          <Autocomplete error options={koreanPhrases} value="invalid" />
        </FormField>
        <FormField label="Topics" error="Select at least one topic">
          <MultiSelect error options={studyTopics} value={[]} />
        </FormField>
      </FormSection>
    </div>
  );
}

export const AllInputs: Story = {
  render: () => <AllFormInputs />,
};
