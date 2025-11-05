import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

interface Option {
  value: number;
  label: string;
}

interface NotificationSelectProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  options: Option[];
}

export default function NotificationSelect({
  id = 'notification',
  label = '알림 설정',
  value,
  onChange,
  options,
}: NotificationSelectProps) {
  return (
    <FormControl fullWidth>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Select
        id={id}
        size="small"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        data-testid="notification-select"
      >
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value} data-testid={`notification-option-${o.value}`}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
