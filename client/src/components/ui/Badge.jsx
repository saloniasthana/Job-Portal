import clsx from 'clsx';

const tones = {
  neutral: 'bg-mist/8 text-ink-200',
  brand: 'bg-brand-500/15 text-brand-300',
  amber: 'bg-amber-500/15 text-amber-400',
  mint: 'bg-mint-500/15 text-mint-500',
  coral: 'bg-coral-500/15 text-coral-500',
};

export default function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
