import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import type { Event, RepeatType } from '../../types';
import { getTimeErrorMessage } from '../../utils/timeValidation';

import AddEvent from './index';

const meta = {
  title: 'AddEvent/AddEvent',
  component: AddEvent,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AddEvent>;

export default meta;

type Story = StoryObj<typeof meta>;

function useAddEventState(
  initial?: Partial<Event>,
  repeatInitial?: {
    isRepeating?: boolean;
    repeatType?: RepeatType;
    repeatInterval?: number;
    repeatEndDate?: string;
  }
) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [date, setDate] = useState(initial?.date ?? '');
  const [startTime, setStartTime] = useState(initial?.startTime ?? '');
  const [endTime, setEndTime] = useState(initial?.endTime ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [category, setCategory] = useState(initial?.category ?? '업무');
  const [isRepeating, setIsRepeating] = useState(repeatInitial?.isRepeating ?? false);
  const [repeatType, setRepeatType] = useState<RepeatType>(repeatInitial?.repeatType ?? 'none');
  const [repeatInterval, setRepeatInterval] = useState(repeatInitial?.repeatInterval ?? 1);
  const [repeatEndDate, setRepeatEndDate] = useState(repeatInitial?.repeatEndDate ?? '');
  const [notificationTime, setNotificationTime] = useState(10);
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);
  const [editingEvent] = useState<Event | null>(null);

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setStartTime(v);
    const { startTimeError: sErr, endTimeError: eErr } = getTimeErrorMessage(v, endTime);
    setStartTimeError(sErr);
    setEndTimeError(eErr);
  };
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setEndTime(v);
    const { startTimeError: sErr, endTimeError: eErr } = getTimeErrorMessage(startTime, v);
    setStartTimeError(sErr);
    setEndTimeError(eErr);
  };

  const addOrUpdateEvent = () => {
    // 데모용: 현재 상태를 콘솔로 출력
    console.log({
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      isRepeating,
      repeatType,
      repeatInterval,
      repeatEndDate,
      notificationTime,
      editingEvent,
    });
  };

  return {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    addOrUpdateEvent,
  } as const;
}

export const Default: Story = {
  render: function DefaultRender() {
    const state = useAddEventState();
    return <AddEvent {...state} />;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

export const WithInitialValues: Story = {
  render: function WithInitialValuesRender() {
    const state = useAddEventState({
      title: '팀 회의',
      date: '2025-11-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '주간 팀 회의',
      location: '회의실 A',
      category: '업무',
    });
    return <AddEvent {...state} />;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

export const DailyRepeat: Story = {
  render: function DailyRepeatRender() {
    const state = useAddEventState(
      {
        title: '매일 반복 회의',
        date: '2025-11-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '매일 반복되는 스탠드업 미팅',
        location: '회의실 A',
        category: '업무',
      },
      {
        isRepeating: true,
        repeatType: 'daily',
        repeatInterval: 1,
        repeatEndDate: '2025-11-30',
      }
    );

    return <AddEvent {...state} />;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

export const EditingMode: Story = {
  render: function EditingModeRender() {
    const state = useAddEventState({
      title: '편집 중 일정',
      date: '2025-11-16',
      startTime: '14:00',
      endTime: '15:00',
      description: '설명',
      location: '회의실 B',
      category: '개인',
    });

    const editing: Event = {
      id: '100',
      title: state.title,
      date: state.date,
      startTime: state.startTime,
      endTime: state.endTime,
      description: state.description,
      location: state.location,
      category: state.category,
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    // 편집 모드 표시용으로 state 내부 editingEvent를 대체
    // @ts-expect-error read-only cast for story convenience
    state.editingEvent = editing;

    return <AddEvent {...state} />;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
