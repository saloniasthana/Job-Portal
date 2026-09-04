import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import PricingSection from '../components/PricingSection';
import Footer from '../components/layout/Footer';

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button as={Link} to="/register" size="sm">
            Get started
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="pt-12 flex-1">
        <PricingSection />
      </div>

      <Footer />
    </div>
  );
}
