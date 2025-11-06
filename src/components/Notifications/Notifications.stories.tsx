import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Notifications from './index';

const meta = {
  title: 'Components/Notifications',
  component: Notifications,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    setNotifications: { action: 'notification dismissed' },
  },
} satisfies Meta<typeof Notifications>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 알림이 없는 기본 상태입니다.
 */
export const Default: Story = {
  args: {
    notifications: [],
    setNotifications: () => {},
  },
};

/**
 * 단일 알림이 표시되는 경우입니다.
 */
export const SingleNotification: Story = {
  args: {
    notifications: [
      {
        id: '1',
        message: '10분 후 팀 회의가 시작됩니다.',
      },
    ],
    setNotifications: () => {},
  },
};

/**
 * 여러 개의 알림이 동시에 표시되는 경우입니다.
 */
export const MultipleNotifications: Story = {
  args: {
    notifications: [
      {
        id: '1',
        message: '10분 후 팀 회의가 시작됩니다.',
      },
      {
        id: '2',
        message: '1시간 후 프로젝트 미팅이 있습니다.',
      },
      {
        id: '3',
        message: '점심 약속 시간입니다.',
      },
    ],
    setNotifications: () => {},
  },
};

/**
 * 긴 메시지를 포함한 알림입니다.
 */
export const LongMessage: Story = {
  args: {
    notifications: [
      {
        id: '1',
        message:
          '10분 후 중요한 프로젝트 킥오프 미팅이 시작됩니다. 회의실 A에서 진행되며, 관련 자료를 미리 준비해주세요.',
      },
    ],
    setNotifications: () => {},
  },
};

/**
 * 다양한 길이의 메시지를 가진 여러 알림입니다.
 */
export const MixedMessageLengths: Story = {
  args: {
    notifications: [
      {
        id: '1',
        message: '곧 회의 시작',
      },
      {
        id: '2',
        message: '1시간 후 프로젝트 미팅이 회의실 B에서 진행됩니다.',
      },
      {
        id: '3',
        message: '오후 3시 고객사 방문. 프레젠테이션 자료와 명함을 준비해주세요.',
      },
      {
        id: '4',
        message: '퇴근 전 일일 보고서 작성 필요',
      },
    ],
    setNotifications: () => {},
  },
};

/**
 * 인터랙티브한 예제입니다. 알림을 추가하고 닫기 버튼으로 제거할 수 있습니다.
 */
export const Interactive: Story = {
  render: function InteractiveRender() {
    const [notifications, setNotifications] = useState([
      {
        id: '1',
        message: '10분 후 팀 회의가 시작됩니다.',
      },
      {
        id: '2',
        message: '1시간 후 프로젝트 미팅이 있습니다.',
      },
    ]);

    const addNotification = () => {
      const newNotification = {
        id: String(Date.now()),
        message: `새로운 알림 - ${new Date().toLocaleTimeString('ko-KR')}`,
      };
      setNotifications((prev) => [...prev, newNotification]);
    };

    return (
      <div style={{ padding: '20px' }}>
        <button
          onClick={addNotification}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          알림 추가
        </button>
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            minHeight: '200px',
          }}
        >
          <p style={{ margin: 0, color: '#666' }}>
            알림은 화면 오른쪽 상단에 표시됩니다. X 버튼을 클릭하여 알림을 닫을 수 있습니다.
          </p>
        </div>
        <Notifications notifications={notifications} setNotifications={setNotifications} />
      </div>
    );
  },
  args: {
    notifications: [],
    setNotifications: () => {},
  },
};

/**
 * 많은 수의 알림이 표시되는 경우입니다.
 */
export const ManyNotifications: Story = {
  args: {
    notifications: Array.from({ length: 8 }, (_, i) => ({
      id: String(i + 1),
      message: `알림 ${i + 1}: ${i % 2 === 0 ? '회의' : '일정'} 알림입니다.`,
    })),
    setNotifications: () => {},
  },
};

/**
 * 시간대별 알림 예제입니다.
 */
export const TimeBasedNotifications: Story = {
  args: {
    notifications: [
      {
        id: '1',
        message: '1분 후: 긴급 회의가 시작됩니다!',
      },
      {
        id: '2',
        message: '10분 후: 팀 스탠드업 미팅',
      },
      {
        id: '3',
        message: '1시간 후: 프로젝트 리뷰',
      },
      {
        id: '4',
        message: '1일 후: 고객사 방문',
      },
    ],
    setNotifications: () => {},
  },
};

/**
 * 반복 일정 알림 예제입니다.
 */
export const RecurringEventNotifications: Story = {
  args: {
    notifications: [
      {
        id: '1',
        message: '매일 반복: 오전 스탠드업 미팅 (10분 후)',
      },
      {
        id: '2',
        message: '주간 반복: 팀 회의 (1시간 후)',
      },
      {
        id: '3',
        message: '월간 반복: 전사 회의 (1일 후)',
      },
    ],
    setNotifications: () => {},
  },
};

/**
 * 다양한 카테고리의 일정 알림입니다.
 */
export const CategoryNotifications: Story = {
  args: {
    notifications: [
      {
        id: '1',
        message: '[업무] 프로젝트 킥오프 미팅 (10분 후)',
      },
      {
        id: '2',
        message: '[개인] 병원 예약 (1시간 후)',
      },
      {
        id: '3',
        message: '[가족] 가족 저녁 식사 (2시간 후)',
      },
      {
        id: '4',
        message: '[기타] 헬스장 PT (3시간 후)',
      },
    ],
    setNotifications: () => {},
  },
};
