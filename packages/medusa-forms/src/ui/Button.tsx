import { Button as MedusaButton } from '@medusajs/ui';
import type { ComponentPropsWithoutRef } from 'react';

export { MedusaButton as Button };

// Define ButtonProps based on Medusa UI Button component
export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'transparent' | 'secondary' | 'danger';
  size?: 'small' | 'base' | 'large' | 'xlarge';
  isLoading?: boolean;
  asChild?: boolean;
}
