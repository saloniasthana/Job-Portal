import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const highlights = [
  { icon: Target, text: 'AI match scores show exactly how well you fit a role' },
  { icon: Users, text: 'Recruiters track applicants on a live Kanban pipeline' },
  { icon: Sparkles, text: 'Ask the assistant for jobs in plain English' },
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-mist/8">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, var(--color-hero-glow-1), transparent 55%), radial-gradient(circle at 80% 80%, var(--color-hero-glow-2), transparent 45%)',
          }}
        />
        <Link to="/">
          <Logo />
        </Link>

        <div className="max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight text-ink-50">
            Job hunting, <span className="gradient-text">minus the guesswork.</span>
          </h1>
          <p className="mt-4 text-ink-300">
            Hirely scores every application against the job so candidates know where they stand and recruiters see signal, not noise.
          </p>

          <div className="mt-10 space-y-4">
            {highlights.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mist/8 border border-mist/10">
                  <Icon className="h-4 w-4 text-brand-300" />
                </span>
                <span className="text-sm text-ink-200">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-500">© {new Date().getFullYear()} Hirely. All rights reserved.</p>
      </div>

      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex lg:hidden justify-center">
            <Logo />
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
            <h2 className="font-display text-2xl font-semibold text-ink-50">{title}</h2>
            {subtitle && <p className="mt-1.5 text-sm text-ink-400">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
