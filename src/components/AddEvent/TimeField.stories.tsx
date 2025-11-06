import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import TimeField from './TimeField';

const meta = {
  title: 'AddEvent/TimeField',
  component: TimeField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    id: { control: 'text' },
    label: { control: 'text' },
    errorMessage: { control: 'text' },
  },
} satisfies Meta<typeof TimeField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    id: 'start-time',
    label: '시작 시간',
  },
  render: (args) => {
    const [value, setValue] = useState('09:00');
    return (
      <TimeField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const WithError: Story = {
  args: {
    id: 'end-time',
    label: '종료 시간',
    errorMessage: '종료 시간이 시작 시간보다 빠릅니다',
  },
  render: (args) => {
    const [value, setValue] = useState('08:00');
    return (
      <TimeField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const CustomOnBlur: Story = {
  args: {
    id: 'end-time',
    label: '종료 시간',
  },
  render: (args) => {
    const [value, setValue] = useState('10:00');
    const [error, setError] = useState<string | null>(null);

    return (
      <TimeField
        {...args}
        value={value}
        errorMessage={error}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          // 간단한 데모 검증: 09:00보다 빠르면 에러
          if (value < '09:00') setError('09:00 이후여야 합니다');
          else setError(null);
        }}
      />
    );
  },
};