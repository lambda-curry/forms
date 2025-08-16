import * as React from 'react';
import { RegionSelect, type RegionSelectProps } from './region-select';
import { CANADA_PROVINCES } from '../ui/data/canada-provinces';

export type CanadaProvinceSelectProps = Omit<RegionSelectProps, 'options'>;

export function CanadaProvinceSelect(props: CanadaProvinceSelectProps) {
  return (
    <RegionSelect
      {...props}
      options={CANADA_PROVINCES}
      placeholder="Select a province"
    />
  );
}

