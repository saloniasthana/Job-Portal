import clsx from 'clsx';

export default function Card({ className, children, ...props }) {
  return (
    <div className={clsx('glass-panel rounded-2xl p-6', className)} {...props}>
      {children}
    </div>
  );
}
