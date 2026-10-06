import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Logo } from '../../components/ui/Logo';

const LAST_UPDATED = 'September 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <GlassCard hoverEffect={false} className="p-6 space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">{title}</h2>
            <div className="text-sm text-[var(--text-muted)] leading-relaxed space-y-2">{children}</div>
        </GlassCard>
    );
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
            <div className="fixed top-[-180px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[var(--brand-primary)]/8 blur-[150px] pointer-events-none" />

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3.5">
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <Logo className="h-8 object-contain" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link to="/">
                            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-5 sm:px-8 py-16 space-y-6">

                {/* Header */}
                <div className="text-center space-y-3 pb-6 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center justify-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-[var(--brand-primary)]" />
                        <h1 className="text-3xl font-extrabold tracking-tight">Terms &amp; Conditions</h1>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">Last updated: {LAST_UPDATED}</p>
                    <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
                        Please read these terms carefully before using Snyprr.ai. By accessing or using the platform you agree to be bound by these terms.
                    </p>
                </div>

                {/* Sections */}
                <Section title="1. Nature of the Service">
                    <p>
                        TradeBeast is a <strong className="text-[var(--text-primary)]">prediction and market analysis platform only</strong>.
                        We do not execute trades, manage funds, provide brokerage services, or act as a financial adviser.
                    </p>
                    <p>
                        All signals, forecasts, buying zones, selling zones, and analysis published on the platform are for
                        <strong className="text-[var(--text-primary)]"> informational and educational purposes only</strong>.
                        Nothing on TradeBeast constitutes financial advice, investment advice, or a solicitation to buy or sell any financial instrument.
                    </p>
                </Section>

                <Section title="2. AI-Powered Analysis & Human Oversight">
                    <p>
                        TradeBeast uses <strong className="text-[var(--text-primary)]">AI-assisted analysis</strong> to generate market signals, price zone calculations, and risk/reward assessments.
                        Our proprietary models analyse real-time market data, technical indicators, and historical patterns to produce the signals you see on the platform.
                    </p>
                    <p>
                        <strong className="text-[var(--text-primary)]">Human involvement and oversight:</strong> All AI-generated signals are reviewed, validated, and approved by our in-house team of analysts before being published to the platform.
                        Our analysts reserve the right to modify, delay, or suppress any AI-generated signal if it does not meet our quality, risk, or accuracy standards.
                    </p>
                    <p>
                        The displayed "win rates" and "track records" reflect the historical performance of signals that were published, including both AI-generated and analyst-reviewed outputs.
                        Past performance is not indicative of future results.
                    </p>
                    <p>
                        By using TradeBeast, you acknowledge that:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>AI models can produce incorrect, biased, or incomplete outputs.</li>
                        <li>Human review does not guarantee the accuracy or profitability of any signal.</li>
                        <li>All trading and investment decisions remain solely your responsibility.</li>
                    </ul>
                </Section>

                <Section title="3. No Financial Advice">
                    <p>
                        TradeBeast is not a registered investment adviser, broker-dealer, or financial institution in any jurisdiction.
                        The content on this platform does not constitute personalised financial advice.
                    </p>
                    <p>
                        You should consult a qualified financial adviser before making any investment decisions.
                        Trading financial markets involves substantial risk of loss and is not suitable for all investors.
                    </p>
                </Section>

                <Section title="4. Subscription Tiers & Access">
                    <p>
                        TradeBeast offers multiple subscription tiers (FREE, PRO, VIP). Access to AI Analysis signals, detailed breakdowns,
                        and premium features is gated by subscription tier. Tier differences are clearly indicated within the platform.
                    </p>
                    <p>
                        All paid plans include a 15-day free trial. You may cancel at any time before the trial ends without being charged.
                        Refunds after the trial period are at Snyprr.ai's discretion.
                    </p>
                </Section>

                <Section title="5. Accuracy Disclaimer">
                    <p>
                        While we strive for accuracy, TradeBeast does not warrant that any signal, forecast, price zone, or analysis
                        is accurate, complete, or fit for any particular purpose. Markets are inherently unpredictable and no analytical
                        system can guarantee profitable outcomes.
                    </p>
                    <p>
                        TradeBeast and its AI systems, analysts, and affiliates are not liable for any losses, damages, or costs
                        arising from your reliance on any information provided on the platform.
                    </p>
                </Section>

                <Section title="6. Intellectual Property">
                    <p>
                        All content, signals, analysis, branding, and software on Snyprr.ai are the intellectual property of
                        Snyprr.ai Inc. and may not be reproduced, redistributed, or resold without written permission.
                    </p>
                </Section>

                <Section title="7. User Conduct">
                    <p>You agree not to:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Share your account credentials with third parties.</li>
                        <li>Resell, redistribute, or republish Snyprr.ai signals or analysis.</li>
                        <li>Use automated scrapers or bots to extract content from the platform.</li>
                        <li>Attempt to reverse-engineer our AI models or trading algorithms.</li>
                    </ul>
                </Section>

                <Section title="8. Privacy & Data">
                    <p>
                        TradeBeast collects user data (email, usage patterns, subscription information) to provide and improve the service.
                        We do not sell personal data to third parties. Full details are available in our Privacy Policy.
                    </p>
                </Section>

                <Section title="9. Changes to These Terms">
                    <p>
                        TradeBeast reserves the right to update these terms at any time. Continued use of the platform after changes
                        constitutes acceptance of the updated terms. Material changes will be communicated via email or in-platform notification.
                    </p>
                </Section>

                <Section title="10. Governing Law">
                    <p>
                        These terms are governed by applicable laws. Any disputes shall be resolved through binding arbitration
                        or in the courts of the jurisdiction where Snyprr.ai Inc. is registered.
                    </p>
                </Section>

                {/* Footer CTA */}
                <div className="text-center pt-6 space-y-3">
                    <p className="text-xs text-[var(--text-muted)]">
                        Questions about these terms?{' '}
                        <Link to="/contact-us" className="text-[var(--brand-primary)] hover:underline">Contact us</Link>
                    </p>
                    <Link to="/signup">
                        <Button variant="primary" size="md">Get Started — 15 Days Free</Button>
                    </Link>
                </div>

            </main>
        </div>
    );
}
