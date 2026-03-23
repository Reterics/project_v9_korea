import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination.tsx";

const meta: Meta<typeof Pagination> = {
  title: "Primitives/Pagination",
  component: Pagination,
  argTypes: {
    page: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    siblingCount: { control: { type: "number", min: 0, max: 3 } },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: { page: 1, totalPages: 10 },
  render: function DefaultStory(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};

export const MiddlePage: Story = {
  args: { page: 5, totalPages: 10 },
  render: function MiddleStory(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};

export const ManyPages: Story = {
  args: { page: 25, totalPages: 50 },
  render: function ManyStory(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};

export const FewPages: Story = {
  args: { page: 1, totalPages: 3 },
  render: function FewStory(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};

export const AllSizes: Story = {
  render: function SizesStory() {
    const [sm, setSm] = useState(3);
    const [md, setMd] = useState(3);
    const [lg, setLg] = useState(3);
    return (
      <div className="flex flex-col gap-4">
        <Pagination page={sm} totalPages={10} onPageChange={setSm} size="sm" />
        <Pagination page={md} totalPages={10} onPageChange={setMd} size="md" />
        <Pagination page={lg} totalPages={10} onPageChange={setLg} size="lg" />
      </div>
    );
  },
};

export const AdminWordList: Story = {
  name: "Admin Word List Use Case",
  render: function AdminStory() {
    const [page, setPage] = useState(1);
    const totalWords = 523;
    const perPage = 25;
    const totalPages = Math.ceil(totalWords / perPage);
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-namsaek-500 dark:text-hanji-400">
          Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, totalWords)} of {totalWords} words
        </p>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    );
  },
};
