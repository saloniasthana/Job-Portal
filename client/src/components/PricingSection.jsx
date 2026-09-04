import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import Card from './ui/Card';
import Button from './ui/Button';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Try Hirely with a single active listing.',
    features: ['1 active job posting', 'Listed for 30 days', 'Applicant inbox', 'Standard support'],
    cta: 'Get started free',
    featured: false,
  },
  {
    name: 'Growth',
    price: '₹1,499',
    period: 'one-time',
    description: 'For teams hiring for a few roles at once.',
    features: [
      '5 job postings',
      'Featured placement for 14 days',
      'AI match scoring on applicants',
      'Full applicant tracking dashboard',
    ],
    cta: 'Get Growth',
    featured: true,
  },
  {
    name: 'Scale',
    price: '₹4,999',
    period: 'one-time',
    description: 'For high-volume hiring across many roles.',
    features: [
      'Unlimited job postings for 90 days',
      'Priority placement across search & categories',
      'AI matching + candidate insights',
      'Dedicated onboarding support',
    ],
    cta: 'Get Scale',
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-ink-50">Simple, one-time pricing</h2>
        <p className="mt-1.5 text-sm text-ink-400">
          Pay once per package — no subscriptions, no auto-renewal.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3 items-start">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card
              className={clsx(
                'h-full flex flex-col relative',
                plan.featured && 'border-brand-400/50 shadow-glow'
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1 text-xs font-medium text-white">
                  <Sparkles className="h-3 w-3" /> Most popular
                </span>
              )}

              <h3 className="font-display font-semibold text-ink-50">{plan.name}</h3>
              <p className="mt-1 text-sm text-ink-400">{plan.description}</p>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-bold text-ink-50">{plan.price}</span>
                {plan.period && <span className="text-sm text-ink-400">{plan.period}</span>}
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-ink-300">
                    <Check className="h-4 w-4 shrink-0 text-mint-500 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                as={Link}
                to="/register"
                variant={plan.featured ? 'primary' : 'secondary'}
                className="mt-8 w-full"
              >
                {plan.cta}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
