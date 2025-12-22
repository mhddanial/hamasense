import { useState, useEffect } from 'react';
import { Search, Plus, Hash, MessageSquare } from 'lucide-react';
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { toast } from 'sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import Separated Components
import CreatePostModal from "@/components/community/CreatePostModal";
import EditPostModal from "@/components/community/EditPostModal";
import DeletePostModal from "@/components/community/DeletePostModal";
import PostCard from "@/components/community/PostCard";

// Import Custom Hook
import { useCommunityPosts } from "@/hooks/useCommunityPosts";

// --- Interfaces ---
interface User {
  id: number;
  name: string;
  avatar: string;
  role?: string;
}

interface Post {
  id: number;
  author: User;
  timestamp: string;
  category: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Komunitas",
    href: "/community",
  },
];

export default function KomunitasPage({ initialPosts = [] }) {
  const { props } = usePage<any>();
  const flash = props.flash;
  const currentUser = props.auth?.user;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Hook Logic
  const { posts, handleLike, handleBookmark, addPost, updatePost, deletePost } = useCommunityPosts(initialPosts);

  // FILTERING LOGIC
  const filteredPosts = posts.filter(post => {
    // Filter by category
    const matchCategory = selectedCategory === 'all' ||
                         post.category.toLowerCase() === selectedCategory.toLowerCase();

    // Filter by search query
    const matchSearch = searchQuery === '' ||
                       post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  useEffect(() => {
    if (flash?.toast) {
      const { type, message } = flash.toast;

      if (type === 'success') toast.success(message);
      if (type === 'error') toast.error(message);
      if (type === 'info') toast(message);
    }
  }, [flash?.toast]);

  useEffect(() => {
    if (flash?.newPost) {
      addPost(flash.newPost);
    }
  }, [flash?.newPost]);

  // Handlers
  const handleEditClick = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteClick = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsDeleteModalOpen(true);
    }
  };

  // Reset filter handler
  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  // Dummy Sidebar Data
  const popularTopics = ["#HidroponikPemula", "#CabeRawit", "#PupukOrganik", "#UrbanFarming", "#HamaKutuPutih"];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Komunitas" />

      {/* MAIN WRAPPER */}
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:px-12">

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              Forum Komunitas
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Ruang diskusi bagi petani dan pecinta tanaman untuk berbagi ilmu.
            </p>
          </div>

          <Button
            size="sm"
            className="md:w-auto w-full cursor-pointer bg-primary hover:bg-primary/90 shadow-sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Buat Postingan Baru
          </Button>
        </div>

        <Separator />

        {/* --- CONTROLS & TABS --- */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Cari topik diskusi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background"
                />
             </div>

             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[160px] bg-background">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="budidaya">Budidaya</SelectItem>
                  <SelectItem value="tips">Tips & Trik</SelectItem>
                  <SelectItem value="hama">Hama & Penyakit</SelectItem>
                  <SelectItem value="pupuk">Pemupukan</SelectItem>
                </SelectContent>
             </Select>
          </div>

          {/* Filter indicator */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredPosts.length} hasil ditemukan
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilter}
                className="h-8"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid gap-6 lg:grid-cols-3 min-h-[50vh]">

          {/* LEFT: POSTS FEED (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={currentUser?.id}
                        onLike={handleLike}
                        onBookmark={handleBookmark}
                        onComment={(postId) => console.log('Comment on:', postId)}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onReport={(postId) => console.log('Report:', postId)}
                        onShare={(postId) => console.log('Share:', postId)}
                    />
                ))
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-muted/30">
                    <div className="bg-muted p-4 rounded-full mb-3">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      {searchQuery || selectedCategory !== 'all'
                        ? 'Tidak ada postingan ditemukan'
                        : 'Belum ada postingan'
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      {searchQuery || selectedCategory !== 'all'
                        ? 'Coba ubah filter atau kata kunci pencarian'
                        : 'Jadilah yang pertama memulai diskusi di kategori ini!'
                      }
                    </p>
                    {(searchQuery || selectedCategory !== 'all') ? (
                      <Button
                        variant="link"
                        onClick={handleResetFilter}
                        className="mt-2 text-primary"
                      >
                        Reset Filter
                      </Button>
                    ) : (
                      <Button
                        variant="link"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-2 text-primary"
                      >
                        Buat Postingan Sekarang
                      </Button>
                    )}
                </div>
            )}
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="space-y-6">
            {/* Popular Topics Widget */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Hash className="h-4 w-4 text-primary" />
                        Topik Populer
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {popularTopics.map((topic, i) => (
                            <Badge
                                key={i}
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors px-3 py-1"
                                onClick={() => setSearchQuery(topic)}
                            >
                                {topic}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

             {/* Rules / Info Widget */}
             <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-800">
                <p className="font-semibold mb-1">Etika Komunitas</p>
                <p className="text-yellow-600/90 text-xs leading-relaxed">
                    Mari jaga komunitas tetap kondusif. Hindari spam, ujaran kebencian, dan hormati pendapat sesama petani.
                </p>
            </div>

          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newPost) => addPost(newPost)}
      />

      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onSuccess={(updatedPost) => updatePost(updatedPost.id, updatedPost)}
      />

      <DeletePostModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPost(null);
        }}
        postId={selectedPost?.id || null}
        onSuccess={(deletedPostId) => deletePost(deletedPostId)}
      />
    </AppLayout>
  );
}