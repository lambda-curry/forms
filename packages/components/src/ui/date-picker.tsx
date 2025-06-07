import type * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { Calendar } from './calendar';
import { Button } from './button';

export type DatePickerProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};

function DatePicker(props: DatePickerProps) {
  return <Calendar data-slot="date-picker" {...props} />;
}

export { DatePicker };

