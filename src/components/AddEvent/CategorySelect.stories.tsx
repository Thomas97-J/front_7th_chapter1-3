import type { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';

import CategorySelect from './CategorySelect';

const meta = {
  title: 'AddEvent/CategorySelect',
  component: CategorySelect,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    options: { control: 'object' },
    label: { control: 'text' },
    id: { control: 'text' },
    labelId: { control: 'text' },
  },
} satisfies Meta<typeof CategorySelect>;

export default meta;

type Story = StoryObj<Partial<typeof CategorySelect>>;

const defaultOptions = ['업무', '개인', '가족', '기타'];

export const Playground: Story = {
  args: {
    options: defaultOptions,
    label: '카테고리',
    id: 'category',
    labelId: 'category-label',
  },
  render: (args) => {
    function Wrapper() {
      const [value, setValue] = useState(defaultOptions[0]);
      return (
        <CategorySelect
          {...(args as ComponentProps<typeof CategorySelect>)} // ✅ 타입 단언 추가
          value={value}
          onChange={setValue}
        />
      );
    }
    return <Wrapper />;
  },
};

export const WithInitialValue: Story = {
  args: {
    options: defaultOptions,
    label: '카테고리',
    id: 'category',
    labelId: 'category-label',
  },
  render: (args) => {
    function Wrapper() {
      const typedArgs = args as ComponentProps<typeof CategorySelect>;
      const [value, setValue] = useState('개인');
      return <CategorySelect {...typedArgs} value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => `카테고리 ${i + 1}`),
    label: '카테고리',
    id: 'category',
    labelId: 'category-label',
  },
  render: (args) => {
    function Wrapper() {
      const typedArgs = args as ComponentProps<typeof CategorySelect>;
      const [value, setValue] = useState((typedArgs.options as string[])[0]);
      return <CategorySelect {...typedArgs} value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};
