'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useFileLinks, useCreateShareLink, useRevokeShareLink } from '@/lib/queries/share'
import { Share2, Copy, Check, Trash2, Eye, Clock, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { formatDistanceToNow } from 'date-fns'

type ShareModalProps = {
  fileId: string
  fileName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareModal({ fileId, fileName, open, onOpenChange }: ShareModalProps) {
  const [expiresIn, setExpiresIn] = useState<'1h' | '1d' | '7d' | 'never'>('7d')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { data: links, isLoading, refetch, isFetching } = useFileLinks(fileId, open)
  const createLink = useCreateShareLink()
  const revokeLink = useRevokeShareLink()

  const handleCreateLink = () => {
    createLink.mutate({ fileId, expiresIn })
  }

  const handleCopyLink = (token: string, linkId: string) => {
    const url = `${window.location.origin}/share/${token}`
    navigator.clipboard.writeText(url)
    setCopiedId(linkId)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRevoke = (linkId: string) => {
    revokeLink.mutate(linkId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            Share <span className="truncate max-w-85">{fileName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create new link */}
          <div className="flex gap-3">
            <Select value={expiresIn} onValueChange={v => setExpiresIn(v as typeof expiresIn)}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20 text-white">
                <SelectItem value="1h" className="text-white hover:bg-white/10">
                  1 Hour
                </SelectItem>
                <SelectItem value="1d" className="text-white hover:bg-white/10">
                  1 Day
                </SelectItem>
                <SelectItem value="7d" className="text-white hover:bg-white/10">
                  7 Days
                </SelectItem>
                <SelectItem value="never" className="text-white hover:bg-white/10">
                  Never
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleCreateLink}
              disabled={createLink.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {createLink.isPending ? 'Creating...' : 'Create Share Link'}
            </Button>
          </div>

          {/* Existing links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">Active Links</h3>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => refetch()}
                disabled={isFetching}
                className="text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {isLoading ? (
              <p className="text-slate-400 text-sm">Loading...</p>
            ) : links && links.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {links.map(link => {
                  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date()
                  const shareUrl = `${window.location.origin}/share/${link.token}`

                  return (
                    <div
                      key={link.id}
                      className={`p-3 rounded-lg border ${
                        isExpired ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <code className="text-xs bg-black/30 px-2 py-1 rounded truncate flex-1 max-w-85">
                            {shareUrl}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyLink(link.token, link.id)}
                            className="text-blue-400 hover:bg-blue-100/10 border border-blue-400/50 flex-shrink-0 cursor-pointer"
                          >
                            {copiedId === link.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevoke(link.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 flex-shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {link.viewCount} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {link.expiresAt
                            ? isExpired
                              ? 'Expired'
                              : `Expires ${formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })}`
                            : 'Never expires'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-4">No share links yet</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
