import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Event } from '../../types';

import EventDialog from './index';

const meta = {
  title: 'Components/EventDialog',
  component: EventDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onClose: { action: 'closed' },
    onConfirm: { action: 'confirmed' },
  },
} satisfies Meta<typeof EventDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

const singleOverlappingEvent: Event = {
  id: '1',
  title: '기존 회의',
  date: '2025-11-15',
  startTime: '10:00',
  endTime: '11:00',
  description: '주간 회의',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

const multipleOverlappingEvents: Event[] = [
  {
    id: '1',
    title: '팀 스탠드업',
    date: '2025-11-15',
    startTime: '09:30',
    endTime: '10:00',
    description: '일일 스탠드업',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '프로젝트 미팅',
    date: '2025-11-15',
    startTime: '10:00',
    endTime: '11:30',
    description: '프로젝트 진행상황 논의',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '3',
    title: '점심 약속',
    date: '2025-11-15',
    startTime: '11:00',
    endTime: '12:00',
    description: '고객과 점심 미팅',
    location: '레스토랑',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

/**
 * EventDialog의 기본 상태입니다. 다이얼로그가 닫혀있는 상태입니다.
 */
export const Default: Story = {
  args: {
    open: false,
    overlappingEvents: [],
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * 단일 일정과 겹치는 경우의 경고 다이얼로그입니다.
 */
export const SingleOverlap: Story = {
  args: {
    open: true,
    overlappingEvents: [singleOverlappingEvent],
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * 여러 일정과 겹치는 경우의 경고 다이얼로그입니다.
 */
export const MultipleOverlaps: Story = {
  args: {
    open: true,
    overlappingEvents: multipleOverlappingEvents,
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * 인터랙티브한 예제입니다. 버튼을 클릭하여 다이얼로그를 열고 닫을 수 있습니다.
 */
export const Interactive: Story = {
  render: function InteractiveRender(args) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          일정 겹침 다이얼로그 열기
        </button>
        <EventDialog
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose?.();
          }}
          onConfirm={() => {
            setOpen(false);
            args.onConfirm?.();
          }}
          overlappingEvents={multipleOverlappingEvents}
        />
      </>
    );
  },
  args: {
    open: false,
    overlappingEvents: [],
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * 반복 일정과 겹치는 경우의 경고 다이얼로그입니다.
 */
export const WithRecurringEvent: Story = {
  args: {
    open: true,
    overlappingEvents: [
      {
        id: '1',
        title: '매일 스탠드업',
        date: '2025-11-15',
        startTime: '09:00',
        endTime: '09:30',
        description: '매일 반복되는 스탠드업 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'daily', interval: 1, endDate: '2025-12-31' },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '주간 회의',
        date: '2025-11-15',
        startTime: '09:30',
        endTime: '10:30',
        description: '주간 팀 회의',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
        notificationTime: 10,
      },
    ],
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * 긴 제목과 설명을 가진 일정과 겹치는 경우입니다.
 */
export const WithLongContent: Story = {
  args: {
    open: true,
    overlappingEvents: [
      {
        id: '1',
        title: '매우 긴 제목을 가진 중요한 프로젝트 킥오프 미팅 - 2025년 Q4 로드맵 논의',
        date: '2025-11-15',
        startTime: '14:00',
        endTime: '16:00',
        description: '매우 긴 설명이 포함된 일정입니다.',
        location: '본사 대회의실 3층 301호',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ],
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * 다양한 카테고리의 일정들과 겹치는 경우입니다.
 */
export const MixedCategories: Story = {
  args: {
    open: true,
    overlappingEvents: [
      {
        id: '1',
        title: '업무 회의',
        date: '2025-11-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '업무 관련 회의',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '개인 약속',
        date: '2025-11-15',
        startTime: '09:30',
        endTime: '10:30',
        description: '개인 일정',
        location: '카페',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '가족 모임',
        date: '2025-11-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '가족과의 시간',
        location: '집',
        category: '가족',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '기타 일정',
        date: '2025-11-15',
        startTime: '10:30',
        endTime: '11:30',
        description: '기타 카테고리',
        location: '미정',
        category: '기타',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ],
    onClose: () => {},
    onConfirm: () => {},
  },
};
