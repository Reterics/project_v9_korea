import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../primitives/Button.tsx';
import { ToastProvider, useToast } from './Toast.tsx';

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Toast',
  component: ToastProvider,
};
export default meta;

type Story = StoryObj<typeof ToastProvider>;

function ToastDemo() {
  const { addToast, clearToasts } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          addToast({
            variant: 'success',
            title: 'Saved',
            description: 'Your design changes are ready.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          addToast({
            variant: 'error',
            title: 'Upload failed',
            description: 'Try a smaller image file.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          addToast({
            variant: 'info',
            title: 'Queued',
            description: 'The next notification waits behind visible items.',
          })
        }
      >
        Info
      </Button>
      <Button variant="secondary" onClick={clearToasts}>
        Clear
      </Button>
    </div>
  );
}

export const Queue: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};
