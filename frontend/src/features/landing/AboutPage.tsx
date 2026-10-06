import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ShieldCheck, Users, BarChart2, Target, Zap, Globe } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Logo } from '../../components/ui/Logo';

const team = [
    { name: 'Varun', role: 'Co-Founder & CEO', color: 'from-violet-500 to-purple-600', initials: 'V', bio: 'Visionary behind Snyprr.ai. 8+ years in algorithmic trading and financial product design.' },
    { name: 'Prince', role: 'CTO', color: 'from-blue-500 to-cyan-500', initials: 'P', bio: 'Full-stack architect with deep expertise in real-time data systems and trading infrastructure.' },
    { name: 'Gaurav', role: 'Head of Product', color: 'from-emerald-500 to-teal-500', initials: 'G', bio: 'Product thinker who bridges trader needs with intuitive platform experiences.' },
    { name: 'Sahil', role: 'Lead Engineer', color: 'from-orange-500 to-amber-500', initials: 'S', bio: "Frontend and systems engineer, leading the platform's performance and reliability." },
    { name: 'Vikrant', role: 'Co-Founder', color: 'from-rose-500 to-pink-500', initials: 'Vk', bio: 'Operations and strategy lead, ensuring TradeBeast scales across global markets.' },
    { name: 'Priyansu', role: 'Growth & Marketing', color: 'from-indigo-500 to-blue-500', initials: 'PR', bio: 'Growth strategist driving community building, partnerships, and brand presence.' },
];

const values = [
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Verified Transparency', desc: 'Every prediction is published with full entry, exit, and zone levels. No hidden signals, no vanishing calls.' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Track Record First', desc: 'We hold our analysts accountable with live win-rate tracking. Performance is public and immutable.' },
    { icon: <Users className="w-6 h-6" />, title: 'Community Driven', desc: 'Thousands of traders rely on our desk. We build for them — constantly iterating based on feedback.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Execution-Free', desc: 'TradeBeast is purely predictions and intelligence. No brokerage, no execution noise — just pure signal.' },
    { icon: <BarChart2 className="w-6 h-6" />, title: 'Data Integrity', desc: 'Market data, candle feeds, and analytics are sourced from verified providers with zero manipulation.' },
    { icon: <Globe className="w-6 h-6" />, title: 'Global Access', desc: 'Crypto, forex, and commodities — all time zones, all markets. Built for the global retail trader.' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
            <div className="fixed top-[-180px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[var(--brand-primary)]/8 blur-[150px] pointer-events-none" />

            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3.5">
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <Logo className="h-8 object-contain" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link to="/">
                            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Home</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="primary" size="sm">Sign Up Free</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Content ── */}
            <main className="max-w-6xl mx-auto px-5 sm:px-8 py-16 space-y-24">

                {/* Hero */}
                <section className="text-center max-w-3xl mx-auto space-y-6">
                    <span className="inline-flex items-center text-xs font-semibold px-3.5 py-1 rounded-full bg-[var(--brand-glow)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 uppercase tracking-wider">
                        Our Story
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                        Built by traders,
                        <span className="block neo-glow-text">for traders.</span>
                    </h1>
                    <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                        Snyprr.ai was born out of frustration with noise — signals buried in Telegram groups, unverifiable calls,
                        and influencers with no accountability. We built the platform we wished existed: verified predictions,
                        transparent track records, and zero execution pressure.
                    </p>
                </section>

                {/* Mission */}
                <section className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-5">
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Our Mission</h2>
                        <p className="text-[var(--text-muted)] leading-relaxed">
                            To make high-conviction, verified trading intelligence accessible to every retail trader on the planet —
                            regardless of their experience level, capital size, or time zone.
                        </p>
                        <p className="text-[var(--text-muted)] leading-relaxed">
                            We don't execute trades. We don't manage money. We publish predictions, track outcomes, and let the
                            numbers speak for themselves.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Link to="/signup"><Button variant="primary" size="md">Start Free Trial</Button></Link>
                            <Link to="/contact-us"><Button variant="secondary" size="md">Contact Us</Button></Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Published Predictions', value: '1,200+', color: 'text-[var(--brand-primary)]' },
                            { label: 'Historical Win Rate', value: '76.4%', color: 'text-[var(--color-success)]' },
                            { label: 'Active Subscribers', value: '2,500+', color: 'text-[var(--color-info)]' },
                            { label: 'Avg Risk / Reward', value: '1 : 2.8', color: 'text-[var(--brand-primary)]' },
                        ].map((s) => (
                            <GlassCard key={s.label} hoverEffect={false} className="p-5 text-center space-y-1">
                                <p className={`text-2xl font-extrabold font-mono-num ${s.color}`}>{s.value}</p>
                                <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Values */}
                <section className="space-y-10">
                    <div className="text-center">
                        <p className="text-xs font-medium text-[var(--brand-primary)] uppercase tracking-widest mb-2">What We Stand For</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Our Core Values</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {values.map((v) => (
                            <GlassCard key={v.title} className="p-6 space-y-3">
                                <div className="w-11 h-11 rounded-xl bg-[var(--brand-glow)] text-[var(--brand-primary)] flex items-center justify-center">
                                    {v.icon}
                                </div>
                                <h3 className="text-sm font-bold text-[var(--text-primary)]">{v.title}</h3>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{v.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section className="space-y-10">
                    <div className="text-center">
                        <p className="text-xs font-medium text-[var(--brand-primary)] uppercase tracking-widest mb-2">The People Behind It</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Meet the Team</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-3 max-w-xl mx-auto">
                            A tight-knit team of traders, engineers, and product builders united by one goal.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map((m) => (
                            <GlassCard key={m.name} className="p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                        <span className="text-white text-lg font-extrabold">{m.initials}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{m.name}</h3>
                                        <p className="text-xs text-[var(--brand-primary)] font-medium">{m.role}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{m.bio}</p>
                                <div className={`h-0.5 w-12 rounded-full bg-gradient-to-r ${m.color} opacity-60 mt-auto`} />
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <GlassCard className="max-w-2xl mx-auto py-12 px-8">
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Ready to join us?</h2>
                        <p className="text-[var(--text-muted)] mb-8 text-sm">Start your 15-day free trial. No credit card required.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link to="/signup"><Button variant="primary" size="lg">Start Free Trial</Button></Link>
                            <Link to="/contact-us"><Button variant="secondary" size="lg">Get in Touch</Button></Link>
                        </div>
                    </GlassCard>
                </section>

            </main>
        </div>
    );
}
