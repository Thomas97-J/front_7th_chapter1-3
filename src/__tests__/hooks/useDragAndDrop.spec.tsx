import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { Event } from '../../types';

describe('useDragAndDrop 훅 단위 테스트', () => {
  const mockEvents: Event[] = [
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
      date: '2025-10-16',
      startTime: '14:00',
      endTime: '15:00',
      description: '매일 반복',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'daily', interval: 1, endDate: '2025-10-20' },
      notificationTime: 10,
    },
  ];

  it('초기 상태에서 드래그 중이 아니어야 한다', () => {
    const onEventMove = vi.fn();
    const onRecurringEventDragAttempt = vi.fn();

    const { result } = renderHook(() =>
      useDragAndDrop(mockEvents, onEventMove, onRecurringEventDragAttempt)
    );

    expect(result.current.dragState.isDragging).toBe(false);
    expect(result.current.dragState.draggedEvent).toBeNull();
  });

  it('일반 일정을 드래그 시작하면 드래그 상태가 업데이트된다', () => {
    const onEventMove = vi.fn();
    const onRecurringEventDragAttempt = vi.fn();

    const { result } = renderHook(() =>
      useDragAndDrop(mockEvents, onEventMove, onRecurringEventDragAttempt)
    );

    act(() => {
      result.current.handleDragStart(mockEvents[0]);
    });

    expect(result.current.dragState.isDragging).toBe(true);
    expect(result.current.dragState.draggedEvent).toEqual(mockEvents[0]);
    expect(onRecurringEventDragAttempt).not.toHaveBeenCalled();
  });

  it('반복 일정을 드래그 시작하면 경고 콜백이 호출되고 드래그되지 않는다', () => {
    const onEventMove = vi.fn();
    const onRecurringEventDragAttempt = vi.fn();

    const { result } = renderHook(() =>
      useDragAndDrop(mockEvents, onEventMove, onRecurringEventDragAttempt)
    );

    act(() => {
      result.current.handleDragStart(mockEvents[1]);
    });

    expect(onRecurringEventDragAttempt).toHaveBeenCalledTimes(1);
    expect(result.current.dragState.isDragging).toBe(false);
    expect(result.current.dragState.draggedEvent).toBeNull();
  });

  it('드래그 종료 시 상태가 초기화된다', () => {
    const onEventMove = vi.fn();
    const onRecurringEventDragAttempt = vi.fn();

    const { result } = renderHook(() =>
      useDragAndDrop(mockEvents, onEventMove, onRecurringEventDragAttempt)
    );

    act(() => {
      result.current.handleDragStart(mockEvents[0]);
    });

    expect(result.current.dragState.isDragging).toBe(true);

    act(() => {
      result.current.handleDragEnd();
    });

    expect(result.current.dragState.isDragging).toBe(false);
    expect(result.current.dragState.draggedEvent).toBeNull();
  });

  it('다른 날짜로 드롭하면 이동 콜백이 호출된다', () => {
    const onEventMove = vi.fn();
    const onRecurringEventDragAttempt = vi.fn();

    const { result } = renderHook(() =>
      useDragAndDrop(mockEvents, onEventMove, onRecurringEventDragAttempt)
    );

    act(() => {
      result.current.handleDragStart(mockEvents[0]);
    });

    act(() => {
      result.current.handleDrop('2025-10-20');
    });

    expect(onEventMove).toHaveBeenCalledWith('1', '2025-10-20');
    expect(result.current.dragState.isDragging).toBe(false);
    expect(result.current.dragState.draggedEvent).toBeNull();
  });

  it('같은 날짜로 드롭하면 이동 콜백이 호출되지 않는다', () => {
    const onEventMove = vi.fn();
    const onRecurringEventDragAttempt = vi.fn();

    const { result } = renderHook(() =>
      useDragAndDrop(mockEvents, onEventMove, onRecurringEventDragAttempt)
    );

    act(() => {
      result.current.handleDragStart(mockEvents[0]);
    });

    act(() => {
      result.current.handleDrop('2025-10-15'); // 같은 날짜
    });

    expect(onEventMove).not.toHaveBeenCalled();
    expect(result.current.dragState.isDragging).toBe(false);
  });

  it('드래그 중인 이벤트가 없을 때 드롭하면 아무 일도 일어나지 않는다', () => {
    const onEventMove = vi.fn();
    const onRecurringEventDragAttempt = vi.fn();

    const { result } = renderHook(() =>
      useDragAndDrop(mockEvents, onEventMove, onRecurringEventDragAttempt)
    );

    act(() => {
      result.current.handleDrop('2025-10-20');
    });

    expect(onEventMove).not.toHaveBeenCalled();
  });

  it('handleDragOver는 preventDefault를 호출해야 한다', () => {
    const onEventMove = vi.fn();
    const onRecurringEventDragAttempt = vi.fn();

    const { result } = renderHook(() =>
      useDragAndDrop(mockEvents, onEventMove, onRecurringEventDragAttempt)
    );

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent;

    result.current.handleDragOver(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
