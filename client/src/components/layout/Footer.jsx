import { Link } from 'react-router-dom';
import Logo from '../Logo';

export default function Footer() {
  return (
    <footer className="border-t border-mist/8 mt-16">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-6 text-xs text-ink-400">
          <Link to="/privacy" className="hover:text-ink-100">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-ink-100">
            Terms of Service
          </Link>
          <span>© {new Date().getFullYear()} Hirely. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
