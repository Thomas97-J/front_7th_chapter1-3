import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import LabeledTextField from './LabeledTextField';

const meta = {
  title: 'AddEvent/LabeledTextField',
  component: LabeledTextField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    id: { control: 'text' },
    label: { control: 'text' },
    type: { control: 'text' },
    size: { control: 'inline-radio', options: ['small', 'medium'] },
    inputProps: { control: 'object' },
  },
} satisfies Meta<typeof LabeledTextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    id: 'title',
    label: '제목',
    size: 'small',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <LabeledTextField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={args.type}
      />
    );
  },
};

export const TypeDate: Story = {
  args: {
    id: 'date',
    label: '날짜',
    size: 'small',
    type: 'date',
  },
  render: (args) => {
    const [value, setValue] = useState('2025-11-15');
    return <LabeledTextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

export const NumberWithMin: Story = {
  args: {
    id: 'repeat-interval',
    label: '반복 간격',
    size: 'small',
    type: 'number',
    inputProps: { min: 1 },
  },
  render: (args) => {
    const [value, setValue] = useState<number>(1);
    return (
      <LabeledTextField
        {...args}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    );
  },
};
