import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function ZkPage({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <main
      className={cn(
        'min-h-dvh flex flex-col bg-gradient-to-br from-base-300/40 via-base-200 to-base-100',
        className
      )}
      {...props}
    />
  );
}

export default ZkPage;
