import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./DropdownMenu.tsx";

const meta: Meta<typeof DropdownMenu> = {
  title: "Navigation/DropdownMenu",
  component: DropdownMenu,
  decorators: [
    (Story) => (
      <div className="flex justify-end p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

const SettingsIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogOutIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const HelpIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-4 w-4 text-namsaek-500 dark:text-hanji-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Default: Story = {
  args: {
    title: "Menu",
    items: [
      { id: "settings", label: "Settings", icon: <SettingsIcon />, onClick: () => console.log("settings") },
      { id: "help", label: "Help & Support", icon: <HelpIcon />, onClick: () => console.log("help") },
      { id: "logout", label: "Log out", icon: <LogOutIcon />, onClick: () => console.log("logout"), variant: "danger", divider: true },
    ],
  },
};

export const WithHeader: Story = {
  args: {
    title: "Jane Doe",
    trigger: <UserIcon />,
    items: [
      { id: "settings", label: "Settings", icon: <SettingsIcon />, onClick: () => console.log("settings") },
      { id: "help", label: "Help & Support", icon: <HelpIcon />, onClick: () => console.log("help") },
      { id: "logout", label: "Log out", icon: <LogOutIcon />, onClick: () => console.log("logout"), variant: "danger", divider: true },
    ],
    children: (
      <>
        <div className="text-sm font-medium truncate">Jane Doe</div>
        <div className="text-xs text-hanji-500 dark:text-hanji-400 truncate">jane@example.com</div>
      </>
    ),
  },
};

export const ManyItems: Story = {
  args: {
    title: "Admin User",
    trigger: <UserIcon />,
    items: [
      { id: "profile", label: "My Profile", onClick: () => console.log("profile") },
      { id: "settings", label: "Settings", icon: <SettingsIcon />, onClick: () => console.log("settings") },
      { id: "help", label: "Help & Support", icon: <HelpIcon />, onClick: () => console.log("help") },
      { id: "logout", label: "Log out", icon: <LogOutIcon />, onClick: () => console.log("logout"), variant: "danger", divider: true },
    ],
    children: (
      <>
        <div className="text-sm font-medium truncate">Admin User</div>
        <div className="text-xs text-hanji-500 dark:text-hanji-400 truncate">admin@birdie.app</div>
        <div className="mt-1 text-xs text-cheongja-600 dark:text-cheongja-400">Level 12 · 1,240 XP</div>
      </>
    ),
  },
};
