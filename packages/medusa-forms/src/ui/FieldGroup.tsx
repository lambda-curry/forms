import clsx from 'clsx';
import type * as React from 'react';

export const FieldGroup = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={clsx('flex flex-col gap-y-small', className)}>{children}</div>;
};
