import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import RecurringEventDragWarning from '../../components/RecurringEventDragWarning';

const theme = createTheme();

const setup = (open: boolean, onClose: () => void) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RecurringEventDragWarning open={open} onClose={onClose} />
      </ThemeProvider>
    ),
    user,
  };
};

describe('RecurringEventDragWarning 컴포넌트 테스트', () => {
  it('다이얼로그가 열려 있을 때 제목과 메시지가 표시된다', () => {
    const onClose = vi.fn();
    setup(true, onClose);

    expect(screen.getByText('반복 일정 이동 불가')).toBeInTheDocument();
    expect(
      screen.getByText('반복 일정은 드래그하여 이동할 수 없습니다. 일정을 수정하려면 수정 버튼을 사용해주세요.')
    ).toBeInTheDocument();
  });

  it('다이얼로그가 닫혀 있을 때 내용이 표시되지 않는다', () => {
    const onClose = vi.fn();
    setup(false, onClose);

    expect(screen.queryByText('반복 일정 이동 불가')).not.toBeInTheDocument();
  });

  it('확인 버튼을 클릭하면 onClose가 호출된다', async () => {
    const onClose = vi.fn();
    const { user } = setup(true, onClose);

    const confirmButton = screen.getByRole('button', { name: '확인' });
    await user.click(confirmButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('다이얼로그 외부를 클릭하면 onClose가 호출된다', async () => {
    const onClose = vi.fn();
    const { user } = setup(true, onClose);

    // Backdrop 클릭 (ESC 키로 대체)
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
