import React from "react";

import { DateRangePicker } from "rsuite";

interface Props {
  selectDate: (value: any) => void;
  value: [Date, Date];
}

export const TradeDatePicker = ({ value, selectDate }: Props) => {
  return (
    <DateRangePicker
      value={value}
      placeholder="Select Date Range"
      placement="bottomEnd"
      onOk={(value: [Date, Date]) => selectDate(value)}
      onClean={() => selectDate([])}
      showOneCalendar
    />
  );
};
