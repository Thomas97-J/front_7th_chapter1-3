import { Button, Checkbox, FormControl, FormControlLabel, Stack, Typography } from '@mui/material';
import React from 'react';

import CategorySelect from './CategorySelect';
import LabeledTextField from './LabeledTextField';
import NotificationSelect from './NotificationSelect';
import RepeatSection from './RepeatSection';
import TimeField from './TimeField';
import { Event, RepeatType } from '../../types';
import { getTimeErrorMessage } from '../../utils/timeValidation';

const categories = ['업무', '개인', '가족', '기타'];

const notificationOptions = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
];

interface AddEventProps {
  title: string;
  setTitle: (_value: string) => void;
  date: string;
  setDate: (_value: string) => void;
  startTime: string;
  endTime: string;
  description: string;
  setDescription: (_value: string) => void;
  location: string;
  setLocation: (_value: string) => void;
  category: string;
  setCategory: (_value: string) => void;
  isRepeating: boolean;
  setIsRepeating: (_value: boolean) => void;
  repeatType: RepeatType;
  setRepeatType: (_value: RepeatType) => void;
  repeatInterval: number;
  setRepeatInterval: (_value: number) => void;
  repeatEndDate: string;
  setRepeatEndDate: (_value: string) => void;
  notificationTime: number;
  setNotificationTime: (_value: number) => void;
  startTimeError: string | null;
  endTimeError: string | null;
  editingEvent: Event | null;
  handleStartTimeChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  addOrUpdateEvent: () => void;
}

function AddEvent({
  title,
  setTitle,
  date,
  setDate,
  startTime,
  endTime,
  description,
  setDescription,
  location,
  setLocation,
  category,
  setCategory,
  isRepeating,
  setIsRepeating,
  repeatType,
  setRepeatType,
  repeatInterval,
  setRepeatInterval,
  repeatEndDate,
  setRepeatEndDate,
  notificationTime,
  setNotificationTime,
  startTimeError,
  endTimeError,
  editingEvent,
  handleStartTimeChange,
  handleEndTimeChange,
  addOrUpdateEvent,
}: AddEventProps) {
  return (
    <Stack spacing={2} sx={{ width: '20%' }}>
      <Typography variant="h4">{editingEvent ? '일정 수정' : '일정 추가'}</Typography>

      <LabeledTextField
        id="title"
        label="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <LabeledTextField
        id="date"
        label="날짜"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="date"
      />

      <Stack direction="row" spacing={2}>
        <TimeField
          id="start-time"
          label="시작 시간"
          value={startTime}
          onChange={handleStartTimeChange}
          onBlur={() => getTimeErrorMessage(startTime, endTime)}
          errorMessage={startTimeError}
        />
        <TimeField
          id="end-time"
          label="종료 시간"
          value={endTime}
          onChange={handleEndTimeChange}
          onBlur={() => getTimeErrorMessage(startTime, endTime)}
          errorMessage={endTimeError}
        />
      </Stack>

      <LabeledTextField
        id="description"
        label="설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <LabeledTextField
        id="location"
        label="위치"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <CategorySelect value={category} onChange={setCategory} options={categories} />

      {!editingEvent && (
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isRepeating}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsRepeating(checked);
                  if (checked) {
                    setRepeatType('daily');
                  } else {
                    setRepeatType('none');
                  }
                }}
              />
            }
            label="반복 일정"
          />
        </FormControl>
      )}

      {isRepeating && !editingEvent && (
        <RepeatSection
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          repeatInterval={repeatInterval}
          setRepeatInterval={setRepeatInterval}
          repeatEndDate={repeatEndDate}
          setRepeatEndDate={setRepeatEndDate}
        />
      )}

      <NotificationSelect
        value={notificationTime}
        onChange={setNotificationTime}
        options={notificationOptions}
      />

      <Button
        data-testid="event-submit-button"
        onClick={addOrUpdateEvent}
        variant="contained"
        color="primary"
      >
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </Stack>
  );
}

export default AddEvent;
