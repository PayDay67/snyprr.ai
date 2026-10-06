import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, X, Send, Bot, ChevronDown, RotateCcw,
  Sparkles, ArrowRight, ExternalLink, HelpCircle, ShieldCheck,
  TrendingUp, CreditCard, Users, CheckCircle2, ThumbsUp, ThumbsDown,
  Copy, Check, Volume2, VolumeX, BarChart2, Zap, ArrowUpRight
} from 'lucide-react';

interface ChatAction {
  label: string;
  path?: string;
  href?: string;
}

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
  action?: ChatAction;
  suggestions?: string[];
  reaction?: 'up' | 'down';
  copied?: boolean;
}

interface BotResponse {
  text: string;
  action?: ChatAction;
  suggestions?: string[];
}

// Live signals for the Signals Tab
const LIVE_SIGNALS = [
  {
    instrument: 'BTC/USDT',
    direction: 'LONG',
    buyingZone: '$91,800 - $92,500',
    targetZone: '$101,000',
    analyst: 'TradeBeast Desk',
    winRate: '78.5%',
    timeframe: '4h',
    confluence: 'SMC Order Block & Bullish FVG',
  },
  {
    instrument: 'ETH/USDT',
    direction: 'LONG',
    buyingZone: '$3,350 - $3,400',
    targetZone: '$3,850',
    analyst: 'TradeBeast Desk',
    winRate: '78.5%',
    timeframe: '4h',
    confluence: 'Institutional Demand Shelf',
  },
  {
    instrument: 'GOLD (XAU/USD)',
    direction: 'LONG',
    buyingZone: '$2,860 - $2,875',
    targetZone: '$2,980',
    analyst: 'Macro Alpha',
    winRate: '81.2%',
    timeframe: 'Daily',
    confluence: 'Global Central Bank Accumulation',
  },
];

