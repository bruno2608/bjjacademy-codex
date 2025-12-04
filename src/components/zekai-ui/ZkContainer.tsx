import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function ZkContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8', className)} {...props} />;
}

export default ZkContainer;
