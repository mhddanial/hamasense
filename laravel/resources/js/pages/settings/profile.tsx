import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { LoaderCircle, Upload, Trash2 } from 'lucide-react';
import { useState, ChangeEvent, useEffect } from 'react';
import { toast } from 'sonner';
import { useInitials } from '@/hooks/use-initials';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengaturan Akun', href: edit().url },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth, flash } = usePage<SharedData>().props;
    const initials = useInitials();

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const [removeAvatar, setRemoveAvatar] = useState(false);

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setAvatarError('Ukuran gambar maksimal 2MB.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setAvatarError('File harus berupa gambar.');
            return;
        }

        setRemoveAvatar(false);
        setAvatarError(null);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
        setRemoveAvatar(true);
    };

    const getAvatarUrl = () => {
        if (removeAvatar) return null; // pakai fallback

        if (avatarPreview) return avatarPreview;

        const avatar = auth.user.avatar;
        if (!avatar) return null;

        if (avatar.startsWith('http')) return avatar;

        return `/storage/${avatar}`;
    };

    const avatarSrc = getAvatarUrl();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi Profil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informasi Profil" description="Perbarui nama, email, dan foto profil Anda" />

                    <Form
                        {...ProfileController.update.form()}
                        encType="multipart/form-data"
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Avatar */}
                                <div className="grid gap-2">
                                    <Label>Foto Profil</Label>

                                    <div className="flex items-center gap-6">
                                        {/* Avatar Preview */}
                                        <div className="h-24 w-24 rounded-full overflow-hidden border flex items-center justify-center bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white text-xl select-none">
                                            {avatarSrc ? (
                                                <img
                                                    src={avatarSrc}
                                                    alt="Avatar"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                initials(auth.user.name)
                                            )}
                                        </div>

                                        {/* Upload + Remove buttons */}
                                        <div className="space-y-3 flex flex-col">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="inline-flex items-center gap-2"
                                                onClick={() => document.getElementById("avatar-input")?.click()}
                                            >
                                                <Upload className="h-4 w-4" />
                                                Upload Foto
                                            </Button>

                                            <input
                                                id="avatar-input"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                name="avatar"
                                                onChange={handleAvatarChange}
                                            />

                                            {avatarSrc && !removeAvatar && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="inline-flex items-center gap-2"
                                                    onClick={handleRemoveAvatar}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Hapus Foto
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <InputError message={errors.avatar || avatarError || undefined} />
                                </div>

                                {/* Nama */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={auth.user.name}
                                        required
                                        placeholder="Nama Lengkap"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        disabled
                                        id="email"
                                        type="email"
                                        name="email"
                                        defaultValue={auth.user.email}
                                        required
                                        placeholder="Alamat Email"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Email Verification */}
                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Email Anda belum terverifikasi.{' '}
                                            <Link href={send()} as="button" className="underline text-primary">
                                                Klik untuk mengirim ulang verifikasi.
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                Tautan verifikasi telah dikirim.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Submit */}
                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-1" />}
                                        Simpan
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">Berhasil disimpan</p>
                                    </Transition>
                                </div>

                                {/* hidden: user menghapus avatar */}
                                {removeAvatar && <input type="hidden" name="remove_avatar" value="1" />}
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
