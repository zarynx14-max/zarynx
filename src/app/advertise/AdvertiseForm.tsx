'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

const budgets = ['Under $500', '$500 – $1,000', '$1,000 – $5,000', '$5,000+']

const inputCls =
  'w-full rounded-[8px] border border-[var(--border2)] bg-[var(--bg2)] px-[13px] py-[10px] text-[13px] text-[var(--t1)] placeholder-[var(--t3)] outline-none transition-colors focus:border-[rgba(0,229,160,0.4)]'
const labelCls =
  'mb-[7px] block text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--t2)]'

export function AdvertiseForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return
    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company || '-'}\nBudget: ${budget || '-'}\n\n${message}`
    )
    const sub = encodeURIComponent(`[Advertise] ${company || name}`)
    window.location.href = `mailto:partners@zarynx.com?subject=${sub}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)]">
          <CheckCircle2 size={26} className="text-[var(--mint)]" />
        </div>
        <h3 className="mb-2 text-[18px] font-medium text-[var(--t1)]">Request ready!</h3>
        <p className="mb-6 max-w-[340px] text-[13px] leading-[1.7] text-[var(--t2)]">
          Your email client should have opened. If not, email us directly at{' '}
          <span className="text-[var(--mint)]">partners@zarynx.com</span>
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setName(''); setEmail(''); setCompany(''); setBudget(''); setMessage('')
          }}
          className="rounded-[8px] border border-[var(--border2)] bg-[var(--bg2)] px-5 py-[9px] text-[13px] font-medium text-[var(--t1)] transition-opacity hover:opacity-80"
        >
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="adv-name" className={labelCls}>Name</label>
          <input id="adv-name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="adv-email" className={labelCls}>Work email</label>
          <input id="adv-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className={inputCls} />
        </div>
        <div>
          <label htmlFor="adv-company" className={labelCls}>Company or brand</label>
          <input id="adv-company" type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Brand name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="adv-budget" className={labelCls}>Monthly budget</label>
          <select id="adv-budget" value={budget} onChange={e => setBudget(e.target.value)} className={inputCls}>
            <option value="">Select a range</option>
            {budgets.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-5">
        <label htmlFor="adv-message" className={labelCls}>What would you like to promote?</label>
        <textarea id="adv-message" required rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Product, target games, preferred dates..." className={`${inputCls} resize-none leading-[1.6]`} />
      </div>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-[9px] bg-[var(--mint)] py-[12px] text-[13px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90 active:opacity-80"
      >
        <Send size={14} />
        Send request
      </button>
    </form>
  )
}
