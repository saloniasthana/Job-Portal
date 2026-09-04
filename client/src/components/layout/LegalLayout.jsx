import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../Logo';
import Footer from './Footer';

export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <Logo />
        <Link to="/" className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100">
          <ArrowLeft className="h-3.5 w-3.5" /> Home
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 flex-1 w-full">
        <h1 className="font-display text-3xl font-bold text-ink-50">{title}</h1>
        <p className="mt-1.5 text-sm text-ink-500">Last updated {updated}</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-300 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink-100 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
