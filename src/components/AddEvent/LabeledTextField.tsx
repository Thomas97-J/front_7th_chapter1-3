import { FormControl, FormLabel, TextField } from '@mui/material';
import React from 'react';

interface LabeledTextFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.InputHTMLAttributes<unknown>['type'];
  size?: 'small' | 'medium';
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  labelId?: string; // CategorySelect 스타일과 동일하게 labelId 허용
}

export default function LabeledTextField({
  id,
  label,
  value,
  onChange,
  type,
  size = 'small',
  inputProps,
  labelId,
}: LabeledTextFieldProps) {
  const computedLabelId = labelId ?? `${id}-label`;
  return (
    <FormControl fullWidth>
      <FormLabel id={computedLabelId} htmlFor={id}>
        {label}
      </FormLabel>
      <TextField
        id={id}
        size={size}
        type={type}
        value={value}
        onChange={onChange}
        slotProps={{ htmlInput: inputProps }}
      />
    </FormControl>
  );
}
