import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function ZkPage({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <main
      className={cn(
        'min-h-dvh flex flex-col bg-gradient-to-br from-black via-black to-[#1a0000]',
        className
      )}
      {...props}
    />
  );
}

export default ZkPage;
