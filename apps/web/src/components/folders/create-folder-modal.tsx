'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateFolder } from '@/lib/queries/folders'
import { Folder } from 'lucide-react'

type CreateFolderModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentId?: string
}

export function CreateFolderModal({ open, onOpenChange, parentId }: CreateFolderModalProps) {
  const [name, setName] = useState('')
  const createFolder = useCreateFolder()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createFolder.mutate(
      { name, parentId },
      {
        onSuccess: () => {
          setName('')
          onOpenChange(false)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/20 cursor-pointer text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-400" />
            Create New Folder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Folder name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="bg-white/10 border-white/20 cursor-pointer text-white placeholder:text-slate-400"
            autoFocus
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 cursor-pointer text-black hover:bg-white/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createFolder.isPending || !name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createFolder.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
