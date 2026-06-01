import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { parseInquiry } from '@/lib/validator'
import { sendConfirmation, sendAdminNotification } from '@/lib/mailer'
import type { Lead } from '@/types/inquiry'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot check — silent 200 to not reveal detection
    if (body.hp_field) {
      return NextResponse.json({ success: true })
    }

    // Validate with zod
    const parsed = parseInquiry(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.errors }, { status: 400 })
    }

    // Get client IP for spam tracking
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') ?? 'unknown'

    // Insert lead into Supabase
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        institution_type: parsed.data!.institution_type,
        institution_name: parsed.data!.institution_name,
        contact_name: parsed.data!.contact_name,
        email: parsed.data!.email,
        titles: parsed.data!.titles,
        notes: parsed.data!.notes ?? null,
        ip_address: ipAddress,
      })
      .select()
      .single()

    if (error) {
      console.error('[api/inquiry] Supabase insert error:', error)
      return NextResponse.json(
        { success: false, message: 'Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
        { status: 500 }
      )
    }

    const lead = data as Lead

    // Send both emails in parallel — one failing must not affect the other
    await Promise.allSettled([sendConfirmation(lead), sendAdminNotification(lead)])

    return NextResponse.json({
      success: true,
      message: 'Ihre Anfrage wurde erfolgreich übermittelt.',
    })
  } catch (error) {
    console.error('[api/inquiry] Unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    )
  }
}
