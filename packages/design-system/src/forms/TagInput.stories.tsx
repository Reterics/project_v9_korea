import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagInput } from "./TagInput.tsx";

const meta: Meta<typeof TagInput> = {
  title: "Forms/TagInput",
  component: TagInput,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    max: { control: "number" },
    placeholder: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: function DefaultStory() {
    const [tags, setTags] = useState<string[]>([]);
    return <TagInput value={tags} onChange={setTags} />;
  },
};

export const WithValues: Story = {
  render: function WithValuesStory() {
    const [tags, setTags] = useState(["noun", "verb", "particle"]);
    return <TagInput value={tags} onChange={setTags} />;
  },
};

export const AllSizes: Story = {
  render: function SizesStory() {
    const [sm, setSm] = useState(["small"]);
    const [md, setMd] = useState(["medium"]);
    const [lg, setLg] = useState(["large"]);
    return (
      <div className="flex flex-col gap-4">
        <TagInput value={sm} onChange={setSm} size="sm" />
        <TagInput value={md} onChange={setMd} size="md" />
        <TagInput value={lg} onChange={setLg} size="lg" />
      </div>
    );
  },
};

export const MaxTags: Story = {
  name: "Max 3 Tags",
  render: function MaxStory() {
    const [tags, setTags] = useState(["은/는", "이/가"]);
    return <TagInput value={tags} onChange={setTags} max={3} placeholder="Max 3 particles" />;
  },
};

export const Disabled: Story = {
  render: () => (
    <TagInput value={["locked", "tags"]} onChange={() => {}} disabled />
  ),
};

export const SentenceBreakdown: Story = {
  name: "Sentence Breakdown Use Case",
  render: function BreakdownStory() {
    const [parts, setParts] = useState(["저는", "학생", "입니다"]);
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-namsaek-700 dark:text-hanji-300">
          Sentence breakdown tokens
        </label>
        <TagInput
          value={parts}
          onChange={setParts}
          placeholder="Add a token and press Enter"
        />
        <p className="text-xs text-namsaek-500 dark:text-hanji-400">
          Press Enter or comma to add. Backspace to remove the last token.
        </p>
      </div>
    );
  },
};

export const LessonCategories: Story = {
  name: "Lesson Categories",
  render: function CategoriesStory() {
    const [cats, setCats] = useState(["greetings", "numbers", "particles"]);
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-namsaek-700 dark:text-hanji-300">
          Categories
        </label>
        <TagInput value={cats} onChange={setCats} placeholder="Add category" />
      </div>
    );
  },
};
