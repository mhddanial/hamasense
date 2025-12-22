import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number | null;
  onSuccess?: (deletedPostId: number) => void;
}

export default function DeletePostModal({
  isOpen,
  onClose,
  postId,
  onSuccess
}: DeletePostModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!postId) return;

    setIsDeleting(true);

    try {
      const response = await axios.delete(`/community/${postId}`);

      if (response.data.success) {
        if (onSuccess) {
          onSuccess(postId);
        }
        toast.success('Postingan berhasil dihapus!');
        onClose();
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus postingan');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Hapus Postingan?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Postingan akan dihapus secara permanen dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}