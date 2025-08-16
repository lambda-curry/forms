import * as React from 'react';
import { RegionSelect, type RegionSelectProps } from './region-select';
import { US_STATES } from './data/us-states';

export type USStateSelectProps = Omit<RegionSelectProps, 'options'>;

export function USStateSelect(props: USStateSelectProps) {
  return (
    <RegionSelect
      options={US_STATES}
      placeholder="Select a state"
      {...props}
    />
  );
}

