import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Head } from "@inertiajs/react";
import { usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import separated components
import CreatePostModal from "@/components/community/CreatePostModal";
import EditPostModal from "@/components/community/EditPostModal";
import DeletePostModal from "@/components/community/DeletePostModal";
import PostCard from "@/components/community/PostCard";

// Import custom hook
import { useCommunityPosts } from "@/hooks/useCommunityPosts";

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

interface TopContributor {
  id: number;
  name: string;
  avatar: string;
  posts: number;
  likes: number;
  comments: number;
  score: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Komunitas",
    href: "/community",
  },
];

export default function KomunitasPage({ initialPosts = [] }) {
  const { props } = usePage<any>();
  const currentUser = props.auth?.user;

  const [activeTab, setActiveTab] = useState<'trending' | 'terbaru' | 'mengikuti'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Use custom hook for posts logic
  const { posts, handleLike, handleBookmark, addPost, updatePost, deletePost } = useCommunityPosts(initialPosts);

  // Handler untuk Edit
  const handleEditClick = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsEditModalOpen(true);
    }
  };

  // Handler untuk Delete
  const handleDeleteClick = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsDeleteModalOpen(true);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Komunitas" />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Komunitas
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Berbagi pengalaman, bertanya, dan berdiskusi dengan sesama petani dan pecinta tanaman di seluruh Indonesia.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col gap-3 md:flex-row">
          <Button
            size="sm"
            className="md:w-auto w-full cursor-pointer bg-primary hover:bg-primary/90"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Buat Postingan
          </Button>

          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari postingan, pengguna, atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="budidaya">Budidaya Sayuran</SelectItem>
                <SelectItem value="tips">Tips & Trik</SelectItem>
                <SelectItem value="hama">Hama & Penyakit</SelectItem>
                <SelectItem value="pupuk">Pemupukan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs Navigation */}


        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Posts Feed - Left Column (2/3) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {posts.map(post => (
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
            ))}
          </div>

          {/* Right Sidebar - Top Contributors */}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newPost) => addPost(newPost)}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onSuccess={(updatedPost) => updatePost(updatedPost.id, updatedPost)}
      />

      {/* Delete Post Modal */}
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