import { CANADA_PROVINCES } from './data/canada-provinces';
import { Select, type SelectProps } from './select';

export type CanadaProvinceSelectProps = Omit<SelectProps, 'options'>;

export function CanadaProvinceSelect(props: CanadaProvinceSelectProps) {
  return <Select options={CANADA_PROVINCES} placeholder="Select a province" {...props} />;
}
