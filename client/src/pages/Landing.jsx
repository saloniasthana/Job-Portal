import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Target,
  KanbanSquare,
  MessageCircle,
  Code2,
  Server,
  Layers,
  BarChart3,
  Cloud,
  Palette,
  Briefcase,
  Bug,
  Megaphone,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/ui/ThemeToggle';
import Footer from '../components/layout/Footer';
import JobCard from '../components/jobs/JobCard';
import { api } from '../lib/api';
import { jobCategories } from '../lib/format';

const features = [
  {
    icon: Target,
    title: 'AI match scoring',
    desc: 'Every application gets a fit score plus the exact skills you\'re missing — no more guessing why you got rejected.',
  },
  {
    icon: KanbanSquare,
    title: 'Live Kanban pipeline',
    desc: 'Recruiters drag candidates through Applied → Shortlisted → Interview → Offer, updates land in real time.',
  },
  {
    icon: MessageCircle,
    title: 'Ask-anything job search',
    desc: '"Remote React jobs under 2 years exp" — the assistant retrieves real postings and links you straight to them.',
  },
];

const categoryIcons = {
  'Frontend Developer': Code2,
  'Backend Developer': Server,
  'Full Stack Developer': Layers,
  'Data Science': BarChart3,
  DevOps: Cloud,
  'UI/UX Design': Palette,
  'Product Management': Briefcase,
  'QA / Testing': Bug,
  Marketing: Megaphone,
  Sales: TrendingUp,
  Other: MoreHorizontal,
};

export default function Landing() {
  const { data: latestJobs, isLoading: loadingLatest } = useQuery({
    queryKey: ['latestJobs'],
    queryFn: async () => (await api.get('/jobs', { params: { limit: 6 } })).data.jobs,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button as={Link} to="/register" size="sm">
            Get started
          </Button>
          <Link to="/pricing" className="text-sm text-ink-300 hover:text-ink-50">
            Pricing
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full glass-panel px-3 py-1 text-xs text-brand-300"
        >
          <Sparkles className="h-3 w-3" />
          AI-matched applications
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 font-display text-5xl sm:text-6xl font-bold leading-[1.05] text-ink-50"
        >
          Find the role that
          <br />
          actually <span className="gradient-text">fits you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-ink-300"
        >
          Hirely scores your resume against every job description, tells recruiters who to talk to first,
          and turns "we'll be in touch" into a live pipeline you can actually see.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Button as={Link} to="/register" size="lg">
            Start free <ArrowRight className="h-4 w-4" />
          </Button>
          <Button as={Link} to="/login" variant="secondary" size="lg">
            I have an account
          </Button>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-mist/8">
                  <Icon className="h-5 w-5 text-brand-300" />
                </span>
                <h3 className="mt-4 font-display font-semibold text-ink-50">{title}</h3>
                <p className="mt-2 text-sm text-ink-400">{desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="font-display text-2xl font-semibold text-ink-50">Browse by category</h2>
        <p className="mt-1 text-sm text-ink-400">Jump straight to the roles you're interested in.</p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {jobCategories
            .filter((c) => c !== 'Other')
            .map((category) => {
              const Icon = categoryIcons[category];
              return (
                <Link
                  key={category}
                  to={`/jobs?category=${encodeURIComponent(category)}`}
                  className="group"
                >
                  <Card className="flex flex-col items-center gap-2.5 py-6 text-center group-hover:border-mist/16 transition-colors">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-mist/8 group-hover:bg-brand-500/15 transition-colors">
                      <Icon className="h-5 w-5 text-brand-300" />
                    </span>
                    <span className="text-xs font-medium text-ink-200">{category}</span>
                  </Card>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-50">Latest openings</h2>
            <p className="mt-1 text-sm text-ink-400">Fresh roles, straight from the source.</p>
          </div>
          <Link to="/jobs" className="text-sm text-brand-300 hover:text-brand-200">
            See all jobs →
          </Link>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loadingLatest
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl glass-panel animate-pulse" />
              ))
            : (latestJobs || []).slice(0, 6).map((job) => <JobCard key={job._id} job={job} mode="candidate" />)}
        </div>
      </section>

      <Footer />
    </div>
  );
}
