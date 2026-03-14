import { useState, type FormEvent } from 'react'
import { trackContactFormSubmitted } from '@/lib/analytics'
import { content } from '@/data/content'

interface ContactForm {
  name:        string
  email:       string
  phone:       string
  serviceType: string
  message:     string
}

export default function Contact() {
  const { contact } = content
  const [form, setForm]       = useState<ContactForm>({ name: '', email: '', phone: '', serviceType: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    // In production, post to /api/v1/leads or similar endpoint
    await new Promise(resolve => setTimeout(resolve, 600))
    trackContactFormSubmitted()
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{contact.headline}</h1>
        <p className="text-text-secondary">{contact.subhead}</p>
      </div>

      {submitted ? (
        <div role="status" className="bg-surface rounded-xl p-8 border border-success text-center">
          <p className="text-success text-lg font-semibold">✓ {contact.successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {(['name', 'email', 'phone'] as const).map(field => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm text-text-secondary mb-1">
                {contact.fields[field]}
              </label>
              <input
                id={field} name={field}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                required={field !== 'phone'}
                value={form[field]} onChange={handleChange}
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none transition-colors"
              />
            </div>
          ))}

          <div>
            <label htmlFor="serviceType" className="block text-sm text-text-secondary mb-1">
              {contact.fields.serviceType}
            </label>
            <select
              id="serviceType" name="serviceType" required
              value={form.serviceType} onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none transition-colors"
            >
              <option value="">Select a service…</option>
              {contact.serviceOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm text-text-secondary mb-1">
              {contact.fields.message}
            </label>
            <textarea
              id="message" name="message" required rows={5}
              value={form.message} onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            {submitting ? 'Sending…' : contact.submitCta}
          </button>
        </form>
      )}
    </div>
  )
}
