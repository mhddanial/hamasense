import React, { useState } from 'react';
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

interface Category {
  slug: string;
  name: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newPost: any) => void;
  categories?: Category[];
}

export default function CreatePostModal({ isOpen, onClose, onSuccess, categories = [] }: CreatePostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPost, setNewPost] = useState({
    category: '',
    content: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setNewPost({ ...newPost, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setNewPost({ ...newPost, image: '' });
  };

  const resetForm = () => {
    setNewPost({ category: '', content: '', image: '' });
    setImagePreview('');
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPost.content.trim() || !newPost.category) {
      toast.error('Mohon isi kategori dan konten postingan');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/community', newPost);

      if (response.data.success && onSuccess) {
        onSuccess(response.data.post);
        toast.success('Postingan berhasil dibuat!');
        resetForm();
        onClose();
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Gagal membuat postingan');
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
          <DialogTitle>Buat Postingan Baru</DialogTitle>
          <DialogDescription>
            Bagikan pengalaman, tips, atau pertanyaan Anda dengan komunitas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreatePost}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">
                Konten <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Tulis postingan Anda di sini..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
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
                  Pilih Gambar
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
                  Memposting...
                </>
              ) : (
                'Posting'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}