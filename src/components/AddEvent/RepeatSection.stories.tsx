import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import RepeatSection from './RepeatSection';
import type { RepeatType } from '../../types';

const meta = {
  title: 'AddEvent/RepeatSection',
  component: RepeatSection,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RepeatSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [repeatType, setRepeatType] = useState<RepeatType>('daily');
    const [repeatInterval, setRepeatInterval] = useState<number>(1);
    const [repeatEndDate, setRepeatEndDate] = useState<string>('2025-11-30');

    return (
      <RepeatSection
        repeatType={repeatType}
        setRepeatType={setRepeatType}
        repeatInterval={repeatInterval}
        setRepeatInterval={setRepeatInterval}
        repeatEndDate={repeatEndDate}
        setRepeatEndDate={setRepeatEndDate}
      />
    );
  },
};

export const Weekly: Story = {
  render: () => {
    const [repeatType, setRepeatType] = useState<RepeatType>('weekly');
    const [repeatInterval, setRepeatInterval] = useState<number>(1);
    const [repeatEndDate, setRepeatEndDate] = useState<string>('2025-12-31');

    return (
      <RepeatSection
        repeatType={repeatType}
        setRepeatType={setRepeatType}
        repeatInterval={repeatInterval}
        setRepeatInterval={setRepeatInterval}
        repeatEndDate={repeatEndDate}
        setRepeatEndDate={setRepeatEndDate}
      />
    );
  },
};

export const MonthlyWithEnd: Story = {
  render: () => {
    const [repeatType, setRepeatType] = useState<RepeatType>('monthly');
    const [repeatInterval, setRepeatInterval] = useState<number>(2);
    const [repeatEndDate, setRepeatEndDate] = useState<string>('2026-01-31');

    return (
      <RepeatSection
        repeatType={repeatType}
        setRepeatType={setRepeatType}
        repeatInterval={repeatInterval}
        setRepeatInterval={setRepeatInterval}
        repeatEndDate={repeatEndDate}
        setRepeatEndDate={setRepeatEndDate}
      />
    );
  },
};

export const YearlyNoEnd: Story = {
  render: () => {
    const [repeatType, setRepeatType] = useState<RepeatType>('yearly');
    const [repeatInterval, setRepeatInterval] = useState<number>(1);
    const [repeatEndDate, setRepeatEndDate] = useState<string>('');

    return (
      <RepeatSection
        repeatType={repeatType}
        setRepeatType={setRepeatType}
        repeatInterval={repeatInterval}
        setRepeatInterval={setRepeatInterval}
        repeatEndDate={repeatEndDate}
        setRepeatEndDate={setRepeatEndDate}
      />
    );
  },
};