const KNOWLEDGE_BASE: {
  keywords: string[];
  response: BotResponse;
}[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'greetings', 'start', 'morning', 'afternoon', 'evening'],
    response: {
      text: "👋 Hey there! Welcome to **Trade Beast**.\n\nI'm **Beast AI**, your 24/7 interactive assistant. Ask me anything, or explore our interactive tabs above for **Live Signals** and **Plan Comparison**!",
      suggestions: ['Check live BTC signal', 'Compare pricing plans', 'How does TradeBeast work?'],
    },
  },
  {
    keywords: ['what is', 'how does it work', 'explain', 'about tradebeast', 'overview', 'concept'],
    response: {
      text: "🔮 **Trade Beast** is a verified prediction & trade-idea tracking platform.\n\n• Verified analysts publish high-conviction ideas with precise **Buying & Selling Zones**.\n• You track ideas in real time without broker integration or custody risk.\n• Public, auditable win-rate scorecards for every trader.",
      action: { label: 'Explore Active Predictions', path: '/predictions' },
      suggestions: ['Does TradeBeast execute trades?', 'Are traders verified?', 'View Pricing'],
    },
  },
  {
    keywords: ['signal', 'signals', 'live signal', 'current idea', 'btc setup', 'gold setup'],
    response: {
      text: "⚡ **Live Market Signal Peek**:\n• **BTC/USDT**: LONG Zone $91,800 - $92,500 ➔ Target $101,000\n• **ETH/USDT**: LONG Zone $3,350 ➔ Target $3,850\n• **GOLD**: LONG Zone $2,860 ➔ Target $2,980\n\nSwitch to the **Live Signals** tab above for full confluences!",
      action: { label: 'View All Live Predictions', path: '/predictions' },
      suggestions: ['How is win rate calculated?', 'Explore pricing plans'],
    },
  },
  {
    keywords: ['execute', 'auto trade', 'broker', 'custody', 'exchange', 'connect wallet', 'place orders'],
    response: {
      text: "🛡️ **Trade Beast NEVER executes trades on your behalf.**\n\nWe provide verified intelligence and technical confluences. You retain 100% control of your funds on your preferred broker or exchange.",
      suggestions: ['How are win rates calculated?', 'What is a prediction?', 'View pricing'],
    },
  },
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'subscription', 'pro', 'vip', 'fee', 'charge', 'expensive'],
    response: {
      text: "💎 **Subscription Plans**:\n• **Free**: Essential prediction tracking & basic analytics.\n• **Pro ($49/mo)**: Top 15% analysts, live zone lines & push alerts.\n• **VIP ($149/mo)**: Unlimited predictions, 1-on-1 desk access & priority dev support.\n\nSwitch to the **Plans** tab above for an interactive calculator!",
      action: { label: 'Explore Pricing Section', href: '#pricing' },
      suggestions: ['Is there a free trial?', 'How do I start?'],
    },
  },
  {
    keywords: ['free', 'trial', 'free tier', 'zero cost'],
    response: {
      text: "🎁 **Yes!** Trade Beast has a generous **Free Tier** to start tracking verified ideas right now. Premium plans also come with a risk-free **15-Day Trial**.",
      action: { label: 'Create Free Account', path: '/signup' },
      suggestions: ['Explore Pricing Section', 'Who are the traders?'],
    },
  },
  {
    keywords: ['trader', 'analyst', 'verified', 'who', 'creator', 'reputation', 'accuracy'],
    response: {
      text: "🏆 Every analyst on Trade Beast goes through a rigorous verification audit. Their historical win rates (**76.4% platform avg**), profit factors, and risk-to-reward ratios are publicly auditable.",
      action: { label: 'Browse Verified Traders', path: '/traders' },
      suggestions: ['How is win rate calculated?', 'Can I become a trader?'],
    },
  },
  {
    keywords: ['become trader', 'apply', 'publish', 'monetize', 'verification application'],
    response: {
      text: "📈 **Are you a seasoned analyst?** Apply for verification via the trader portal. Publish ideas, build an audience, and monetize high-conviction predictions.",
      action: { label: 'Apply for Verification', path: '/contact?dept=dev' },
      suggestions: ['Contact developer team', 'What is a prediction?'],
    },
  },
  {
    keywords: ['win rate', 'accuracy', 'calculation', 'risk reward', 'formula'],
    response: {
      text: "📊 **Win Rate Formula**:\n`(Successful Closed Trades reaching Selling Zone ÷ Total Closed Predictions) × 100`\n\nOur current platform average is **76.4%** with an average risk-to-reward ratio of **1 : 2.8**.",
      suggestions: ['Check live BTC signal', 'Explore predictions'],
    },
  },
  {
    keywords: ['market', 'coin', 'crypto', 'forex', 'gold', 'silver', 'xau', 'xag', 'btc', 'eth', 'sol', 'xrp'],
    response: {
      text: "⚡ **Covered Markets**:\n• **Crypto**: BTC, ETH, SOL, XRP\n• **Commodities / Forex**: Gold (XAU/USD), Silver (XAG/USD)\n\nAll instruments feature responsive Lightweight TradingView charts and custom zones.",
      action: { label: 'Check Live Predictions', path: '/predictions' },
      suggestions: ['How do I get started?', 'View pricing'],
    },
  },
  {
    keywords: ['developer', 'dev team', 'engineering', 'bug', 'api', 'technical support'],
    response: {
      text: "🛠️ **Developer & Engineering Desk**:\n• Email: **dev@tradebeast.io** (SLA < 1 hr)\n• Dedicated channel for verified traders, API integrations, and charting bugs.",
      action: { label: 'Contact Developer Team', path: '/contact?dept=dev' },
      suggestions: ['Join Community Discord', 'Follow on Twitter'],
    },
  },
  {
    keywords: ['contact', 'support', 'email', 'help', 'question', 'ticket'],
    response: {
      text: "📫 **24/7 Support Desk**:\n• Email: **support@tradebeast.io**\n• Average reply time < 2 hours.",
      action: { label: 'Open Support Desk', path: '/contact' },
      suggestions: ['Join Community Discord', 'Is TradeBeast free?'],
    },
  },
  {
    keywords: ['discord', 'twitter', 'social', 'community', 'instagram', 'facebook', 'follow'],
    response: {
      text: "🌐 **Follow Us & Join 20K+ Traders**:\n• **Discord**: discord.gg/tradebeast (14K+ active)\n• **Twitter / X**: @TradeBeastHQ\n• **Instagram**: @tradebeast.official\n• **Facebook**: Trade Beast Global",
      action: { label: 'Join Official Discord', href: 'https://discord.gg/tradebeast' },
      suggestions: ['Check live BTC signal', 'How do I start?'],
    },
  },
  {
    keywords: ['start', 'signup', 'register', 'create account', 'join', 'login'],
    response: {
      text: "🚀 **Ready to start?** Create your account in seconds and unlock live prediction feeds instantly.",
      action: { label: 'Create Free Account', path: '/signup' },
      suggestions: ['Explore Pricing Section', 'What markets are covered?'],
    },
  },
];

