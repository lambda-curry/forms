import type * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { Calendar } from './calendar';

export type DatePickerProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Calendar>['buttonVariant'];
};

function DatePicker({ 
  className, 
  classNames, 
  showOutsideDays = true, 
  captionLayout = 'dropdown',
  buttonVariant = 'ghost',
  ...props 
}: DatePickerProps) {
  return (
    <Calendar
      showOutsideDays={showOutsideDays}
      className={className}
      classNames={classNames}
      captionLayout={captionLayout}
      buttonVariant={buttonVariant}
      data-slot="date-picker"
      {...props}
    />
  );
}

export { DatePicker };

