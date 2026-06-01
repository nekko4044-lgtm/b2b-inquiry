export type InstitutionType = 'Bibliothek' | 'Kita'

export interface TitleItem {
  title: string
  quantity: number
}

export interface InquiryFormData {
  institution_type: InstitutionType
  institution_name: string
  contact_name: string
  email: string
  titles: TitleItem[]
  notes?: string
  hp_field?: string
}

export interface Lead extends InquiryFormData {
  id: string
  ip_address: string
  created_at: string
  status: 'new' | 'contacted' | 'closed'
}

export interface ApiResponse {
  success: boolean
  message?: string
  errors?: Record<string, string>
}
