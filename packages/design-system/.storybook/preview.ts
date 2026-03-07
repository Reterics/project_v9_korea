import type { Preview } from '@storybook/react-vite'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Forms', ['Dashboard', '*'], 'Components', 'Primitives', 'Icons', 'Patterns'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      values: [
        { name: 'Hanji Light', value: '#F8F4EE' },
        { name: 'Namsaek Dark', value: '#0A1119' },
        { name: 'White', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const bg = context.globals?.backgrounds?.value;
      const isDark = bg === '#0A1119';
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return Story();
    },
  ],
};

export default preview;