function matchQuery(input: string): BotResponse {
  const clean = input.toLowerCase().trim();

  let bestMatch: BotResponse | null = null;
  let highestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (clean.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item.response;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch;
  }

  return {
    text: "I want to get you the exact information! Try asking about our **live signals**, **verified win rates**, **pricing plans**, or connecting directly with our **developer team**.",
    action: { label: 'Contact Support Desk', path: '/contact' },
    suggestions: ['Check live BTC signal', 'View pricing plans', 'What is TradeBeast?'],
  };
}

// Sound effect using Web Audio API
function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

export const LandingChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'signals' | 'plans'>('chat');
  const [annualBilling, setAnnualBilling] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-0',
      role: 'bot',
      text: "👋 Hi! I'm **Beast AI**, your real-time trading guide.\n\nAsk me anything below, or switch tabs above for **Live Signals** and **Interactive Plans**!",
      time: 'Just now',
      suggestions: ['Check live BTC signal', 'Compare pricing plans', 'How does TradeBeast work?'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show teaser tooltip after initial visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    if (open && activeTab === 'chat') {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
      inputRef.current?.focus();
    }
  }, [open, messages, isTyping, activeTab]);

  const handleActionClick = (action: ChatAction) => {
    if (action.href) {
      if (action.href.startsWith('#')) {
        const el = document.querySelector(action.href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          setOpen(false);
        }
      } else {
        window.open(action.href, '_blank', 'noopener,noreferrer');
      }
    } else if (action.path) {
      navigate(action.path);
      setOpen(false);
    }
  };

  const handleSend = (text: string) => {
    const query = text.trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = Math.min(650, Math.max(300, query.length * 12));
    setTimeout(() => {
      const match = matchQuery(query);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: match.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: match.action,
        suggestions: match.suggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (soundEnabled) playChime();
    }, delay);
  };

  const handleReaction = (msgId: string, type: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, reaction: m.reaction === type ? undefined : type } : m))
    );
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, copied: true } : m))
    );
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, copied: false } : m))
      );
    }, 1800);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'bot',
        text: "✨ Conversation reset! What would you like to explore?",
        time: 'Just now',
        suggestions: ['Check live BTC signal', 'Compare pricing plans', 'What markets are covered?'],
      },
    ]);
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={idx} className="block leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-[var(--text-primary)]">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Teaser Prompt */}
      {!open && showTeaser && (
        <div
          className="fixed bottom-24 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--bg-surface-glass)] backdrop-blur-xl border border-[var(--border-strong)] shadow-2xl animate-fade-in group cursor-pointer hover:border-[var(--brand-primary)]/50 transition-all"
          onClick={() => { setOpen(true); setShowTeaser(false); }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] animate-pulse shadow-[0_0_8px_var(--color-success)]" />
          <p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <span>Ask Beast AI</span>
            <span className="text-[10px] text-[var(--brand-primary)] font-bold uppercase tracking-wider">Online</span>
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setShowTeaser(false); }}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ml-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => { setOpen(!open); setShowTeaser(false); }}
        aria-label="Open Beast AI Assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-vivid)] to-indigo-600 text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
        style={{ boxShadow: '0 0 35px var(--brand-glow)' }}
      >
        {open ? (
          <ChevronDown className="w-6 h-6 transition-transform group-hover:translate-y-0.5" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--color-success)] border-2 border-white dark:border-black animate-pulse" />
          </div>
        )}
      </button>

      {/* Interactive Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-28px)] rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-surface-glass)] backdrop-blur-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ height: '570px', maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* Header */}
        <div className="px-4 pt-3.5 pb-2 border-b border-[var(--border-subtle)] bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-secondary)] flex-shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-vivid)] text-white flex items-center justify-center shadow-md relative">
                <Bot className="w-4 h-4" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--color-success)] border-2 border-[var(--bg-surface)]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-extrabold text-[var(--text-primary)]">Beast AI</h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-[var(--color-success)] font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                  Live Platform Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[var(--brand-primary)]" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={handleClear}
                title="Reset conversation"
                className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close"
                className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-base)]/80 border border-[var(--border-subtle)] text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'signals'
                  ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live Signals</span>
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Plans</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Chat Tab */}
        {activeTab === 'chat' && (
          <>
            {/* Quick Action Badges */}
            <div className="px-3 pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-[var(--border-subtle)]/40 flex-shrink-0">
              <button
                onClick={() => handleSend('Check live BTC signal')}
                className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[var(--brand-glow)]/40 hover:bg-[var(--brand-primary)] text-[var(--brand-primary)] hover:text-white border border-[var(--brand-primary)]/30 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <TrendingUp className="w-3 h-3" /> BTC Signal
              </button>
              <button
                onClick={() => handleSend('Compare pricing plans')}
                className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--brand-glow)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <CreditCard className="w-3 h-3" /> Pricing
              </button>
              <button
                onClick={() => handleSend('Who are the traders?')}
                className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--brand-glow)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <Users className="w-3 h-3" /> Win Rates
              </button>
              <button
                onClick={() => handleSend('Contact developer team')}
                className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--brand-glow)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3" /> Dev Desk
              </button>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className={`flex gap-2 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.role === 'bot' && (
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-vivid)] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                      </div>
                    )}
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-vivid)] text-white rounded-tr-sm shadow-md font-medium'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {formatText(msg.text)}

                      {/* Interactive Action Button */}
                      {msg.action && (
                        <button
                          onClick={() => handleActionClick(msg.action!)}
                          className="mt-2.5 w-full py-2 px-3 rounded-xl bg-[var(--brand-glow)] hover:bg-[var(--brand-primary)] text-[var(--brand-primary)] hover:text-white border border-[var(--brand-primary)]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-sm"
                        >
                          <span>{msg.action.label}</span>
                          {msg.action.href && !msg.action.href.startsWith('#') ? (
                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bot Interactive Actions: Thumbs Up / Down / Copy */}
                  {msg.role === 'bot' && (
                    <div className="flex items-center gap-1 pl-8">
                      <button
                        onClick={() => handleReaction(msg.id, 'up')}
                        className={`p-1 rounded-md transition-colors ${
                          msg.reaction === 'up'
                            ? 'text-[var(--color-success)] bg-[var(--color-success-bg)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                        }`}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleReaction(msg.id, 'down')}
                        className={`p-1 rounded-md transition-colors ${
                          msg.reaction === 'down'
                            ? 'text-[var(--color-danger)] bg-[var(--color-danger-bg)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                        }`}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                        title="Copy answer"
                      >
                        {msg.copied ? <Check className="w-3 h-3 text-[var(--color-success)]" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <span className="text-[9px] text-[var(--text-muted)] ml-1">{msg.time}</span>
                    </div>
                  )}

                  {/* Dynamic Next Question Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-8 pt-0.5">
                      {msg.suggestions.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(s)}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--brand-glow)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 transition-all cursor-pointer active:scale-95"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Animation */}
              {isTyping && (
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-6 h-6 rounded-lg bg-[var(--brand-glow)] text-[var(--brand-primary)] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-bounce"
                        style={{ animationDelay: `${i * 140}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl px-3 py-1.5 focus-within:border-[var(--brand-primary)] focus-within:ring-2 focus-within:ring-[var(--brand-primary)]/20 transition-all"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about predictions, pricing, traders..."
                  className="flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-vivid)] text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </>
        )}

        {/* Tab 2: Interactive Live Signals Peek */}
        {activeTab === 'signals' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--border-subtle)]">
              <span className="text-[11px] font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                Live Verified Ideas
              </span>
              <span className="text-[10px] text-[var(--brand-primary)] font-semibold">Non-Custodial</span>
            </div>

            {LIVE_SIGNALS.map((sig, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{sig.instrument}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[var(--color-success-bg)] text-[var(--color-success)]">
                      {sig.direction}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">{sig.timeframe}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[var(--border-subtle)]/60">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Buying Zone</span>
                    <span className="font-semibold text-[var(--text-primary)]">{sig.buyingZone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Selling Zone</span>
                    <span className="font-bold text-[var(--color-success)]">{sig.targetZone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-[var(--text-muted)]">
                  <span>{sig.analyst} ({sig.winRate} Win Rate)</span>
                  <button
                    onClick={() => {
                      navigate('/predictions');
                      setOpen(false);
                    }}
                    className="text-[var(--brand-primary)] font-bold flex items-center gap-0.5 hover:underline"
                  >
                    Analyze Chart <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                navigate('/predictions');
                setOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 transition-opacity cursor-pointer mt-2"
            >
              <span>Explore All 1,200+ Predictions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab 3: Interactive Plans & Calculator */}
        {activeTab === 'plans' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            <div className="text-center space-y-1">
              <h4 className="text-xs font-extrabold text-[var(--text-primary)]">Choose Your Trading Tier</h4>
              <p className="text-[10px] text-[var(--text-muted)]">30-day risk-free trial on all paid plans</p>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] max-w-[220px] mx-auto text-[11px] font-semibold">
              <button
                onClick={() => setAnnualBilling(false)}
                className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                  !annualBilling ? 'bg-[var(--brand-primary)] text-white' : 'text-[var(--text-muted)]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnualBilling(true)}
                className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  annualBilling ? 'bg-[var(--brand-primary)] text-white' : 'text-[var(--text-muted)]'
                }`}
              >
                <span>Annual</span>
                <span className="text-[9px] bg-amber-400/20 text-amber-400 px-1 rounded">-20%</span>
              </button>
            </div>

            {/* Plan Cards */}
            <div className="space-y-2.5">
              {/* Free Tier */}
              <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[var(--text-primary)]">Free Tier</h5>
                  <p className="text-[10px] text-[var(--text-muted)]">Essential prediction tracking</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[var(--text-primary)]">$0</span>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setOpen(false);
                    }}
                    className="block text-[10px] font-bold text-[var(--brand-primary)] hover:underline mt-0.5"
                  >
                    Sign Up Free →
                  </button>
                </div>
              </div>

              {/* Pro Tier */}
              <div className="p-3 rounded-2xl bg-[var(--brand-glow)]/20 border border-[var(--brand-primary)]/50 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[var(--brand-primary)] text-white text-[8px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase">
                  Popular
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>Pro Trader</span>
                    <Sparkles className="w-3 h-3 text-[var(--brand-primary)]" />
                  </h5>
                  <p className="text-[10px] text-[var(--text-muted)]">Top 15% analysts & SL/TP alerts</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[var(--brand-primary)]">
                    {annualBilling ? '$39' : '$49'}
                    <span className="text-[10px] text-[var(--text-muted)] font-normal">/mo</span>
                  </span>
                  <button
                    onClick={() => {
                      const el = document.querySelector('#pricing');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      setOpen(false);
                    }}
                    className="block text-[10px] font-bold text-[var(--brand-primary)] hover:underline mt-0.5"
                  >
                    Select Plan →
                  </button>
                </div>
              </div>

              {/* VIP Tier */}
              <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-amber-400">VIP Analyst Pass</h5>
                  <p className="text-[10px] text-[var(--text-muted)]">1-on-1 desk & unlimited predictions</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-amber-400">
                    {annualBilling ? '$119' : '$149'}
                    <span className="text-[10px] text-[var(--text-muted)] font-normal">/mo</span>
                  </span>
                  <button
                    onClick={() => {
                      const el = document.querySelector('#pricing');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      setOpen(false);
                    }}
                    className="block text-[10px] font-bold text-amber-400 hover:underline mt-0.5"
                  >
                    View VIP →
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.querySelector('#pricing');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                setOpen(false);
              }}
              className="w-full py-2 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Compare Full Feature Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
