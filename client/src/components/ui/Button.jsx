import clsx from 'clsx';

const variants = {
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow hover:brightness-110 active:brightness-95',
  secondary: 'glass-panel text-ink-100 hover:bg-mist/8',
  ghost: 'text-ink-300 hover:text-ink-50 hover:bg-mist/5',
  danger: 'bg-coral-500/15 text-coral-500 border border-coral-500/30 hover:bg-coral-500/25',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <Comp
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      )}
      {children}
    </Comp>
  );
}
