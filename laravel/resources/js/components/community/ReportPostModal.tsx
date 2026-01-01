import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ReportPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: number | null;
    onSuccess?: () => void;
}

const REPORT_REASONS = [
    { value: 'spam', label: 'Spam', description: 'Konten promosi atau iklan yang tidak relevan' },
    { value: 'inappropriate', label: 'Konten Tidak Pantas', description: 'Konten vulgar, kekerasan, atau menyinggung' },
    { value: 'harassment', label: 'Pelecehan', description: 'Pelecehan, bullying, atau ancaman' },
    { value: 'misinformation', label: 'Misinformasi', description: 'Informasi palsu atau menyesatkan' },
    { value: 'other', label: 'Lainnya', description: 'Alasan lain yang tidak tercantum di atas' },
];

export default function ReportPostModal({ isOpen, onClose, postId, onSuccess }: ReportPostModalProps) {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason) {
            toast.error('Pilih alasan pelaporan');
            return;
        }

        if (!postId) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post(`/community/${postId}/report`, {
                reason,
                description: description.trim() || null,
            });

            if (response.data.success) {
                toast.success(response.data.message);
                handleClose();
                onSuccess?.();
            }
        } catch (error: any) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Anda sudah melaporkan postingan ini');
            } else {
                toast.error('Gagal mengirim laporan. Silakan coba lagi.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setReason('');
        setDescription('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Laporkan Postingan
                    </DialogTitle>
                    <DialogDescription>
                        Bantu kami menjaga komunitas tetap aman dengan melaporkan konten yang melanggar pedoman.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-3">
                        <Label>Alasan Pelaporan *</Label>
                        <RadioGroup value={reason} onValueChange={setReason}>
                            {REPORT_REASONS.map((item) => (
                                <div
                                    key={item.value}
                                    className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${reason === item.value
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:bg-muted/50'
                                        }`}
                                    onClick={() => setReason(item.value)}
                                >
                                    <RadioGroupItem value={item.value} id={item.value} className="mt-0.5" />
                                    <div className="flex-1">
                                        <Label htmlFor={item.value} className="font-medium cursor-pointer">
                                            {item.label}
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Detail Tambahan (Opsional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Jelaskan lebih lanjut mengapa konten ini melanggar..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            maxLength={500}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {description.length}/500
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!reason || isSubmitting}
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            'Kirim Laporan'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
