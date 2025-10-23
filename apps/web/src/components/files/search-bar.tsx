'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type SearchBarProps = {
  onSearch: (query: string) => void
  onCategoryChange: (category: string) => void
  selectedCategory: string
}

const categories = [
  { value: 'all', label: 'All Files' },
  { value: 'invoice', label: 'Invoices' },
  { value: 'receipt', label: 'Receipts' },
  { value: 'resume', label: 'Resumes' },
  { value: 'contract', label: 'Contracts' },
  { value: 'photo', label: 'Photos' },
  { value: 'document', label: 'Documents' },
  { value: 'spreadsheet', label: 'Spreadsheets' },
  { value: 'presentation', label: 'Presentations' },
  { value: 'other', label: 'Other' }
]

export function SearchBar({ onSearch, onCategoryChange, selectedCategory }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="flex gap-3 mb-6">
      <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search files by name, tags, or description..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          />
          {query && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
          Search
        </Button>
      </form>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/20 text-white">
          {categories.map(cat => (
            <SelectItem
              key={cat.value}
              value={cat.value}
              className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
            >
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
