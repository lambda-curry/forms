import * as React from 'react';
import { Select, type SelectProps } from './select';
import { US_STATES } from '../ui/data/us-states';

export type USStateSelectProps = Omit<SelectProps, 'options'>;

export function USStateSelect(props: USStateSelectProps) {
  return (
    <Select
      {...props}
      options={US_STATES}
      placeholder="Select a state"
    />
  );
}

