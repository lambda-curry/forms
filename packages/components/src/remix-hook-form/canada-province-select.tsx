import * as React from 'react';
import { Select, type SelectProps } from './select';
import { CANADA_PROVINCES } from '../ui/data/canada-provinces';

export type CanadaProvinceSelectProps = Omit<SelectProps, 'options'>;

export function CanadaProvinceSelect(props: CanadaProvinceSelectProps) {
  return (
    <Select
      {...props}
      options={CANADA_PROVINCES}
      placeholder="Select a province"
    />
  );
}

