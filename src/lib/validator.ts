import { z } from 'zod'

export const inquirySchema = z.object({
  institution_type: z.enum(['Bibliothek', 'Kita'], {
    error: 'Pflichtfeld',
  }),
  institution_name: z
    .string({ error: 'Pflichtfeld' })
    .min(1, 'Pflichtfeld')
    .max(200, 'Maximal 200 Zeichen erlaubt'),
  contact_name: z
    .string({ error: 'Pflichtfeld' })
    .min(1, 'Pflichtfeld')
    .max(150, 'Maximal 150 Zeichen erlaubt'),
  email: z
    .string({ error: 'Pflichtfeld' })
    .min(1, 'Pflichtfeld')
    .email('Ungültige E-Mail-Adresse'),
  titles: z
    .array(
      z.object({
        title: z.string().min(1, 'Pflichtfeld'),
        quantity: z
          .number({ error: 'Anzahl muss zwischen 1 und 9999 liegen' })
          .int('Anzahl muss zwischen 1 und 9999 liegen')
          .min(1, 'Anzahl muss zwischen 1 und 9999 liegen')
          .max(9999, 'Anzahl muss zwischen 1 und 9999 liegen'),
      })
    )
    .min(1, 'Bitte mindestens einen Titel angeben'),
  notes: z.string().max(1000, 'Maximal 1000 Zeichen erlaubt').optional(),
})

export type InquiryInput = z.infer<typeof inquirySchema>

export function parseInquiry(data: unknown): {
  success: boolean
  data?: InquiryInput
  errors?: Record<string, string>
} {
  const result = inquirySchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = issue.path.join('.')
    if (!errors[key]) errors[key] = issue.message
  }

  return { success: false, errors }
}
