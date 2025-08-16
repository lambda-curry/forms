import * as React from 'react';
import { RegionSelect, type RegionSelectProps } from './region-select';
import { CANADA_PROVINCES } from './data/canada-provinces';

export type CanadaProvinceSelectProps = Omit<RegionSelectProps, 'options'>;

export function CanadaProvinceSelect(props: CanadaProvinceSelectProps) {
  return (
    <RegionSelect
      options={CANADA_PROVINCES}
      placeholder="Select a province"
      {...props}
    />
  );
}

