import clsx from 'clsx';

export default function Logo({ className }) {
  return (
    <div className={clsx('flex items-center gap-2 font-display font-bold', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-amber-400 text-accent-ink text-sm">
        H
      </span>
      <span className="text-ink-50">
        Hire<span className="gradient-text">ly</span>
      </span>
    </div>
  );
}
