import { ErrorMessage } from '@hookform/error-message';
import { Tooltip } from '@medusajs/ui';
import clsx from 'clsx';
import type { MultipleFieldErrors } from 'react-hook-form';
import type { BasicFieldProps } from './types';

type Props = {
  className?: BasicFieldProps['errorClassName'];
  name: BasicFieldProps['name'];
  errors: BasicFieldProps['formErrors'];
};

const MultipleMessages = ({ messages }: { messages: MultipleFieldErrors }) => {
  const errors = Object.entries(messages).map(([_, message]) => message);

  const displayedError = errors[0];
  const remainderErrors = errors.slice(1);

  return (
    <div className="flex cursor-default items-center gap-x-1">
      <p>{displayedError}</p>
      {remainderErrors?.length > 0 && (
        <Tooltip
          content={
            <div className="txt-compact-xsmall text-rose-50">
              {remainderErrors.map((e, i) => {
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is the best option here
                  <p key={i}>
                    {Array.from(new Array(remainderErrors.length)).map((_) => '*')}
                    {e}
                  </p>
                );
              })}
            </div>
          }
        >
          <p>
            +{remainderErrors.length} {remainderErrors.length > 1 ? 'errors' : 'error'}
          </p>
        </Tooltip>
      )}
    </div>
  );
};

export const FieldError = ({ errors, name, className }: Props) => {
  if (!(errors && name)) return null;

  return (
    <ErrorMessage
      name={name}
      errors={errors}
      render={({ message, messages }) => {
        return (
          <div className={clsx('txt-compact-xsmall !leading-snug mt-2 text-red-500', className)}>
            {messages ? <MultipleMessages messages={messages} /> : <p>{message}</p>}
          </div>
        );
      }}
    />
  );
};
