import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FileUpload } from './FileUpload.tsx';

const meta: Meta<typeof FileUpload> = {
  title: 'Forms/FileUpload',
  component: FileUpload,
};
export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Images: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="max-w-xl">
        <FileUpload files={files} onFilesChange={setFiles} maxFiles={4} />
      </div>
    );
  },
};

export const StrictValidation: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div className="max-w-xl">
        <FileUpload
          label="Upload one small PNG"
          files={files}
          onFilesChange={setFiles}
          accept={['image/png']}
          maxFiles={1}
          maxSizeBytes={100 * 1024}
          multiple={false}
        />
      </div>
    );
  },
};
