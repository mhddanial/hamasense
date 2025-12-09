import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { AlertTriangle, Loader2 } from 'lucide-react';
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

  const handleDelete = () => {
    if (!postId) return;

    setIsDeleting(true);

    router.delete(`/community/${postId}`, {
      preserveScroll: true,
      onSuccess: () => {
        if (onSuccess) {
          onSuccess(postId);
        }
        onClose();
      },
      onError: (errors) => {
        console.error('Error:', errors);
        alert('Gagal menghapus postingan');
      },
      onFinish: () => {
        setIsDeleting(false);
      }
    });
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