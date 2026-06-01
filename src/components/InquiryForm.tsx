'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { InstitutionType, TitleItem } from '@/types/inquiry'

interface FormErrors {
  institution_type?: string
  institution_name?: string
  contact_name?: string
  email?: string
  titles?: string
  [key: string]: string | undefined
}

interface FormState {
  institution_type: InstitutionType | ''
  institution_name: string
  contact_name: string
  email: string
  titles: TitleItem[]
  notes: string
  hp_field: string
  dsgvo: boolean
}

const initialState: FormState = {
  institution_type: '',
  institution_name: '',
  contact_name: '',
  email: '',
  titles: [{ title: '', quantity: 1 }],
  notes: '',
  hp_field: '',
  dsgvo: false,
}

export default function InquiryForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validateClient(): FormErrors {
    const e: FormErrors = {}
    if (!form.institution_type) e.institution_type = 'Bitte wählen Sie einen Einrichtungstyp aus.'
    if (!form.institution_name.trim()) e.institution_name = 'Pflichtfeld'
    if (!form.contact_name.trim()) e.contact_name = 'Pflichtfeld'
    if (!form.email.trim()) {
      e.email = 'Pflichtfeld'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Ungültige E-Mail-Adresse'
    }
    if (form.titles.length === 0 || form.titles.every((t) => !t.title.trim())) {
      e.titles = 'Bitte mindestens einen Titel angeben'
    }
    for (let i = 0; i < form.titles.length; i++) {
      if (!form.titles[i].title.trim()) e[`titles.${i}.title`] = 'Pflichtfeld'
      if (form.titles[i].quantity < 1 || form.titles[i].quantity > 9999) {
        e[`titles.${i}.quantity`] = 'Anzahl muss zwischen 1 und 9999 liegen'
      }
    }
    if (!form.dsgvo) e.dsgvo = 'Bitte stimmen Sie der Datenschutzerklärung zu.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const clientErrors = validateClient()
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution_type: form.institution_type,
          institution_name: form.institution_name,
          contact_name: form.contact_name,
          email: form.email,
          titles: form.titles.filter((t) => t.title.trim()),
          notes: form.notes || undefined,
          hp_field: form.hp_field,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
        toast.success('Anfrage erfolgreich gesendet', {
          description: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
        })
      } else if (data.errors) {
        setErrors(data.errors)
        toast.error('Bitte korrigieren Sie die markierten Felder.')
      } else {
        toast.error(data.message ?? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
      }
    } catch {
      toast.error('Verbindungsfehler. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  function addTitle() {
    setForm((f) => ({ ...f, titles: [...f.titles, { title: '', quantity: 1 }] }))
  }

  function removeTitle(index: number) {
    if (form.titles.length <= 1) return
    setForm((f) => ({ ...f, titles: f.titles.filter((_, i) => i !== index) }))
  }

  function updateTitle(index: number, field: keyof TitleItem, value: string | number) {
    setForm((f) => {
      const titles = [...f.titles]
      titles[index] = { ...titles[index], [field]: value }
      return { ...f, titles }
    })
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-[680px] mx-auto shadow-lg border-0">
        <CardContent className="py-16 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e6f4ef' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0f2d5c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold" style={{ color: '#0f2d5c' }}>
            Anfrage erfolgreich gesendet
          </h2>
          <p className="text-gray-500 max-w-sm">
            Vielen Dank! Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-[680px] mx-auto shadow-lg border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-semibold" style={{ color: '#0f2d5c' }}>
          B2B-Anfrage
        </CardTitle>
        <CardDescription>
          Füllen Sie das Formular aus, um Bücher für Ihre Einrichtung anzufragen.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Honeypot — hidden from humans, bots fill it */}
          <input
            type="text"
            name="hp_field"
            value={form.hp_field}
            onChange={(e) => setForm((f) => ({ ...f, hp_field: e.target.value }))}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* Institution type toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: '#0f2d5c' }}>
              Einrichtungstyp <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-3">
              {(['Bibliothek', 'Kita'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, institution_type: type }))}
                  className="px-5 py-2 rounded-full text-sm font-medium border-2 transition-all duration-150 cursor-pointer"
                  style={
                    form.institution_type === type
                      ? { backgroundColor: '#0f2d5c', borderColor: '#0f2d5c', color: '#ffffff' }
                      : { backgroundColor: 'transparent', borderColor: '#d1d5db', color: '#374151' }
                  }
                >
                  {type === 'Kita' ? 'Kindergarten / Kita' : 'Bibliothek'}
                </button>
              ))}
            </div>
            {errors.institution_type && (
              <p className="text-sm text-red-500">{errors.institution_type}</p>
            )}
          </div>

          {/* Institution name */}
          <div className="space-y-2">
            <Label htmlFor="institution_name" className="text-sm font-medium" style={{ color: '#0f2d5c' }}>
              Einrichtungsname <span className="text-red-500">*</span>
            </Label>
            <Input
              id="institution_name"
              placeholder="z. B. Stadtbibliothek München"
              value={form.institution_name}
              onChange={(e) => setForm((f) => ({ ...f, institution_name: e.target.value }))}
              className={errors.institution_name ? 'border-red-400 focus-visible:ring-red-300' : ''}
            />
            {errors.institution_name && (
              <p className="text-sm text-red-500">{errors.institution_name}</p>
            )}
          </div>

          {/* Contact name */}
          <div className="space-y-2">
            <Label htmlFor="contact_name" className="text-sm font-medium" style={{ color: '#0f2d5c' }}>
              Ansprechpartner <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact_name"
              placeholder="Vor- und Nachname"
              value={form.contact_name}
              onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
              className={errors.contact_name ? 'border-red-400 focus-visible:ring-red-300' : ''}
            />
            {errors.contact_name && (
              <p className="text-sm text-red-500">{errors.contact_name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#0f2d5c' }}>
              E-Mail-Adresse <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@einrichtung.de"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={errors.email ? 'border-red-400 focus-visible:ring-red-300' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Titles */}
          <div className="space-y-3">
            <Label className="text-sm font-medium" style={{ color: '#0f2d5c' }}>
              Gewünschte Titel <span className="text-red-500">*</span>
            </Label>
            {errors.titles && <p className="text-sm text-red-500">{errors.titles}</p>}

            <div className="space-y-2">
              {form.titles.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Titel oder ISBN"
                      value={item.title}
                      onChange={(e) => updateTitle(index, 'title', e.target.value)}
                      className={errors[`titles.${index}.title`] ? 'border-red-400' : ''}
                    />
                    {errors[`titles.${index}.title`] && (
                      <p className="text-xs text-red-500 mt-1">{errors[`titles.${index}.title`]}</p>
                    )}
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min={1}
                      max={9999}
                      placeholder="Anzahl"
                      value={item.quantity}
                      onChange={(e) => updateTitle(index, 'quantity', parseInt(e.target.value) || 1)}
                      className={errors[`titles.${index}.quantity`] ? 'border-red-400' : ''}
                    />
                    {errors[`titles.${index}.quantity`] && (
                      <p className="text-xs text-red-500 mt-1">{errors[`titles.${index}.quantity`]}</p>
                    )}
                  </div>
                  {form.titles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTitle(index)}
                      className="mt-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Titel entfernen"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTitle}
              className="text-sm cursor-pointer"
              style={{ borderColor: '#0f2d5c', color: '#0f2d5c' }}
            >
              + Titel hinzufügen
            </Button>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium" style={{ color: '#0f2d5c' }}>
              Anmerkungen <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="z. B. gewünschter Liefertermin, Sonderkonditionen..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* DSGVO */}
          <div className="space-y-1">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.dsgvo}
                onChange={(e) => setForm((f) => ({ ...f, dsgvo: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded accent-[#0f2d5c] cursor-pointer"
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                Ich stimme der Verarbeitung meiner Daten gemäß{' '}
                <span className="underline underline-offset-2" style={{ color: '#0f2d5c' }}>
                  DSGVO
                </span>{' '}
                zu.
              </span>
            </label>
            {errors.dsgvo && <p className="text-sm text-red-500 pl-7">{errors.dsgvo}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-medium text-base py-6 cursor-pointer transition-opacity"
            style={{ backgroundColor: '#0f2d5c', color: '#ffffff' }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Wird gesendet…
              </span>
            ) : (
              'Anfrage senden'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
