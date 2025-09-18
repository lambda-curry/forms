import { US_STATES } from './data/us-states';
import { Select, type SelectProps } from './select';

export type USStateSelectProps = Omit<SelectProps, 'options'>;

export function USStateSelect(props: USStateSelectProps) {
  return <Select options={US_STATES} placeholder="Select a state" {...props} />;
}
