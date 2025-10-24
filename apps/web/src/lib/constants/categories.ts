import {
  FileText,
  Receipt,
  Briefcase,
  Image,
  FileSpreadsheet,
  Presentation,
  File
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type CategoryConfig = {
  icon: LucideIcon
  color: string
  label: string
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  invoice: {
    icon: Briefcase,
    color: '#3b82f6',
    label: 'Invoice'
  },
  receipt: {
    icon: Receipt,
    color: '#8b5cf6',
    label: 'Receipt'
  },
  resume: {
    icon: FileText,
    color: '#10b981',
    label: 'Resume'
  },
  contract: {
    icon: FileText,
    color: '#f59e0b',
    label: 'Contract'
  },
  photo: {
    icon: Image,
    color: '#ec4899',
    label: 'Photo'
  },
  document: {
    icon: FileText,
    color: '#06b6d4',
    label: 'Document'
  },
  spreadsheet: {
    icon: FileSpreadsheet,
    color: '#84cc16',
    label: 'Spreadsheet'
  },
  presentation: {
    icon: Presentation,
    color: '#f97316',
    label: 'Presentation'
  },
  other: {
    icon: File,
    color: '#6b7280',
    label: 'Other'
  },
  uncategorized: {
    icon: File,
    color: '#475569',
    label: 'Uncategorized'
  }
}

export const getCategoryConfig = (category: string): CategoryConfig => {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other
}
