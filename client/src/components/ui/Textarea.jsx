import { forwardRef } from 'react';
import clsx from 'clsx';

const Textarea = forwardRef(function Textarea({ label, error, className, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-200">{label}</span>}
      <textarea
        ref={ref}
        className={clsx(
          'w-full rounded-xl bg-ink-900/60 border border-mist/10 px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-400',
          'outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 resize-none',
          error && 'border-coral-500/60',
          className
        )}
        {...props}
      />
      {error && <span className="mt-1.5 block text-xs text-coral-500">{error}</span>}
    </label>
  );
});

export default Textarea;
