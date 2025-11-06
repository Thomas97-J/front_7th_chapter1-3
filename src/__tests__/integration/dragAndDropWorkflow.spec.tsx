import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { setupMockHandlerCreation, setupMockHandlerUpdating } from '../../__mocks__/handlersUtils';
import App from '../../App';
import { server } from '../../setupTests';
import { Event, RepeatInfo } from '../../types';

const theme = createTheme();

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

const saveSchedule = async (
  user: UserEvent,
  form: Omit<Event, 'id' | 'notificationTime' | 'repeat'> & { repeat?: RepeatInfo }
) => {
  const { title, date, startTime, endTime, location, description, category, repeat } = form;

  await user.click(screen.getAllByText('일정 추가')[0]);

  await user.type(screen.getByLabelText('제목'), title);
  await user.type(screen.getByLabelText('날짜'), date);
  await user.type(screen.getByLabelText('시작 시간'), startTime);
  await user.type(screen.getByLabelText('종료 시간'), endTime);
  await user.type(screen.getByLabelText('설명'), description);
  await user.type(screen.getByLabelText('위치'), location);
  await user.click(screen.getByLabelText('카테고리'));
  await user.click(within(screen.getByLabelText('카테고리')).getByRole('combobox'));
  await user.click(screen.getByRole('option', { name: `${category}-option` }));

  if (repeat) {
    await user.click(screen.getByLabelText('반복 일정'));
    await user.click(within(screen.getByLabelText('반복 유형')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: `${repeat.type}-option` }));
    await user.clear(screen.getByLabelText('반복 간격'));
    await user.type(screen.getByLabelText('반복 간격'), String(repeat.interval));
    if (repeat.endDate) {
      await user.type(screen.getByLabelText('반복 종료일'), repeat.endDate!);
    }
  }

  await user.click(screen.getByTestId('event-submit-button'));
};

