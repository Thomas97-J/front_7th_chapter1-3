import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import NotificationSelect from './NotificationSelect';

const meta = {
  title: 'AddEvent/NotificationSelect',
  component: NotificationSelect,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    id: { control: 'text' },
    label: { control: 'text' },
    options: { control: 'object' },
  },
} satisfies Meta<typeof NotificationSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
];

export const Playground: Story = {
  args: {
    id: 'notification',
    label: '알림 설정',
    options: defaultOptions,
  },
  render: (args) => {
    const [value, setValue] = useState<number>(10);
    return <NotificationSelect {...args} value={value} onChange={setValue} />;
  },
};

export const WithInitialValue: Story = {
  args: {
    id: 'notification',
    label: '알림 설정',
    options: defaultOptions,
  },
  render: (args) => {
    const [value, setValue] = useState<number>(60);
    return <NotificationSelect {...args} value={value} onChange={setValue} />;
  },
};

export const ManyOptions: Story = {
  args: {
    id: 'notification',
    label: '알림 설정',
    options: Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1) * 5,
      label: `${(i + 1) * 5}분 전`,
    })),
  },
  render: (args) => {
    const [value, setValue] = useState<number>((args.options as { value: number }[])[0].value);
    return <NotificationSelect {...args} value={value} onChange={setValue} />;
  },
};
