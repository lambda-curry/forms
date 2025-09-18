// Main exports from both remix-hook-form and ui directories

// Add scroll-to-error utilities
export { scrollToFirstError } from './utils/scrollToError';
export type { ScrollToErrorOptions } from './utils/scrollToError';

// Export all components from remix-hook-form
export * from './remix-hook-form';

// Explicitly export Textarea from both locations to handle naming conflicts
// The remix-hook-form Textarea is a form-aware wrapper
export { Textarea as TextareaField } from './remix-hook-form/textarea';