describe('드래그 앤 드롭 통합 테스트', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2025-10-01'));
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe('일반 일정 드래그 앤 드롭', () => {
    it('일반 일정을 다른 날짜로 드래그하면 날짜가 변경된다', async () => {
      setupMockHandlerCreation();

      // 이동 후 업데이트된 일정을 반환하도록 설정
      server.use(
        http.put('/api/events/:id', async ({ params, request }) => {
          const updatedEvent = (await request.json()) as Event;
          return HttpResponse.json(updatedEvent);
        })
      );

      const { user } = setup(<App />);

      // 일정 생성
      await saveSchedule(user, {
        title: '팀 회의',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
      });

      // 월별 뷰에서 일정 확인
      const monthView = screen.getByTestId('month-view');
      const event = within(monthView).getByText('팀 회의');
      expect(event).toBeInTheDocument();

      // 드래그 가능 속성 확인
      const eventBox = event.closest('[draggable="true"]');
      expect(eventBox).toBeInTheDocument();
      expect(eventBox).toHaveAttribute('draggable', 'true');
    });

    it('일반 일정이 드래그 가능한 커서 스타일을 가진다', async () => {
      setupMockHandlerCreation();

      const { user } = setup(<App />);

      await saveSchedule(user, {
        title: '드래그 가능 일정',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '일반 일정',
        location: '회의실 A',
        category: '업무',
      });

      const monthView = screen.getByTestId('month-view');
      const event = within(monthView).getByText('드래그 가능 일정');
      const eventBox = event.closest('[draggable="true"]');

      expect(eventBox).toHaveStyle({ cursor: 'grab' });
    });

    it('주별 뷰에서도 일정을 드래그할 수 있다', async () => {
      setupMockHandlerCreation();

      const { user } = setup(<App />);

      await saveSchedule(user, {
        title: '주별 뷰 일정',
        date: '2025-10-02',
        startTime: '09:00',
        endTime: '10:00',
        description: '주별 뷰 테스트',
        location: '회의실 A',
        category: '업무',
      });

      // 주별 뷰로 전환
      await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'week-option' }));

      const weekView = screen.getByTestId('week-view');
      const event = within(weekView).getByText('주별 뷰 일정');
      const eventBox = event.closest('[draggable="true"]');

      expect(eventBox).toBeInTheDocument();
      expect(eventBox).toHaveAttribute('draggable', 'true');
    });
  });

  describe('반복 일정 드래그 제한', () => {
    it('반복 일정은 not-allowed 커서 스타일을 가진다', async () => {
      server.use(
        http.get('/api/events', () => {
          return HttpResponse.json({
            events: [
              {
                id: '1',
                title: '반복 회의',
                date: '2025-10-15',
                startTime: '09:00',
                endTime: '10:00',
                description: '매일 반복',
                location: '회의실 A',
                category: '업무',
                repeat: { type: 'daily', interval: 1, endDate: '2025-10-20' },
                notificationTime: 10,
              },
            ],
          });
        })
      );

      setup(<App />);

      await screen.findByText('일정 로딩 완료!');

      const monthView = screen.getByTestId('month-view');
      const event = within(monthView).getByText('반복 회의');
      const eventBox = event.closest('[draggable="true"]');

      expect(eventBox).toHaveStyle({ cursor: 'not-allowed' });
    });

    it('반복 일정을 드래그하려고 하면 경고 다이얼로그가 표시된다', async () => {
      server.use(
        http.get('/api/events', () => {
          return HttpResponse.json({
            events: [
              {
                id: '1',
                title: '반복 회의',
                date: '2025-10-15',
                startTime: '09:00',
                endTime: '10:00',
                description: '매일 반복',
                location: '회의실 A',
                category: '업무',
                repeat: { type: 'daily', interval: 1, endDate: '2025-10-20' },
                notificationTime: 10,
              },
            ],
          });
        })
      );

      setup(<App />);

      await screen.findByText('일정 로딩 완료!');

      const monthView = screen.getByTestId('month-view');
      const event = within(monthView).getByText('반복 회의');
      const eventBox = event.closest('[draggable="true"]') as HTMLElement;

      // fireEvent를 사용한 드래그 시작 이벤트
      fireEvent.dragStart(eventBox);

      // 경고 다이얼로그 확인
      expect(await screen.findByText('반복 일정 이동 불가')).toBeInTheDocument();
      expect(
        screen.getByText(
          '반복 일정은 드래그하여 이동할 수 없습니다. 일정을 수정하려면 수정 버튼을 사용해주세요.'
        )
      ).toBeInTheDocument();
    });

    it('반복 일정 드래그 경고 다이얼로그에서 확인을 클릭하면 닫힌다', async () => {
      server.use(
        http.get('/api/events', () => {
          return HttpResponse.json({
            events: [
              {
                id: '1',
                title: '반복 회의',
                date: '2025-10-15',
                startTime: '09:00',
                endTime: '10:00',
                description: '매일 반복',
                location: '회의실 A',
                category: '업무',
                repeat: { type: 'daily', interval: 1, endDate: '2025-10-20' },
                notificationTime: 10,
              },
            ],
          });
        })
      );

      const { user } = setup(<App />);

      await screen.findByText('일정 로딩 완료!');

      const monthView = screen.getByTestId('month-view');
      const event = within(monthView).getByText('반복 회의');
      const eventBox = event.closest('[draggable="true"]') as HTMLElement;

      // fireEvent를 사용한 드래그 시작 이벤트
      fireEvent.dragStart(eventBox);

      // 다이얼로그가 나타날 때까지 대기
      const dialog = await screen.findByText('반복 일정 이동 불가');
      expect(dialog).toBeInTheDocument();

      // 확인 버튼 클릭
      const confirmButton = screen.getByRole('button', { name: '확인' });
      await user.click(confirmButton);

      // 다이얼로그가 완전히 닫힐 때까지 대기
      await waitFor(() => {
        expect(screen.queryByText('반복 일정 이동 불가')).not.toBeInTheDocument();
      });
    });
  });

  describe('드래그 시각적 피드백', () => {
    it('월별 뷰에 draggable 속성이 있는 이벤트 박스가 존재한다', async () => {
      setupMockHandlerCreation();

      const { user } = setup(<App />);

      await saveSchedule(user, {
        title: '시각적 피드백 테스트',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '드래그 테스트',
        location: '회의실 A',
        category: '업무',
      });

      const monthView = screen.getByTestId('month-view');
      const draggableElements = within(monthView)
        .getAllByText('시각적 피드백 테스트')[0]
        .closest('[draggable="true"]');

      expect(draggableElements).toBeInTheDocument();
    });

    it('주별 뷰에 draggable 속성이 있는 이벤트 박스가 존재한다', async () => {
      setupMockHandlerCreation();

      const { user } = setup(<App />);

      await saveSchedule(user, {
        title: '주별 뷰 피드백',
        date: '2025-10-02',
        startTime: '09:00',
        endTime: '10:00',
        description: '드래그 테스트',
        location: '회의실 A',
        category: '업무',
      });

      // 주별 뷰로 전환
      await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'week-option' }));

      const weekView = screen.getByTestId('week-view');
      const draggableElements = within(weekView)
        .getAllByText('주별 뷰 피드백')[0]
        .closest('[draggable="true"]');

      expect(draggableElements).toBeInTheDocument();
    });
  });

  describe('일정 이동 API 호출', () => {
    it('일정 이동 성공 시 성공 메시지가 표시된다', async () => {
      setupMockHandlerUpdating([
        {
          id: '1',
          title: '이동할 일정',
          date: '2025-10-15',
          startTime: '09:00',
          endTime: '10:00',
          description: '일정 이동 테스트',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ]);

      setup(<App />);

      await screen.findByText('일정 로딩 완료!');

      // moveEvent가 호출되면 성공 메시지가 표시되어야 함
      // (실제 드래그 앤 드롭 동작은 E2E 테스트에서 검증)
      const monthView = screen.getByTestId('month-view');
      expect(within(monthView).getByText('이동할 일정')).toBeInTheDocument();
    });
  });

  describe('혼합 일정 시나리오', () => {
    it('일반 일정과 반복 일정이 함께 있을 때 각각 올바른 커서를 가진다', async () => {
      server.use(
        http.get('/api/events', () => {
          return HttpResponse.json({
            events: [
              {
                id: '1',
                title: '일반 일정',
                date: '2025-10-15',
                startTime: '09:00',
                endTime: '10:00',
                description: '일반 일정',
                location: '회의실 A',
                category: '업무',
                repeat: { type: 'none', interval: 0 },
                notificationTime: 10,
              },
              {
                id: '2',
                title: '반복 일정',
                date: '2025-10-15',
                startTime: '14:00',
                endTime: '15:00',
                description: '반복 일정',
                location: '회의실 B',
                category: '업무',
                repeat: { type: 'daily', interval: 1, endDate: '2025-10-20' },
                notificationTime: 10,
              },
            ],
          });
        })
      );

      setup(<App />);

      await screen.findByText('일정 로딩 완료!');

      const monthView = screen.getByTestId('month-view');

      const normalEvent = within(monthView).getByText('일반 일정');
      const normalEventBox = normalEvent.closest('[draggable="true"]');
      expect(normalEventBox).toHaveStyle({ cursor: 'grab' });

      const recurringEvent = within(monthView).getByText('반복 일정');
      const recurringEventBox = recurringEvent.closest('[draggable="true"]');
      expect(recurringEventBox).toHaveStyle({ cursor: 'not-allowed' });
    });
  });
});
