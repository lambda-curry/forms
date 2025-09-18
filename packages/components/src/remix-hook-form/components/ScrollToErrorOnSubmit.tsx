import { type UseScrollToErrorOnSubmitOptions, useScrollToErrorOnSubmit } from '../hooks/useScrollToErrorOnSubmit';

export interface ScrollToErrorOnSubmitProps extends UseScrollToErrorOnSubmitOptions {
  className?: string;
}

export const ScrollToErrorOnSubmit = ({ className, ...options }: ScrollToErrorOnSubmitProps) => {
  useScrollToErrorOnSubmit(options);

  // Return null or hidden div - follows existing patterns
  return className ? <div className={className} aria-hidden="true" /> : null;
};

ScrollToErrorOnSubmit.displayName = 'ScrollToErrorOnSubmit';
