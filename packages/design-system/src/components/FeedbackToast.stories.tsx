import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeedbackToast } from "./FeedbackToast.tsx";

const meta: Meta<typeof FeedbackToast> = {
  title: "Components/FeedbackToast",
  component: FeedbackToast,
  argTypes: {
    type: {
      control: "select",
      options: [null, "correct", "wrong"],
    },
    message: { control: "text" },
    durationMs: { control: "number" },
  },
};
export default meta;

type Story = StoryObj<typeof FeedbackToast>;

export const Correct: Story = {
  args: {
    type: "correct",
  },
};

export const Wrong: Story = {
  args: {
    type: "wrong",
  },
};

export const CustomMessage: Story = {
  args: {
    type: "correct",
    message: "Great job! 잘했어요!",
  },
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [type, setType] = useState<"correct" | "wrong" | null>(null);
    const [key, setKey] = useState(0);

    function trigger(t: "correct" | "wrong") {
      setType(null);
      // Force remount so the timer restarts even if the same type is clicked twice
      setTimeout(() => {
        setKey((k) => k + 1);
        setType(t);
      }, 20);
    }

    return (
      <div className="flex flex-col items-center gap-4 pt-8">
        <p className="text-sm text-hanji-500">Click a button to trigger the toast</p>
        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-lg bg-cheongja-500 px-4 py-2 text-sm font-medium text-white"
            onClick={() => trigger("correct")}
          >
            Correct
          </button>
          <button
            type="button"
            className="rounded-lg bg-dancheong-500 px-4 py-2 text-sm font-medium text-white"
            onClick={() => trigger("wrong")}
          >
            Wrong
          </button>
        </div>
        <FeedbackToast key={key} type={type} durationMs={2000} />
      </div>
    );
  },
};