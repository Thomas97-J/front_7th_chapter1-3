import { FormControl, FormLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import React from 'react';

import { RepeatType } from '../../types';

interface RepeatSectionProps {
  repeatType: RepeatType;
  setRepeatType: (v: RepeatType) => void;
  repeatInterval: number;
  setRepeatInterval: (v: number) => void;
  repeatEndDate: string;
  setRepeatEndDate: (v: string) => void;
}

export default function RepeatSection({
  repeatType,
  setRepeatType,
  repeatInterval,
  setRepeatInterval,
  repeatEndDate,
  setRepeatEndDate,
}: RepeatSectionProps) {
  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <FormLabel>반복 유형</FormLabel>
        <Select
          size="small"
          value={repeatType}
          data-testid="repeat-type-select"
          aria-label="반복 유형"
          onChange={(e) => setRepeatType(e.target.value as RepeatType)}
        >
          <MenuItem value="daily" aria-label="daily-option">
            매일
          </MenuItem>
          <MenuItem value="weekly" aria-label="weekly-option">
            매주
          </MenuItem>
          <MenuItem value="monthly" aria-label="monthly-option">
            매월
          </MenuItem>
          <MenuItem value="yearly" aria-label="yearly-option">
            매년
          </MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="repeat-interval">반복 간격</FormLabel>
          <TextField
            id="repeat-interval"
            size="small"
            type="number"
            value={repeatInterval}
            onChange={(e) => setRepeatInterval(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="repeat-end-date">반복 종료일</FormLabel>
          <TextField
            id="repeat-end-date"
            size="small"
            type="date"
            value={repeatEndDate}
            onChange={(e) => setRepeatEndDate(e.target.value)}
          />
        </FormControl>
      </Stack>
    </Stack>
  );
}
