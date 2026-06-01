import { Resend } from 'resend'
import { render } from '@react-email/components'
import ConfirmationEmail from '@/emails/ConfirmationEmail'
import AdminNotifyEmail from '@/emails/AdminNotifyEmail'
import type { Lead } from '@/types/inquiry'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmation(lead: Lead): Promise<void> {
  try {
    const html = await render(
      ConfirmationEmail({
        contactName: lead.contact_name,
        institutionName: lead.institution_name,
        institutionType: lead.institution_type,
        titles: lead.titles,
        notes: lead.notes,
        createdAt: new Date(lead.created_at).toLocaleString('de-DE'),
      })
    )

    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: lead.email,
      subject: 'Ihre Anfrage bei Lesewelt Verlag – Bestätigung',
      html,
    })
  } catch (error) {
    console.error('[mailer] sendConfirmation failed:', error)
  }
}

export async function sendAdminNotification(lead: Lead): Promise<void> {
  try {
    const html = await render(
      AdminNotifyEmail({
        leadId: lead.id,
        contactName: lead.contact_name,
        institutionName: lead.institution_name,
        institutionType: lead.institution_type,
        email: lead.email,
        titles: lead.titles,
        notes: lead.notes,
        ipAddress: lead.ip_address,
        createdAt: new Date(lead.created_at).toLocaleString('de-DE'),
      })
    )

    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `[Neue Anfrage] ${lead.institution_name} – ${lead.institution_type}`,
      html,
    })
  } catch (error) {
    console.error('[mailer] sendAdminNotification failed:', error)
  }
}
