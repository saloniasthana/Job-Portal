import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(function Input({ label, error, icon: Icon, className, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-200">{label}</span>}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full rounded-xl bg-ink-900/60 border border-mist/10 px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-400',
            'outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20',
            Icon && 'pl-10',
            error && 'border-coral-500/60 focus:border-coral-500 focus:ring-coral-500/20',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="mt-1.5 block text-xs text-coral-500">{error}</span>}
    </label>
  );
});

export default Input;
