import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Briefcase, User, Building2, ChevronDown } from 'lucide-react';
import Logo from '../Logo';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-mist/8 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to={user?.role === 'recruiter' ? '/recruiter' : '/jobs'}>
          <Logo />
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to={user.role === 'recruiter' ? '/recruiter' : '/jobs'}
              className="flex items-center gap-1.5 text-sm text-ink-300 hover:text-ink-50"
            >
              {user.role === 'recruiter' ? (
                <LayoutDashboard className="h-4 w-4" />
              ) : (
                <Briefcase className="h-4 w-4" />
              )}
              {user.role === 'recruiter' ? 'Dashboard' : 'Jobs'}
            </Link>

            {user.role === 'recruiter' && (
              <Link
                to="/recruiter/companies"
                className="flex items-center gap-1.5 text-sm text-ink-300 hover:text-ink-50"
              >
                <Building2 className="h-4 w-4" />
                Companies
              </Link>
            )}

            <ThemeToggle />

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full bg-mist/5 py-1 pl-1 pr-2.5 hover:bg-mist/8"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-amber-400 text-xs font-semibold text-accent-ink">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="text-sm text-ink-200">{user.name?.split(' ')[0]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-ink-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl glass-panel bg-ink-900/95 p-1.5">
                  {user.role === 'candidate' && (
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-200 hover:bg-mist/8"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-200 hover:bg-mist/8"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/jobs" className="text-sm text-ink-300 hover:text-ink-50">
              Browse jobs
            </Link>
            <ThemeToggle />
            <Button as={Link} to="/login" variant="ghost" size="sm">
              Log in
            </Button>
            <Button as={Link} to="/register" size="sm">
              Get started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
