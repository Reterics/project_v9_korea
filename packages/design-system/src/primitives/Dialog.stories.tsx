import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from './Dialog.tsx';
import { Button } from './Button.tsx';
import { Input } from '../forms/Input.tsx';
import { FormField } from '../forms/FormField.tsx';

const meta: Meta<typeof Dialog> = {
  title: 'Primitives/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogHeader onClose={() => setOpen(false)}>Dialog Title</DialogHeader>
          <DialogBody>
            This is a basic dialog with a header, body, and footer.
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

export const Confirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Delete Lesson</Button>
        <Dialog open={open} onClose={() => setOpen(false)} size="sm">
          <DialogHeader onClose={() => setOpen(false)}>Delete Lesson?</DialogHeader>
          <DialogBody>
            This will permanently remove the lesson and all associated progress.
            This action cannot be undone.
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => setOpen(false)}
              className="!bg-dancheong-500 hover:!bg-dancheong-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Edit Profile</Button>
        <Dialog open={open} onClose={() => setOpen(false)} size="lg">
          <DialogHeader onClose={() => setOpen(false)}>Edit Profile</DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <FormField label="Display Name" htmlFor="name">
                <Input id="name" placeholder="e.g. 김민수" defaultValue="Attila" />
              </FormField>
              <FormField label="Email" htmlFor="email">
                <Input id="email" type="email" placeholder="you@example.com" defaultValue="attila@example.com" />
              </FormField>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

export const BodyOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show Notice</Button>
        <Dialog open={open} onClose={() => setOpen(false)} size="sm">
          <DialogBody className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cheongja-100 dark:bg-cheongja-900">
              <svg className="h-6 w-6 text-cheongja-600 dark:text-cheongja-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="text-base font-semibold text-namsaek-900 dark:text-hanji-50">Lesson Complete!</p>
            <p className="mt-1 text-sm text-hanji-500 dark:text-hanji-400">You earned 25 XP.</p>
          </DialogBody>
          <DialogFooter className="justify-center border-none">
            <Button onClick={() => setOpen(false)}>Continue</Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

export const NoBackdropClose: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Persistent Dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} closeOnBackdrop={false} closeOnEscape={false}>
          <DialogHeader>Terms & Conditions</DialogHeader>
          <DialogBody>
            You must accept the terms to continue. Clicking the backdrop or pressing
            Escape will not close this dialog.
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>I Accept</Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const [openSize, setOpenSize] = useState<string | null>(null);
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
    return (
      <div className="flex flex-wrap items-center gap-3">
        {sizes.map((size) => (
          <Button key={size} variant="outline" onClick={() => setOpenSize(size)}>
            {size.toUpperCase()}
          </Button>
        ))}
        {sizes.map((size) => (
          <Dialog key={size} open={openSize === size} onClose={() => setOpenSize(null)} size={size}>
            <DialogHeader onClose={() => setOpenSize(null)}>Size: {size.toUpperCase()}</DialogHeader>
            <DialogBody>
              This dialog uses the <code className="rounded bg-hanji-200 px-1.5 py-0.5 text-xs dark:bg-namsaek-700">{size}</code> size preset.
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenSize(null)}>Close</Button>
            </DialogFooter>
          </Dialog>
        ))}
      </div>
    );
  },
};