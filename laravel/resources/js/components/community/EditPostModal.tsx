import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Post {
  id: number;
  category: string;
  content: string;
  image?: string;
}

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSuccess?: (updatedPost: any) => void;
}

export default function EditPostModal({ isOpen, onClose, post, onSuccess }: EditPostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    content: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (post) {
      setFormData({
        category: post.category,
        content: post.content,
        image: post.image || ''
      });
      setImagePreview(post.image || '');
    }
  }, [post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  const resetForm = () => {
    setFormData({ category: '', content: '', image: '' });
    setImagePreview('');
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim() || !formData.category) {
      toast.error('Mohon isi kategori dan konten postingan');
      return;
    }

    if (!post) return;

    setIsSubmitting(true);

    try {
      const response = await axios.put(`/community/${post.id}`, formData);

      if (response.data.success && onSuccess) {
        onSuccess(response.data.post);
        toast.success('Postingan berhasil diupdate!');
        resetForm();
        onClose();
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Gagal mengupdate postingan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Postingan</DialogTitle>
          <DialogDescription>
            Ubah konten postingan Anda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdatePost}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>Pilih kategori</option>
                <option value="budidaya">Budidaya Sayuran</option>
                <option value="tips">Tips &amp; Trik</option>
                <option value="hama">Hama &amp; Penyakit</option>
                <option value="pupuk">Pemupukan</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">
                Konten <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Tulis postingan Anda di sini..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Gambar (Opsional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image')?.click()}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Ubah Gambar
                </Button>
              </div>

              {imagePreview && (
                <div className="relative mt-2 rounded-lg overflow-hidden border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}