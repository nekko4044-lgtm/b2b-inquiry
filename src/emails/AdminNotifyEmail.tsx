import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Link,
} from '@react-email/components'
import { TitleItem } from '@/types/inquiry'

interface AdminNotifyEmailProps {
  leadId: string
  contactName: string
  institutionName: string
  institutionType: string
  email: string
  titles: TitleItem[]
  notes?: string
  ipAddress: string
  createdAt: string
}

export default function AdminNotifyEmail({
  leadId,
  contactName,
  institutionName,
  institutionType,
  email,
  titles,
  notes,
  ipAddress,
  createdAt,
}: AdminNotifyEmailProps) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '#'

  return (
    <Html lang="de">
      <Head />
      <Preview>Neue B2B-Anfrage von {institutionName}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerText}>Neue B2B-Anfrage – Lesewelt Verlag</Heading>
          </Section>

          <Section style={content}>
            {/* Alert box */}
            <Section style={alertBox}>
              <Text style={alertText}>Neue Anfrage eingegangen – ID: {leadId}</Text>
            </Section>

            {/* Lead details */}
            <Text style={sectionTitle}>Kontaktdetails</Text>
            <Section style={detailsBox}>
              <Row>
                <Column style={labelCell}>Einrichtung</Column>
                <Column style={valueCell}>{institutionName}</Column>
              </Row>
              <Row>
                <Column style={labelCell}>Typ</Column>
                <Column style={valueCell}>{institutionType}</Column>
              </Row>
              <Row>
                <Column style={labelCell}>Ansprechpartner</Column>
                <Column style={valueCell}>{contactName}</Column>
              </Row>
              <Row>
                <Column style={labelCell}>E-Mail</Column>
                <Column style={valueCell}>
                  <Link href={`mailto:${email}`} style={linkStyle}>
                    {email}
                  </Link>
                </Column>
              </Row>
              <Row>
                <Column style={labelCell}>IP-Adresse</Column>
                <Column style={valueCell}>{ipAddress}</Column>
              </Row>
              <Row>
                <Column style={labelCell}>Datum</Column>
                <Column style={valueCell}>{createdAt}</Column>
              </Row>
            </Section>

            {/* Titles table */}
            <Text style={sectionTitle}>Angefragte Titel</Text>
            <Section style={table}>
              <Row style={tableHeader}>
                <Column style={tableHeaderCell}>Titel</Column>
                <Column style={{ ...tableHeaderCell, width: '80px', textAlign: 'right' }}>
                  Anzahl
                </Column>
              </Row>
              {titles.map((item, index) => (
                <Row key={index} style={index % 2 === 0 ? tableRowEven : tableRowOdd}>
                  <Column style={tableCell}>{item.title}</Column>
                  <Column style={{ ...tableCell, width: '80px', textAlign: 'right' }}>
                    {item.quantity}
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Notes */}
            {notes && (
              <>
                <Text style={sectionTitle}>Anmerkungen</Text>
                <Section style={detailsBox}>
                  <Text style={notesText}>{notes}</Text>
                </Section>
              </>
            )}

            <Hr style={hr} />

            <Text style={dashboardText}>
              <Link href={supabaseUrl} style={linkStyle}>
                Supabase Dashboard öffnen →
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>Lesewelt Verlag – Internes Benachrichtigungssystem</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '40px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: '0 auto',
  overflow: 'hidden',
}

const header: React.CSSProperties = {
  backgroundColor: '#0f2d5c',
  padding: '28px 32px',
}

const headerText: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '600',
  margin: 0,
}

const content: React.CSSProperties = {
  padding: '32px',
}

const alertBox: React.CSSProperties = {
  border: '2px solid #38bdf8',
  borderRadius: '6px',
  padding: '14px 20px',
  marginBottom: '24px',
  backgroundColor: '#f0f9ff',
}

const alertText: React.CSSProperties = {
  color: '#0f2d5c',
  fontSize: '15px',
  fontWeight: '600',
  margin: 0,
}

const sectionTitle: React.CSSProperties = {
  color: '#0f2d5c',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: '24px 0 8px',
}

const detailsBox: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  padding: '8px 16px',
}

const labelCell: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '500',
  padding: '6px 0',
  width: '140px',
}

const valueCell: React.CSSProperties = {
  color: '#111827',
  fontSize: '14px',
  padding: '6px 0',
}

const notesText: React.CSSProperties = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
}

const table: React.CSSProperties = {
  width: '100%',
}

const tableHeader: React.CSSProperties = {
  backgroundColor: '#0f2d5c',
}

const tableHeaderCell: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '600',
  padding: '10px 12px',
}

const tableRowEven: React.CSSProperties = {
  backgroundColor: '#ffffff',
}

const tableRowOdd: React.CSSProperties = {
  backgroundColor: '#f9fafb',
}

const tableCell: React.CSSProperties = {
  color: '#374151',
  fontSize: '14px',
  padding: '10px 12px',
  borderBottom: '1px solid #e5e7eb',
}

const hr: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}

const dashboardText: React.CSSProperties = {
  fontSize: '14px',
  margin: 0,
}

const linkStyle: React.CSSProperties = {
  color: '#38bdf8',
  textDecoration: 'none',
  fontWeight: '500',
}

const footer: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderTop: '1px solid #e5e7eb',
  padding: '16px 32px',
}

const footerText: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  textAlign: 'center',
  margin: 0,
}
