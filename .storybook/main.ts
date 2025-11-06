import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import viteConfig from '../vite.config.ts';
import react from '@vitejs/plugin-react-swc';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { test, ...viteConfigWithoutTest } = viteConfig;

    const merged = mergeConfig(config, {
      ...viteConfigWithoutTest,
      plugins: [react()],
    });

    // react-refresh 중복 제거
    merged.plugins = merged.plugins?.filter((p) => !p?.name?.includes('react-refresh'));

    return merged;
  },
};

export default config;
