import { useState } from 'react';

import { Event } from '../types';

export interface DragDropState {
  draggedEvent: Event | null;
  isDragging: boolean;
}

export const useDragAndDrop = (
  events: Event[],
  onEventMove: (eventId: string, newDate: string) => void,
  onRecurringEventDragAttempt: () => void
) => {
  const [dragState, setDragState] = useState<DragDropState>({
    draggedEvent: null,
    isDragging: false,
  });

  const handleDragStart = (event: Event) => {
    // 반복 일정인 경우 드래그 시작 전에 체크
    if (event.repeat.type !== 'none' && event.repeat.interval > 0) {
      onRecurringEventDragAttempt();
      return;
    }

    setDragState({
      draggedEvent: event,
      isDragging: true,
    });
  };

  const handleDragEnd = () => {
    setDragState({
      draggedEvent: null,
      isDragging: false,
    });
  };

  const handleDrop = (targetDate: string) => {
    if (!dragState.draggedEvent) return;

    // 같은 날짜로 드롭하면 무시
    if (dragState.draggedEvent.date === targetDate) {
      handleDragEnd();
      return;
    }

    onEventMove(dragState.draggedEvent.id, targetDate);
    handleDragEnd();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // 드롭 허용
  };

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
  };
};
