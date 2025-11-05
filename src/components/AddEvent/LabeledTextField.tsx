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
}

export default function LabeledTextField({
  id,
  label,
  value,
  onChange,
  type,
  size = 'small',
  inputProps,
}: LabeledTextFieldProps) {
  return (
    <FormControl fullWidth>
      <FormLabel htmlFor={id}>{label}</FormLabel>
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
