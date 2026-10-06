import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, MessageSquare, Headphones, Send, Clock, ShieldCheck, CheckCircle2, HelpCircle, Code2, Terminal } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../state/useAuthStore';
import { useUIStore } from '../../state/useUIStore';

export default function ContactPage() {
  const { currentUser, activeRole } = useAuthStore();
  const { addToast } = useUIStore();
  const [searchParams] = useSearchParams();
  const isDevDept = searchParams.get('dept') === 'dev' || (activeRole === 'TRADER' && searchParams.get('dept') !== 'support');

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [category, setCategory] = useState(isDevDept ? 'TECHNICAL' : 'GENERAL');
  const [subject, setSubject] = useState(isDevDept ? 'Developer Team / Technical Inquiry' : '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isDevDept) {
      setCategory('TECHNICAL');
      if (!subject) setSubject('Developer Team / Technical Inquiry');
    }
  }, [isDevDept]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      addToast({
        type: 'success',
        title: isDevDept ? 'Developer Ticket Dispatched 🛠️' : 'Message Dispatched 🚀',
        message: isDevDept
          ? 'Thank you! Our engineering team has received your ticket and will investigate shortly.'
          : 'Thank you! Our support team has received your inquiry and will respond within 2 hours.',
      });
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--brand-glow)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30">
          {isDevDept ? 'ENGINEERING & DEVELOPER DESK' : '24/7 SUPPORT DESK'}
        </span>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
          {isDevDept ? 'Contact the Developer Team' : 'Contact Trade Beast Support'}
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          {isDevDept
            ? 'Direct line for verified traders and analysts to connect with our core engineering team for platform bugs, API feeds, or charting requests.'
            : "Have a question about subscriptions, analyst verification, or platform features? We're here to help."}
        </p>
      </div>

      {/* Support Channels Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard hoverEffect={false} className={`p-5 rounded-2xl flex flex-col items-start gap-3 ${isDevDept ? 'border-[var(--brand-primary)]/40 bg-[var(--brand-glow)]/10' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-glow)] text-[var(--brand-primary)] flex items-center justify-center">
            {isDevDept ? <Code2 className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">{isDevDept ? 'Developer Team Direct' : 'Email Support'}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{isDevDept ? 'dev@tradebeast.io' : 'support@tradebeast.io'}</p>
          </div>
          <span className="text-[11px] text-[var(--color-success)] font-medium flex items-center gap-1 mt-auto">
            <Clock className="w-3.5 h-3.5" /> {isDevDept ? 'Direct Engineering SLA < 1 hr' : 'Average response < 2 hrs'}
          </span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-5 rounded-2xl flex flex-col items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Community Discord</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">discord.gg/tradebeast</p>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] font-medium flex items-center gap-1 mt-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> 14,000+ Active Traders
          </span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-5 rounded-2xl flex flex-col items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">VIP Priority Desk</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Dedicated for PRO & VIP tiers</p>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-auto">
            <ShieldCheck className="w-3.5 h-3.5" /> Instant Priority Queue
          </span>
        </GlassCard>
      </div>

      {/* Main Contact Form */}
      <GlassCard hoverEffect={false} className="p-6 md:p-8 rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Marcus Chen"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marcus@example.com"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                {isDevDept && <option value="DEV_TEAM">Developer Team & API Feeds</option>}
                <option value="TECHNICAL">Technical Bug or Issue</option>
                <option value="GENERAL">General Platform Inquiry</option>
                <option value="VERIFICATION">Trader Verification Application</option>
                <option value="SUBSCRIPTION">15-Day Trial & Subscription</option>
                <option value="FEEDBACK">Feature Request & Feedback</option>
              </select>
            </div>

            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={isDevDept ? 'e.g. Chart calculation discrepancy or API latency' : 'e.g. Question regarding VIP analyst predictions'}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Your Message</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your question or issue in detail..."
              required
              className="w-full bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)]">
              <HelpCircle className="w-4 h-4 text-[var(--brand-primary)] inline-block align-middle mr-1.5" />
              <span>Need instant answers? You can also ask our floating <strong>Beast AI Chatbot</strong> in the bottom right corner.</span>
            </p>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Send Message
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
