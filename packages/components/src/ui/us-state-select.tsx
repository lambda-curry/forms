import * as React from 'react';
import { Select, type SelectProps } from './select';
import { US_STATES } from './data/us-states';

export type USStateSelectProps = Omit<SelectProps, 'options'>;

export function USStateSelect(props: USStateSelectProps) {
  return (
    <Select
      options={US_STATES}
      placeholder="Select a state"
      {...props}
    />
  );
}

