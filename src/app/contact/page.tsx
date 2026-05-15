'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bug,
  Lightbulb,
  Handshake,
  Megaphone,
  Shield,
  MessageCircle,
  Mail,
  FileText,
  Send,
  Twitter,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react'

const topics = [
  { id: 'bug',         label: 'Bug report',      icon: <Bug size={14} /> },
  { id: 'idea',        label: 'Tool idea',        icon: <Lightbulb size={14} /> },
  { id: 'partnership', label: 'Partnership',      icon: <Handshake size={14} /> },
  { id: 'advertise',  label: 'Advertise',         icon: <Megaphone size={14} /> },
  { id: 'legal',      label: 'Legal / privacy',   icon: <Shield size={14} /> },
  { id: 'other',      label: 'Other',             icon: <MessageCircle size={14} /> },
]

type IconStyle = 'blue' | 'orange' | 'mint' | 'default'

const iconWrapStyles: Record<IconStyle, string> = {
  blue:    'bg-[rgba(80,140,255,0.10)] border-[rgba(80,140,255,0.18)] text-[var(--blue)]',
  orange:  'bg-[rgba(255,120,64,0.10)] border-[rgba(255,120,64,0.18)] text-[var(--orange)]',
  mint:    'bg-[rgba(0,229,160,0.10)] border-[rgba(0,229,160,0.18)] text-[var(--mint)]',
  default: 'bg-[var(--bg3)] border-[var(--border2)] text-[var(--t2)]',
}

