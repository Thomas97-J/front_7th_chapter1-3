export const useDateClick = (setDate: (_value: string) => void) => {
  const handleDateClick = (dateString: string) => {
    setDate(dateString);
  };

  return {
    handleDateClick,
  };
};
