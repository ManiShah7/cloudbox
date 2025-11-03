import { FolderOpen, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { Folder } from 'shared/types'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

type Props = {
  folder: Folder
  onFolderSelect: (folderId: string) => void
  onDeleteFolder: (folderId: string, folderName: string) => void
  index: number
}

export function FolderCard({ folder, onFolderSelect, onDeleteFolder, index }: Props) {
  return (
    <motion.div
      key={folder.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => onFolderSelect(folder.id)}
      className="group cursor-pointer"
    >
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <FolderOpen className="w-8 h-8 text-blue-400" />
          <Button
            size="sm"
            variant="destructive"
            onClick={e => {
              e.stopPropagation()
              onDeleteFolder(folder.id, folder.name)
            }}
            className="transition-opacity cursor-pointer bg-red-500/20 hover:bg-red-500/30 border border-red-500/50"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
        <h3 className="font-semibold text-white truncate">{folder.name}</h3>
      </Card>
    </motion.div>
  )
}
