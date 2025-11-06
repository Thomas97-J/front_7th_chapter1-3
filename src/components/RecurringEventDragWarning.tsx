import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface RecurringEventDragWarningProps {
  open: boolean;
  onClose: () => void;
}

function RecurringEventDragWarning({ open, onClose }: RecurringEventDragWarningProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>반복 일정 이동 불가</DialogTitle>
      <DialogContent>
        <DialogContentText>
          반복 일정은 드래그하여 이동할 수 없습니다. 일정을 수정하려면 수정 버튼을 사용해주세요.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RecurringEventDragWarning;
