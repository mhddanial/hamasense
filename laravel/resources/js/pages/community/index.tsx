import React, { useState } from 'react';
import { Search, Plus, Heart, MessageSquare, Flag, Bookmark, MoreHorizontal, TrendingUp, Clock, Award } from 'lucide-react';
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    href: "/komunitas",
  },
];

export default function KomunitasPage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'terbaru' | 'mengikuti'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        id: 1,
        name: 'Andi Prasetyo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
        role: 'Ahli'
      },
      timestamp: '5 jam yang lalu',
      category: 'Budidaya Sayuran',
      content: 'Selamat pagi, teman-teman! Beberapa hari lalu tanaman cabai saya sempat terserang hama thrips yang menyebabkan daun menggulung dan layu. Saya mencoba metode organik dengan semprotan bawang putih dan daun cair alami setiap pagi selama 4 hari. Hasilnya cukup efektif — daun baru tumbuh sehat kembali dan bunga mulai bermunculan lagi 🌱',
      image: 'https://images.unsplash.com/photo-1583846112476-f60b035e2a33?w=600&q=80',
      likes: 1200,
      comments: 45,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 2,
      author: {
        id: 2,
        name: 'Siti Rahmawati',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
      },
      timestamp: '2 jam yang lalu',
      category: 'Tips & Trik',
      content: 'Tips untuk pemula yang mau mulai berkebun: Mulai dari tanaman yang mudah seperti kangkung atau bayam. Pastikan media tanam gembur dan kaya nutrisi. Siram secara teratur tapi jangan sampai becek. Letakkan di tempat yang cukup sinar matahari. Selamat mencoba! 🌿',
      likes: 856,
      comments: 32,
      isLiked: true,
      isBookmarked: false
    },
    {
      id: 3,
      author: {
        id: 3,
        name: 'Budi Santoso',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
      },
      timestamp: '1 hari yang lalu',
      category: 'Hama & Penyakit',
      content: 'Ada yang pernah mengalami daun tomat menguning dan kering? Saya sudah coba berbagai cara tapi belum ada perbaikan. Mohon saran dari para ahli di sini. Terima kasih sebelumnya!',
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80',
      likes: 432,
      comments: 28,
      isLiked: false,
      isBookmarked: true
    }
  ]);

  const topContributors: TopContributor[] = [
    {
      id: 1,
      name: 'Andi Prasetyo',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
      posts: 45,
      likes: 2800,
      comments: 1200,
      score: 300
    },
    {
      id: 2,
      name: 'Siti Rahmawati',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
      posts: 38,
      likes: 2100,
      comments: 980,
      score: 255
    },
    {
      id: 3,
      name: 'Rizky Fadillah',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rizky',
      posts: 32,
      likes: 1800,
      comments: 756,
      score: 200
    },
    {
      id: 4,
      name: 'Lina Marlina',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lina',
      posts: 28,
      likes: 1500,
      comments: 654,
      score: 150
    },
    {
      id: 5,
      name: 'Dewi Kartikasari',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
      posts: 24,
      likes: 1200,
      comments: 543,
      score: 130
    }
  ];

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
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
          <Button size="sm" className="md:w-auto w-full">
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
        <div className="flex gap-1 border-b border-sidebar-border">
          {[
            { key: 'trending', label: 'Trending', icon: TrendingUp },
            { key: 'terbaru', label: 'Terbaru', icon: Clock },
            { key: 'mengikuti', label: 'Mengikuti', icon: Award }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Posts Feed - Left Column (2/3) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {posts.map(post => (
              <Card key={post.id} className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden">
                {/* Post Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">{post.author.name}</h3>
                          {post.author.role && (
                            <Badge variant="secondary" className="text-xs">
                              {post.author.role}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{post.timestamp}</span>
                          <span>•</span>
                          <span className="text-primary">{post.category}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Post Content */}
                <CardContent className="space-y-3 pb-3">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {post.content}
                  </p>

                  {/* Post Image */}
                  {post.image && (
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={post.image}
                        alt="Post image"
                        className="w-full object-cover max-h-80"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-sidebar-border/50">
                    <div className="flex items-center gap-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLike(post.id)}
                        className={`gap-2 ${
                          post.isLiked ? 'text-red-500 hover:text-red-600' : ''
                        }`}
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={post.isLiked ? 'currentColor' : 'none'}
                        />
                        <span className="text-xs font-medium">{formatNumber(post.likes)}</span>
                      </Button>

                      <Button size="sm" variant="ghost" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs font-medium">{post.comments}</span>
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleBookmark(post.id)}
                        className={`h-8 w-8 ${
                          post.isBookmarked ? 'text-primary' : ''
                        }`}
                      >
                        <Bookmark
                          className="h-4 w-4"
                          fill={post.isBookmarked ? 'currentColor' : 'none'}
                        />
                      </Button>

                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Sidebar - Top Contributors */}
          <div className="flex flex-col gap-4">
            <Card className="border-sidebar-border/70 dark:border-sidebar-border sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="h-5 w-5 text-primary" />
                  Kontributor Teratas
                </CardTitle>
                <CardDescription className="text-xs">
                  Pengguna paling aktif minggu ini
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <ScrollArea className="pr-2">
                  <div className="space-y-3">
                    {topContributors.map((contributor, index) => (
                      <div
                        key={contributor.id}
                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contributor.avatar} alt={contributor.name} />
                            <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                          </Avatar>
                          {index < 3 && (
                            <div className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                              index === 0 ? 'bg-yellow-400 text-yellow-900' :
                              index === 1 ? 'bg-slate-300 text-slate-700' :
                              'bg-orange-400 text-orange-900'
                            }`}>
                              {index + 1}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <h3 className="text-sm font-semibold truncate">{contributor.name}</h3>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{contributor.posts} post</span>
                            <span>•</span>
                            <span>{formatNumber(contributor.likes)} suka</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{contributor.score}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-xs"
                >
                  Lihat Semua
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}