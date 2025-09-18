import type { FieldErrors } from 'react-hook-form';

export interface ScrollToErrorOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  offset?: number;
  shouldFocus?: boolean;
  retryAttempts?: number;
  selectors?: string[];
}

const DEFAULT_ERROR_SELECTORS = [
  '[data-slot="form-message"]', // Target error message first (best UX)
  '[data-slot="form-control"][aria-invalid="true"]', // Input with error state
];

const findFirstErrorElement = (selectors: string[]): HTMLElement | null => {
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      return element;
    }
  }
  return null;
};

const scrollToElement = (element: HTMLElement, offset: number, behavior: ScrollBehavior): void => {
  const elementRect = element.getBoundingClientRect();
  const offsetTop = elementRect.top + window.pageYOffset - offset;

  window.scrollTo({
    top: Math.max(0, offsetTop),
    behavior,
  });
};

const focusElement = (element: HTMLElement, shouldFocus: boolean, behavior: ScrollBehavior): void => {
  if (shouldFocus && element.focus) {
    setTimeout(() => element.focus(), behavior === 'smooth' ? 300 : 0);
  }
};

export const scrollToFirstError = (errors: FieldErrors, options: ScrollToErrorOptions = {}) => {
  const {
    behavior = 'smooth',
    offset = 80,
    shouldFocus = true,
    retryAttempts = 3,
    selectors = DEFAULT_ERROR_SELECTORS,
  } = options;

  if (Object.keys(errors).length === 0) return false;

  const attemptScroll = (attempt = 0): boolean => {
    const selectorList = selectors.length > 0 ? selectors : DEFAULT_ERROR_SELECTORS;
    const element = findFirstErrorElement(selectorList);
    if (element) {
      scrollToElement(element, offset, behavior);
      focusElement(element, shouldFocus, behavior);
      return true;
    }

    // Retry for async rendering (common with Remix)
    if (attempt < retryAttempts) {
      setTimeout(() => attemptScroll(attempt + 1), 100);
      return true;
    }

    console.warn('Could not find any form error elements to scroll to');
    return false;
  };

  return attemptScroll();
};
