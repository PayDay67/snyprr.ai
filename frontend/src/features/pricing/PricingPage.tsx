import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Sparkles, ShieldCheck, Gift, ArrowRight, Menu, X } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { useAuthStore } from '../../state/useAuthStore';
import { Skeleton } from '../../components/ui/Skeleton';
import { useSubscriptionPlans } from '../../hooks/useSubscriptionsQuery';

export default function PricingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { data: plansData, isLoading: plansLoading } = useSubscriptionPlans();
  const plans = plansData?.data ?? [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-x-clip">
      {/* Header Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-xl">
        <div className="relative flex items-center justify-between px-4 sm:px-6 md:px-10 py-3.5">
          <Link to="/" className="flex items-center gap-2 z-10">
            <img src="/tradebeast-logo.png" alt="Trade Beast" className="h-9 sm:h-10 w-auto object-contain" />
          </Link>

          {/* Desktop links - exactly centered */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto">
            <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
            <Link to="/pricing" className="text-[var(--brand-primary)] font-semibold border-b-2 border-[var(--brand-primary)] pb-0.5">Pricing</Link>
            <Link to="/#about" className="hover:text-[var(--text-primary)] transition-colors">About Us</Link>
            <Link to="/#community" className="hover:text-[var(--text-primary)] transition-colors">Connect With Us</Link>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 z-10">
            <ThemeToggle />

            {/* Desktop Auth */}
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger (visible on half-screen mode & mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel for half-screen mode */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 pt-2 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/95 backdrop-blur-2xl space-y-3">
            <div className="flex flex-col gap-1 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Home
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-[var(--brand-glow)] text-[var(--brand-primary)] font-semibold transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/#community"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Connect With Us
              </Link>
            </div>
            <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-2 sm:hidden">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full justify-center">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-14 space-y-10">
        {/* Trial Callout Banner */}
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-[var(--brand-glow)] via-[var(--bg-surface)] to-[var(--brand-glow)] border border-[var(--brand-primary)]/40 text-center flex items-center justify-center gap-3 shadow-lg">
          <Gift className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 animate-bounce" />
          <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
            <span className="text-[var(--brand-primary)] font-bold">15-Day Free Trial</span> on all plans. Full access, zero risk, cancel anytime.
          </p>
        </div>

        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">Simple, Transparent Pricing</h1>
          <p className="text-base text-[var(--text-muted)]">
            Follow verified prediction track records. Start free for 15 days with full access to high-conviction forecast alerts.
          </p>

          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[var(--brand-primary)] text-white shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Yearly <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md">2 Months Free</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plansLoading
            ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-3xl" />)
            : plans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceYearly / 12);
            return (
              <GlassCard
                key={plan.id}
                className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all ${
                  plan.isPopular ? 'border-[var(--brand-primary)] shadow-xl shadow-[var(--brand-glow)]' : ''
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 right-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--brand-primary)] text-white shadow-lg">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{plan.description}</p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold font-mono-num">${price}</span>
                      <span className="text-xs text-[var(--text-muted)]">/ month</span>
                      {billingCycle === 'yearly' && (
                        <span className="text-[10px] text-[var(--text-muted)] ml-2">
                          (billed ${plan.priceYearly}/yr)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-[var(--color-success)] mt-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 15-Day Free Trial ($0 due today)
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      What's Included
                    </p>
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                        <div className="w-4 h-4 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant={plan.isPopular ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full mt-8"
                  onClick={() => navigate(currentUser ? '/subscriptions' : '/signup')}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  {currentUser ? 'Manage in Subscriptions' : 'Start 15-Day Free Trial'}
                </Button>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
