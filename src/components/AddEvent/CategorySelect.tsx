import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

interface CategorySelectProps {
  id?: string;
  labelId?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function CategorySelect({
  id = 'category',
  labelId = 'category-label',
  label = '카테고리',
  value,
  onChange,
  options,
}: CategorySelectProps) {
  return (
    <FormControl fullWidth>
      <FormLabel id={labelId}>{label}</FormLabel>
      <Select
        id={id}
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        aria-labelledby={labelId}
        aria-label={label}
      >
        {options.map((cat) => (
          <MenuItem key={cat} value={cat} aria-label={`${cat}-option`}>
            {cat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
