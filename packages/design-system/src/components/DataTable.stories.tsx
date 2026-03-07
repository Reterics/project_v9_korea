import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from './DataTable.tsx';

type Word = {
  id: number;
  korean: string;
  english: string;
  level: string;
  mastery: number;
};

const sampleData: Word[] = [
  { id: 1, korean: '안녕하세요', english: 'Hello', level: 'A1', mastery: 95 },
  { id: 2, korean: '감사합니다', english: 'Thank you', level: 'A1', mastery: 88 },
  { id: 3, korean: '미안합니다', english: 'Sorry', level: 'A1', mastery: 72 },
  { id: 4, korean: '사랑해요', english: 'I love you', level: 'A2', mastery: 60 },
  { id: 5, korean: '괜찮아요', english: "It's okay", level: 'A2', mastery: 45 },
];

const columns = [
  { key: 'korean', header: 'Korean' },
  { key: 'english', header: 'English' },
  { key: 'level', header: 'Level', className: 'w-20' },
  {
    key: 'mastery',
    header: 'Mastery',
    className: 'w-28',
    render: (row: Word) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-hanji-200 dark:bg-namsaek-800">
          <div
            className={
              "h-full rounded-full transition-all " +
              (row.mastery >= 80
                ? "bg-cheongja-500"
                : row.mastery >= 50
                  ? "bg-geum-500"
                  : "bg-dancheong-500")
            }
            style={{ width: `${row.mastery}%` }}
          />
        </div>
        <span className="text-xs tabular-nums">{row.mastery}%</span>
      </div>
    ),
  },
];

const meta: Meta<typeof DataTable<Word>> = {
  title: 'Components/DataTable',
  component: DataTable<Word>,
};
export default meta;

type Story = StoryObj<typeof DataTable<Word>>;

export const Default: Story = {
  args: {
    columns,
    data: sampleData,
    keyField: 'id',
  },
};

export const Clickable: Story = {
  args: {
    columns,
    data: sampleData,
    keyField: 'id',
    onRowClick: (row: Word) => alert(`Clicked: ${row.korean}`),
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    keyField: 'id',
    emptyMessage: 'No vocabulary words yet. Start a lesson to add some!',
  },
};
