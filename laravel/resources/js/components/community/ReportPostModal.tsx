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
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Loader2, Flag, FileText, CheckCircle2 } from 'lucide-react';

interface ReportPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: number | null;
    onSuccess?: () => void;
}

const REPORT_REASONS = [
    { value: 'spam', label: 'Spam', description: 'Konten promosi atau iklan yang tidak relevan', icon: '📢' },
    { value: 'inappropriate', label: 'Konten Tidak Pantas', description: 'Konten vulgar, kekerasan, atau menyinggung', icon: '⚠️' },
    { value: 'harassment', label: 'Pelecehan', description: 'Pelecehan, bullying, atau ancaman', icon: '🚫' },
    { value: 'misinformation', label: 'Misinformasi', description: 'Informasi palsu atau menyesatkan', icon: '❌' },
    { value: 'other', label: 'Lainnya', description: 'Alasan lain yang tidak tercantum di atas', icon: '📝' },
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

    const selectedReason = REPORT_REASONS.find(r => r.value === reason);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-[95vw] md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 md:p-6 border-b flex-shrink-0">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="flex items-center gap-3 text-lg md:text-xl">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                            </div>
                            Laporkan Postingan
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            Bantu kami menjaga komunitas tetap aman dengan melaporkan konten yang melanggar pedoman.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Scrollable Content Area - flex-1 to take remaining space */}
                <ScrollArea className="flex-1 overflow-auto">
                    <div className="p-4 md:p-6">
                        {/* Responsive Grid: Vertical on mobile, Horizontal on desktop */}
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">

                            {/* Left Side: Reason Selection (Full width mobile, 55% desktop) */}
                            <div className="w-full md:w-[55%] space-y-3">
                                <div className="flex items-center gap-2 mb-3">
                                    <Flag className="w-4 h-4 text-orange-500" />
                                    <Label className="text-sm font-semibold text-gray-700">
                                        Pilih Alasan Pelaporan <span className="text-red-500">*</span>
                                    </Label>
                                </div>

                                <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                                    {REPORT_REASONS.map((item) => (
                                        <div
                                            key={item.value}
                                            className={`flex items-start gap-3 p-3 md:p-4 rounded-xl border-2 transition-all cursor-pointer ${reason === item.value
                                                ? 'border-orange-400 bg-orange-50 shadow-sm'
                                                : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'
                                                }`}
                                            onClick={() => setReason(item.value)}
                                        >
                                            <RadioGroupItem
                                                value={item.value}
                                                id={item.value}
                                                className="mt-0.5 border-orange-400 text-orange-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{item.icon}</span>
                                                    <Label
                                                        htmlFor={item.value}
                                                        className={`font-medium cursor-pointer text-sm md:text-base ${reason === item.value ? 'text-orange-700' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </Label>
                                                </div>
                                                <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                            {reason === item.value && (
                                                <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                            )}
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Right Side: Description & Summary (Full width mobile, 45% desktop) */}
                            <div className="w-full md:w-[45%] space-y-4">
                                {/* Selected Reason Summary */}
                                {selectedReason && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 hidden md:block">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">{selectedReason.icon}</span>
                                            <span className="font-semibold text-orange-700">{selectedReason.label}</span>
                                        </div>
                                        <p className="text-sm text-orange-600/80">{selectedReason.description}</p>
                                    </div>
                                )}

                                {/* Additional Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                                            Detail Tambahan
                                            <span className="text-xs font-normal text-gray-400 ml-1">(Opsional)</span>
                                        </Label>
                                    </div>
                                    <Textarea
                                        id="description"
                                        placeholder="Jelaskan lebih lanjut mengapa konten ini perlu dilaporkan. Semakin detail informasi yang Anda berikan, semakin cepat tim kami dapat meninjau..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        maxLength={500}
                                        className="resize-none border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 text-sm"
                                    />
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>Berikan informasi sebanyak mungkin</span>
                                        <span className={description.length > 450 ? 'text-orange-500' : ''}>
                                            {description.length}/500
                                        </span>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                                    <p className="font-medium text-blue-700 mb-1">💡 Tips Pelaporan</p>
                                    <ul className="text-xs text-blue-600/80 space-y-1 list-disc list-inside">
                                        <li>Laporan akan ditinjau oleh tim moderasi kami</li>
                                        <li>Identitas pelapor akan dijaga kerahasiaannya</li>
                                        <li>Penyalahgunaan fitur laporan dapat dikenakan sanksi</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t bg-gray-50 p-4 md:p-6 flex-shrink-0">
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!reason || isSubmitting}
                            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Flag className="w-4 h-4" />
                                    Kirim Laporan
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

