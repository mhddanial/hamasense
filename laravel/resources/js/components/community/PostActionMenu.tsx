import React from 'react';
import { Edit, Trash2, Flag, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface PostActionMenuProps {
  postId: number;
  isOwnPost: boolean;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onReport?: (postId: number) => void;
  trigger?: React.ReactNode;
}

export default function PostActionMenu({
  postId,
  isOwnPost,
  onEdit,
  onDelete,
  onShare,
  onReport,
  trigger
}: PostActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isOwnPost ? (
          <>
            <DropdownMenuItem onClick={() => onEdit?.(postId)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Postingan
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(postId)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Postingan
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => onShare?.(postId)}>
              <Share2 className="mr-2 h-4 w-4" />
              Bagikan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onReport?.(postId)}
              className="text-destructive focus:text-destructive"
            >
              <Flag className="mr-2 h-4 w-4" />
              Laporkan
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}