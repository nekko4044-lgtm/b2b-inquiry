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
} from '@react-email/components'
import { TitleItem } from '@/types/inquiry'

interface ConfirmationEmailProps {
  contactName: string
  institutionName: string
  institutionType: string
  titles: TitleItem[]
  notes?: string
  createdAt: string
}

export default function ConfirmationEmail({
  contactName,
  institutionName,
  institutionType,
  titles,
  notes,
  createdAt,
}: ConfirmationEmailProps) {
  return (
    <Html lang="de">
      <Head />
      <Preview>Ihre Anfrage bei Lesewelt Verlag wurde erhalten.</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerText}>Lesewelt Verlag – Bestellbestätigung</Heading>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={paragraph}>Sehr geehrte(r) {contactName},</Text>
            <Text style={paragraph}>
              vielen Dank für Ihre Anfrage. Wir haben Ihre Bestellung erhalten und werden uns
              innerhalb von 24 Stunden bei Ihnen melden.
            </Text>

            {/* Details box */}
            <Section style={detailsBox}>
              <Text style={detailsTitle}>Ihre Angaben</Text>
              <Text style={detailsText}>
                <strong>Einrichtung:</strong> {institutionName}
              </Text>
              <Text style={detailsText}>
                <strong>Typ:</strong> {institutionType}
              </Text>
              <Text style={detailsText}>
                <strong>Datum:</strong> {createdAt}
              </Text>
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
              <Section style={notesBox}>
                <Text style={detailsTitle}>Anmerkungen</Text>
                <Text style={detailsText}>{notes}</Text>
              </Section>
            )}

            <Hr style={hr} />

            <Text style={paragraph}>
              Mit freundlichen Grüßen,
              <br />
              Ihr Lesewelt Verlag Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese
              Nachricht.
            </Text>
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

const paragraph: React.CSSProperties = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const detailsBox: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  padding: '16px 20px',
  margin: '16px 0 24px',
}

const notesBox: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  padding: '16px 20px',
  margin: '24px 0 0',
}

const detailsTitle: React.CSSProperties = {
  color: '#0f2d5c',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: '0 0 8px',
}

const detailsText: React.CSSProperties = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 4px',
}

const sectionTitle: React.CSSProperties = {
  color: '#0f2d5c',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: '24px 0 8px',
}

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
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
