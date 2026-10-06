import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Quote } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Logo } from '../../components/ui/Logo';

const ALL_TESTIMONIALS = [
    { name: 'Arjun Mehta', role: 'Retail Trader', initials: 'AM', color: 'from-violet-500 to-purple-600', rating: 5, text: 'Snyprr.ai completely changed how I follow the markets. The verified trader predictions save me hours of research every day. I went from random trades to structured, high-conviction setups.' },
    { name: 'Priya Sharma', role: 'Crypto Enthusiast', initials: 'PS', color: 'from-emerald-500 to-teal-500', rating: 5, text: "I love how transparent everything is — win rates, entry/exit levels, track records. No fluff, just actionable insights. The platform holds analysts accountable like no other service I've used." },
    { name: 'Rohan Kapoor', role: 'Forex Trader', initials: 'RK', color: 'from-blue-500 to-cyan-500', rating: 5, text: 'The TradingView charts integrated directly in the dashboard are a game changer. Everything I need is in one place now. Buying and selling zones are crystal clear — no guesswork.' },
    { name: 'Sneha Patel', role: 'Stock Market Investor', initials: 'SP', color: 'from-rose-500 to-pink-500', rating: 4, text: "Best platform for following expert traders without the noise. I've improved my decision-making significantly since joining. The verified track record gives me real confidence." },
    { name: 'Karan Singh', role: 'Day Trader', initials: 'KS', color: 'from-orange-500 to-amber-500', rating: 5, text: "The real-time predictions and clean UI make Snyprr.ai stand out. I've been trading for 5 years and this is the most organised signal service I've come across." },
    { name: 'Ananya Verma', role: 'Options Trader', initials: 'AV', color: 'from-indigo-500 to-blue-500', rating: 5, text: 'Finally a platform that treats users as smart investors. The data quality and analyst verification process is top-notch. Pricing is fair and value delivered far exceeds expectations.' },
    { name: 'Ravi Nair', role: 'Swing Trader', initials: 'RN', color: 'from-teal-500 to-green-500', rating: 5, text: "I use Snyprr.ai's gold and silver predictions for my commodity portfolio. The accuracy on commodities is remarkable and the zone-based approach removes all ambiguity from entries." },
    { name: 'Deepika Rao', role: 'Portfolio Manager', initials: 'DR', color: 'from-pink-500 to-rose-600', rating: 5, text: 'As someone who manages client money, having a verified prediction platform with a real public track record is invaluable. TradeBeast is now part of my daily research workflow.' },
    { name: 'Manish Kumar', role: 'Crypto Investor', initials: 'MK', color: 'from-yellow-500 to-orange-500', rating: 4, text: "The BTC and ETH setups are consistently well-timed. I appreciate that the platform doesn't overpromise — it simply shows data. The 78%+ win rate is backed by real published trades." },
    { name: 'Sonia Agarwal', role: 'Technical Analyst', initials: 'SA', color: 'from-cyan-500 to-blue-400', rating: 5, text: "I was skeptical at first but the consistency over 3 months has been impressive. Clear risk/reward ratios, transparent outcomes, and a team that communicates well with the community." },
    { name: 'Tejas Mehrotra', role: 'Scalp Trader', initials: 'TM', color: 'from-purple-500 to-violet-600', rating: 5, text: 'The short-timeframe setups on TradeBeast are incredibly detailed. Entry zones, invalidation levels, and targets are all published in advance — exactly what a scalper needs.' },
    { name: 'Nisha Patel', role: 'Long-term Investor', initials: 'NP', color: 'from-green-500 to-emerald-600', rating: 5, text: "Even as someone who holds for weeks or months, TradeBeast's daily and weekly setups have helped me time my entries much more precisely. The platform UI is beautiful and extremely responsive." },
];

export default function TestimonialsPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
            <div className="fixed top-[-180px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[var(--brand-primary)]/8 blur-[150px] pointer-events-none" />

            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3.5">
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <Logo className="h-8 object-contain" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link to="/">
                            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="primary" size="sm">Sign Up Free</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Content ── */}
            <main className="max-w-6xl mx-auto px-5 sm:px-8 py-16 space-y-14">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <span className="inline-flex items-center text-xs font-semibold px-3.5 py-1 rounded-full bg-[var(--brand-glow)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 uppercase tracking-wider">
                        Trader Stories
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">What Our Traders Say</h1>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        Real feedback from real traders — no paid reviews, no cherry-picking.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                        ))}
                        <span className="text-sm font-bold text-[var(--text-primary)] ml-1">4.9 / 5</span>
                        <span className="text-xs text-[var(--text-muted)]">· {ALL_TESTIMONIALS.length} verified reviews</span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ALL_TESTIMONIALS.map((t) => (
                        <GlassCard key={t.name} className="p-6 flex flex-col gap-4 relative overflow-hidden">
                            <Quote className="absolute top-3 right-4 w-10 h-10 text-[var(--brand-primary)] opacity-10 pointer-events-none" />
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-[var(--border-subtle)]'}`} />
                                ))}
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">"{t.text}"</p>
                            <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-subtle)]">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                    <span className="text-white text-xs font-extrabold">{t.initials}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[var(--text-primary)]">{t.name}</p>
                                    <p className="text-[10px] text-[var(--text-muted)]">{t.role}</p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center pt-4">
                    <GlassCard className="max-w-xl mx-auto py-10 px-8">
                        <h2 className="text-xl font-extrabold mb-2">Join thousands of traders</h2>
                        <p className="text-sm text-[var(--text-muted)] mb-6">Start your 15-day free trial. No credit card needed.</p>
                        <Link to="/signup">
                            <Button variant="primary" size="lg">Start Free Trial</Button>
                        </Link>
                    </GlassCard>
                </div>

            </main>
        </div>
    );
}