function InfoCard({
  icon,
  iconStyle,
  title,
  value,
}: {
  icon: React.ReactNode
  iconStyle: IconStyle
  title: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[14px_16px]">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border ${iconWrapStyles[iconStyle]}`}>
        {icon}
      </div>
      <div>
        <p className="mb-[3px] text-[12px] font-medium text-[var(--t1)]">{title}</p>
        <p className="text-[12px] leading-[1.55] text-[var(--t3)]">{value}</p>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [activeTopic, setActiveTopic] = useState('bug')
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [subject, setSubject]         = useState('')
  const [message, setMessage]         = useState('')
  const [submitted, setSubmitted]     = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return
    const topicLabel = topics.find(t => t.id === activeTopic)?.label ?? activeTopic
    const body = encodeURIComponent(
      `Topic: ${topicLabel}\n\n${message}\n\n— ${name}`
    )
    const sub  = encodeURIComponent(subject || `[${topicLabel}] Message from ${name}`)
    window.location.href = `mailto:hello@zarynx.com?subject=${sub}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div className="bg-[var(--bg)]">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] px-4 pb-10 pt-10 sm:px-8">
        <div className="pointer-events-none absolute left-[-40px] top-[-60px] h-[220px] w-[320px] rounded-full bg-[radial-gradient(ellipse,rgba(80,140,255,0.08)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-[-80px] right-[-20px] h-[200px] w-[260px] rounded-full bg-[radial-gradient(ellipse,rgba(0,229,160,0.07)_0%,transparent_70%)]" />
        <div
          className="pointer-events-none absolute right-0 top-0 h-[150px] w-[180px]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-[5px] text-[12px] text-[var(--t3)]">
            <Link href="/" className="transition-colors hover:text-[var(--t2)]">Home</Link>
            <span>›</span>
            <span className="text-[var(--t2)]">Contact</span>
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[rgba(80,140,255,0.2)] bg-[rgba(80,140,255,0.08)] px-[10px] py-[5px] text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--blue)]">
            <span className="h-[5px] w-[5px] rounded-full bg-[var(--blue)]" />
            Get in touch
          </div>

          <h1 className="mb-3 text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-[var(--t1)] sm:text-[34px]">
            We actually{' '}
            <em className="not-italic text-[var(--blue)]">respond.</em>
          </h1>
          <p className="max-w-[500px] text-[13.5px] leading-[1.75] text-[var(--t2)]">
            Bug report, tool idea, partnership, or just a question — send it over. We read and
            reply to everything.
          </p>
        </div>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row">

          {/* ── FORM ── */}
          <div className="flex-1 border-b border-[var(--border)] px-4 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:py-10">

            {submitted ? (
              /* ── SUCCESS STATE ── */
              <div className="flex flex-col items-center py-16 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)]">
                  <CheckCircle2 size={26} className="text-[var(--mint)]" />
                </div>
                <h2 className="mb-2 text-[18px] font-medium text-[var(--t1)]">Message sent!</h2>
                <p className="mb-6 max-w-[340px] text-[13px] leading-[1.7] text-[var(--t2)]">
                  Your email client should have opened. If not, email us directly at{' '}
                  <span className="text-[var(--blue)]">hello@zarynx.com</span>
                </p>
                <button
                  onClick={() => { setSubmitted(false); setName(''); setEmail(''); setSubject(''); setMessage('') }}
                  className="rounded-[8px] border border-[var(--border2)] bg-[var(--bg2)] px-5 py-[9px] text-[13px] font-medium text-[var(--t1)] transition-opacity hover:opacity-80"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* Topic selector */}
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--t3)]">
                  What&apos;s this about?
                </p>
                <div className="mb-6 grid grid-cols-2 gap-[6px] sm:grid-cols-3">
                  {topics.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTopic(t.id)}
                      className={`flex items-center gap-2 rounded-[8px] border px-[11px] py-[9px] text-left transition-colors ${
                        activeTopic === t.id
                          ? 'border-[rgba(80,140,255,0.22)] bg-[rgba(80,140,255,0.08)]'
                          : 'border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--border2)]'
                      }`}
                    >
                      <span className={`shrink-0 ${activeTopic === t.id ? 'text-[var(--blue)]' : 'text-[var(--t3)]'}`}>
                        {t.icon}
                      </span>
                      <span className={`text-[12px] ${activeTopic === t.id ? 'text-[var(--t1)]' : 'text-[var(--t2)]'}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mb-5 h-px bg-[var(--border)]" />

                {/* Name + Email */}
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--t3)]">
                  Your details
                </p>
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-[7px] block text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--t3)]">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-[8px] border border-[var(--border2)] bg-[var(--bg2)] px-[13px] py-[10px] text-[13px] text-[var(--t1)] placeholder-[var(--t3)] outline-none transition-colors focus:border-[rgba(80,140,255,0.4)]"
                    />
                  </div>
                  <div>
                    <label className="mb-[7px] block text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--t3)]">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-[8px] border border-[var(--border2)] bg-[var(--bg2)] px-[13px] py-[10px] text-[13px] text-[var(--t1)] placeholder-[var(--t3)] outline-none transition-colors focus:border-[rgba(80,140,255,0.4)]"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <label className="mb-[7px] block text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--t3)]">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Brief summary of your message"
                    className="w-full rounded-[8px] border border-[var(--border2)] bg-[var(--bg2)] px-[13px] py-[10px] text-[13px] text-[var(--t1)] placeholder-[var(--t3)] outline-none transition-colors focus:border-[rgba(80,140,255,0.4)]"
                  />
                </div>

                {/* Message */}
                <div className="mb-5">
                  <label className="mb-[7px] block text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--t3)]">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your bug, idea, or question in detail..."
                    className="w-full resize-none rounded-[8px] border border-[var(--border2)] bg-[var(--bg2)] px-[13px] py-[10px] text-[13px] leading-[1.6] text-[var(--t1)] placeholder-[var(--t3)] outline-none transition-colors focus:border-[rgba(80,140,255,0.4)]"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-[9px] bg-[var(--mint)] py-[12px] text-[13px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90 active:opacity-80"
                >
                  <Send size={14} />
                  Send message
                </button>

              </form>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="shrink-0 px-4 py-8 sm:px-6 lg:w-[300px] lg:py-10">

            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--t3)]">
              Other ways to reach us
            </p>
            <div className="flex flex-col gap-[8px]">
              <InfoCard icon={<Mail size={15} />}     iconStyle="blue"   title="General"          value="hello@zarynx.com" />
              <InfoCard icon={<FileText size={15} />} iconStyle="orange" title="Legal & privacy"  value="legal@zarynx.com" />
              <InfoCard icon={<Handshake size={15} />} iconStyle="mint"  title="Partnerships"     value="partners@zarynx.com" />
            </div>

            {/* Response time callout */}
            <div className="mt-4 flex gap-3 rounded-[10px] border border-[rgba(0,229,160,0.14)] bg-[rgba(0,229,160,0.05)] p-[13px_15px]">
              <div className="w-[3px] shrink-0 self-stretch rounded-full bg-[var(--mint)]" />
              <p className="text-[12px] leading-[1.65] text-[var(--t2)]">
                <span className="font-medium text-[var(--mint)]">Response time:</span>{' '}
                We aim to reply within 48 hours on weekdays. For urgent issues, email directly.
              </p>
            </div>

            <div className="my-5 h-px bg-[var(--border)]" />

            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--t3)]">
              Find us online
            </p>
            <div className="flex flex-col gap-[8px]">
              <InfoCard icon={<Twitter size={15} />}      iconStyle="default" title="Twitter / X" value="@zarynx" />
              <InfoCard icon={<MessageSquare size={15} />} iconStyle="default" title="Discord"    value="discord.gg/zarynx" />
            </div>

          </aside>

        </div>
      </div>
    </div>
  )
}
