import { FormControl, FormLabel, TextField, Tooltip } from '@mui/material';
import React from 'react';

interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  errorMessage?: string | null;
}

export default function TimeField({
  id,
  label,
  value,
  onChange,
  onBlur,
  errorMessage,
}: TimeFieldProps) {
  return (
    <FormControl fullWidth>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Tooltip title={errorMessage || ''} open={!!errorMessage} placement="top">
        <TextField
          id={id}
          size="small"
          type="time"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={!!errorMessage}
        />
      </Tooltip>
    </FormControl>
  );
}
